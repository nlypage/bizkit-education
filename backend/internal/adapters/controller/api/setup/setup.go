package setup

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	app "github.com/nlypage/bizkit-education/cmd/app"
)

func Setup(app *app.BizkitEduApp) {
	app.Fiber.Use(cors.New())

	if app.Logging {
		app.Fiber.Use(logger.New())
	}

	app.Fiber.Get("/ping", func(c *fiber.Ctx) error {
		c.Status(fiber.StatusOK)
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status": true,
			"body":   "pong",
		})
	})

	// Setup api v1 routes
	//apiV1 := app.Fiber.Group("/api/v1")

	// Setup alarm system routes
}
