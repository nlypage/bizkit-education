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
	"github.com/nlypage/bizkit-education/internal/domain/utils"
)

// UserService is an interface that contains methods to interact with the user service
type UserService interface {
	Create(ctx context.Context, createUser *dto.CreateUser) (*entities.User, error)
	GenerateJwt(ctx context.Context, authUser *dto.AuthUser) (string, error)
	GetByUUID(ctx context.Context, uuid string) (*entities.User, error)
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

// Register is handler for user registration.
func (h UserHandler) register(c *fiber.Ctx) error {
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

func (h UserHandler) auth(c *fiber.Ctx) error {
	var authUser dto.AuthUser

	if err := c.BodyParser(&authUser); err != nil {
		return err
	}

	errValidate := h.validator.ValidateData(authUser)
	if errValidate != nil {
		return errValidate
	}

	jwt, err := h.userService.GenerateJwt(c.Context(), &authUser)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": true,
		"body":   jwt,
	})
}

func (h UserHandler) me(c *fiber.Ctx) error {
	uuid, err := utils.GetUUIDByToken(c)
	if err != nil {
		return err
	}

	user, err := h.userService.GetByUUID(c.Context(), uuid)
	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"status": true,
		"body":   user,
	})

}

// Setup is a function that registers all routes for the user.
func (h UserHandler) Setup(router fiber.Router, middleware fiber.Handler) {
	userGroup := router.Group("/user")
	userGroup.Post("/register", h.register)
	userGroup.Post("/auth", h.auth)
	userGroup.Get("/me", h.me, middleware)
}
