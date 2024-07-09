package validator

import (
	"fmt"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/nlypage/bizkit-education/internal/domain/common/errroz"
	"strconv"
	"strings"
	"unicode"
)

type Validator struct {
	validator *validator.Validate
}

type GlobalErrorHandlerResp struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type ErrorResponse struct {
	Error       bool
	FailedField string
	Tag         string
	Value       interface{}
}

func New() *Validator {
	newValidator := validator.New()

	_ = newValidator.RegisterValidation("username", func(fl validator.FieldLevel) bool {
		return len(fl.Field().String()) >= 4 && len(fl.Field().String()) <= 20
	})

	_ = newValidator.RegisterValidation("password", func(fl validator.FieldLevel) bool {
		password := fl.Field().String()
		hasMinLength := len(password) >= 8
		hasUppercase := strings.ToLower(password) != password
		hasLowercase := strings.ToUpper(password) != password
		hasDigit := strings.IndexFunc(password, func(c rune) bool { return unicode.IsDigit(c) }) != -1

		return hasMinLength && hasUppercase && hasLowercase && hasDigit
	})

	_ = newValidator.RegisterValidation("header", func(fl validator.FieldLevel) bool {
		return len(fl.Field().String()) >= 5 && len(fl.Field().String()) <= 150
	})

	_ = newValidator.RegisterValidation("body", func(fl validator.FieldLevel) bool {
		return len(fl.Field().String()) >= 5 && len(fl.Field().String()) <= 1500
	})

	_ = newValidator.RegisterValidation("subject", func(fl validator.FieldLevel) bool {
		switch fl.Field().String() {
		case "Русский язык", "Математика", "Физика", "Литература", "Информатика":
			return true
		default:
			return false
		}
	})

	return &Validator{
		newValidator,
	}
}

func (v Validator) ValidateData(data interface{}) *fiber.Error {
	validationErrors := []ErrorResponse{}

	errs := v.validator.Struct(data)
	if errs != nil {
		for _, err := range errs.(validator.ValidationErrors) {
			var elem ErrorResponse

			elem.FailedField = err.Field() // Export struct field name
			elem.Tag = err.Tag()           // Export struct tag
			elem.Value = err.Value()       // Export field value
			elem.Error = true

			validationErrors = append(validationErrors, elem)
		}
	}

	if len(validationErrors) > 0 && validationErrors[0].Error {
		errMsgs := make([]string, 0)

		for _, err := range validationErrors {
			errMsgs = append(errMsgs, fmt.Sprintf(
				"[%s]: '%v' | Needs to implement '%s'",
				err.FailedField,
				err.Value,
				err.Tag,
			))
		}

		return &fiber.Error{
			Code:    fiber.ErrBadRequest.Code,
			Message: strings.Join(errMsgs, " and "),
		}
	}
	return nil
}

func (v Validator) GetLimitAndOffset(c *fiber.Ctx) (int, int) {
	limit, err := strconv.Atoi(c.Query("limit", "10"))
	if err != nil {
		return 0, 10
	}
	offset, err := strconv.Atoi(c.Query("offset", "0"))
	if err != nil {
		return 0, 10
	}
	return limit, offset
}

func (v Validator) GetSubject(c *fiber.Ctx) (string, error) {
	subject := c.Query("subject", "")
	if subject == "" {
		return subject, nil
	}
	switch subject {
	case "Русский язык", "Математика", "Физика", "Литература", "Информатика":
		return subject, nil
	default:
		return "", errroz.InvalidSubject
	}
}

func (v Validator) GetConferenceSearchType(c *fiber.Ctx) (string, error) {
	searchType := c.Query("search_type", "upcoming")
	if searchType != "upcoming" && searchType != "archived" && searchType != "all" {
		return "", errroz.InvalidSearchMethod
	}
	return searchType, nil
}
