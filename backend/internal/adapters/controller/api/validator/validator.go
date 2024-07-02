package validator

import (
	"fmt"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"regexp"
	"strconv"
	"strings"
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

	//_ = newValidator.RegisterValidation("accessToken", func(fl validator.FieldLevel) bool {
	//	return len(fl.Field().String()) == 20
	//})

	_ = newValidator.RegisterValidation("username", func(fl validator.FieldLevel) bool {
		return len(fl.Field().String()) >= 4 && len(fl.Field().String()) <= 20
	})

	_ = newValidator.RegisterValidation("password", func(fl validator.FieldLevel) bool {
		var passwordRegex = `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$`
		re := regexp.MustCompile(passwordRegex)
		return re.MatchString(fl.Field().String())
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
