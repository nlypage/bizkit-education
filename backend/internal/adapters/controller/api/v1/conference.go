package v1

import (
	"context"
	"github.com/gofiber/fiber/v2"
	"github.com/nlypage/bizkit-education/cmd/app"
	"github.com/nlypage/bizkit-education/internal/adapters/controller/api/validator"
	"github.com/nlypage/bizkit-education/internal/adapters/database/postgres"
	"github.com/nlypage/bizkit-education/internal/domain/common/errroz"
	"github.com/nlypage/bizkit-education/internal/domain/dto"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
	"github.com/nlypage/bizkit-education/internal/domain/services"
	"github.com/nlypage/bizkit-education/internal/domain/utils"
	"time"
)

type ConferenceService interface {
	Create(ctx context.Context, createConference *dto.CreateConference) (*entities.Conference, error)
}

type ConferenceHandler struct {
	conferenceService ConferenceService
	validator         *validator.Validator
}

func NewConferenceHandler(bizkitEduApp *app.BizkitEduApp) *ConferenceHandler {
	conferenceStorage := postgres.NewConferenceStorage(bizkitEduApp.DB)
	conferenceService := services.NewConferenceService(conferenceStorage)

	return &ConferenceHandler{
		conferenceService: conferenceService,
		validator:         bizkitEduApp.Validator,
	}
}

func (h ConferenceHandler) create(c *fiber.Ctx) error {
	var (
		createConference dto.CreateConference
		data             map[string]interface{}
	)

	if err := c.BodyParser(&createConference); err != nil {
		return err
	}

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	startTime, ok := data["start_time"]
	if !ok {
		return errroz.ParsingError
	}

	parsedTime, err := time.Parse("2006-01-02T15:04", startTime.(string))
	if err != nil {
		return err
	}
	createConference.StartTime = parsedTime

	uuid, err := utils.GetUUIDByToken(c)
	if err != nil {
		return err
	}
	createConference.AuthorUUID = uuid

	errValidate := h.validator.ValidateData(createConference)
	if errValidate != nil {
		return errValidate
	}

	conference, err := h.conferenceService.Create(c.Context(), &createConference)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": true,
		"body":   conference,
	})
}

func (h ConferenceHandler) Setup(router fiber.Router, handler fiber.Handler) {
	conferenceGroup := router.Group("/conference")
	conferenceGroup.Post("/create", h.create, handler)
}
