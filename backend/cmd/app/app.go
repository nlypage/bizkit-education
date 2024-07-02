package app

import (
	"github.com/gofiber/fiber/v2"
	"github.com/nlypage/bizkit-education/internal/adapters/config"
	bizkitEduValidator "github.com/nlypage/bizkit-education/internal/adapters/controller/api/validator"

	"gorm.io/gorm"
)

// BizkitEduApp app is a struct that contains the fiber app, database connection, listen port, validator and logging boolean.
type BizkitEduApp struct {
	Fiber      *fiber.App
	DB         *gorm.DB
	listenPort string
	Validator  *bizkitEduValidator.Validator
	Logging    bool
}

// NewBizkitEduApp New is a function that creates a new app struct
func NewBizkitEduApp(config *config.Config) *BizkitEduApp {
	fiberApp := fiber.New(fiber.Config{
		// Global custom error handler
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return c.Status(fiber.StatusBadRequest).JSON(bizkitEduValidator.GlobalErrorHandlerResp{
				Success: false,
				Message: err.Error(),
			})
		},
	},
	)

	return &BizkitEduApp{
		Fiber:      fiberApp,
		DB:         config.Database,
		listenPort: config.ListenPort,
		Validator:  bizkitEduValidator.New(),
		Logging:    config.Logging,
	}
}

// Start is a function that starts the app
func (a *BizkitEduApp) Start() {
	if err := a.Fiber.ListenTLS(":"+a.listenPort, "fullchain.pem", "privkey.pem"); err != nil {
		panic(err)
	}
}
