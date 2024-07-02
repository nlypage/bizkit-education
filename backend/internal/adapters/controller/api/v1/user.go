package v1

import (
	"context"
	"github.com/gofiber/fiber/v2"
	"github.com/nlypage/bizkit-education/cmd/app"
	"github.com/nlypage/bizkit-education/internal/adapters/controller/api/validator"
	"github.com/nlypage/bizkit-education/internal/adapters/database/postgres"
	"github.com/nlypage/bizkit-education/internal/domain/dto"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
	"github.com/nlypage/bizkit-education/internal/domain/services"
)

// UserService is an interface that contains methods to interact with the user service
type UserService interface {
	Create(ctx context.Context, createUser *dto.CreateUser) (*entities.User, error)
}

// UserHandler is a struct that contains the userService and validator.
type UserHandler struct {
	userService UserService
	validator   *validator.Validator
}

// NewUserHandler is a function that returns a new instance of UserHandler.
func NewUserHandler(bizkitEduApp *app.BizkitEduApp) *UserHandler {
	userStorage := postgres.NewUserStorage(bizkitEduApp.DB)
	userService := services.NewUserService(userStorage)

	return &UserHandler{
		userService: userService,
		validator:   bizkitEduApp.Validator,
	}
}

// Create is handler for creating alarm system.
func (h UserHandler) Create(c *fiber.Ctx) error {
	var createUser dto.CreateUser

	if err := c.BodyParser(&createUser); err != nil {
		return err
	}

	errValidate := h.validator.ValidateData(createUser)
	if errValidate != nil {
		return errValidate
	}

	user, err := h.userService.Create(c.Context(), &createUser)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status": true,
		"body":   user,
	})
}

// Setup is a function that registers all routes for the user.
func (h UserHandler) Setup(router fiber.Router) {
	alarmSystemGroup := router.Group("/user")
	alarmSystemGroup.Post("/register", h.Create)
}
