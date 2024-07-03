package middlewares

import (
	"context"
	"github.com/gofiber/fiber/v2"
	"github.com/nlypage/bizkit-education/cmd/app"
	"github.com/nlypage/bizkit-education/internal/adapters/database/postgres"
	"github.com/nlypage/bizkit-education/internal/domain/common/errroz"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
	"github.com/nlypage/bizkit-education/internal/domain/services"
	"github.com/nlypage/bizkit-education/internal/domain/utils"
)

type UserService interface {
	GetByUUID(ctx context.Context, uuid string) (*entities.User, error)
}

type MiddlewareHandler struct {
	userService UserService
}

// NewMiddlewareHandler is a function that returns a new instance of MiddlewareHandler.
func NewMiddlewareHandler(bizkitEduApp *app.BizkitEduApp) *MiddlewareHandler {
	userStorage := postgres.NewUserStorage(bizkitEduApp.DB)
	userService := services.NewUserService(userStorage)

	return &MiddlewareHandler{
		userService: userService,
	}
}

func (h MiddlewareHandler) IsAuthenticated(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	uuid, password, errParse := utils.ParseJwt(cookie)
	if errParse != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"status": false,
			"body":   errParse.Error(),
		})
	}

	user, errGetUser := h.userService.GetByUUID(c.Context(), uuid)
	if errGetUser != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"status": false,
			"body":   errGetUser.Error(),
		})
	}

	if string(user.Password) != password {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"status": false,
			"body":   errroz.TokenExpired.Error(),
		})
	}

	return c.Next()
}
