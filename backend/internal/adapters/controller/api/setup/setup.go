package setup

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	app "github.com/nlypage/bizkit-education/cmd/app"
	v1 "github.com/nlypage/bizkit-education/internal/adapters/controller/api/v1"
	"github.com/nlypage/bizkit-education/internal/adapters/controller/api/v1/middlewares"
)

func Setup(app *app.BizkitEduApp) {
	app.Fiber.Use(cors.New())

	if app.Logging {
		app.Fiber.Use(logger.New())
	}

	// Setup api v1 routes
	apiV1 := app.Fiber.Group("/api/v1")

	// Setup user routes
	userHandler := v1.NewUserHandler(app)
	userHandler.Setup(apiV1)

	middlewareHandler := middlewares.NewMiddlewareHandler(app)

	superPuperApiPingGroup := app.Fiber.Group("/superPuperApiPingGroup")
	superPuperApiPingGroup.Use(middlewareHandler.IsAuthenticated)
	superPuperApiPingGroup.Get("/ping", func(c *fiber.Ctx) error {
		c.Status(fiber.StatusOK)
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status": true,
			"body":   "pong",
		})
	})
}
