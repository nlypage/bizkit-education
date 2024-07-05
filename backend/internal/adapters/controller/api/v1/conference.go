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
	"github.com/nlypage/bizkit-education/internal/domain/usecases/conference"
	"github.com/nlypage/bizkit-education/internal/domain/utils"
	"time"
)

type ConferenceService interface {
	Create(ctx context.Context, createConference *dto.CreateConference) (*entities.Conference, error)
}

type ConferenceUseCase interface {
	NewConference(ctx context.Context, createConference *dto.CreateConference) (*entities.Conference, error)
}

type ConferenceHandler struct {
	conferenceService ConferenceService
	conferenceUseCase ConferenceUseCase
	validator         *validator.Validator
}

func NewConferenceHandler(bizkitEduApp *app.BizkitEduApp) *ConferenceHandler {
	conferenceStorage := postgres.NewConferenceStorage(bizkitEduApp.DB)
	conferenceService := services.NewConferenceService(conferenceStorage)

	userStorage := postgres.NewUserStorage(bizkitEduApp.DB)
	userService := services.NewUserService(userStorage)

	conferenceUseCase := conference.NewConferenceUseCase(conferenceService, userService)

	return &ConferenceHandler{
		conferenceService: conferenceService,
		conferenceUseCase: conferenceUseCase,
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

	conf, err := h.conferenceUseCase.NewConference(c.Context(), &createConference)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": true,
		"body":   conf,
	})
}

func (h ConferenceHandler) Setup(router fiber.Router, handler fiber.Handler) {
	conferenceGroup := router.Group("/conference")
	conferenceGroup.Post("/create", h.create, handler)
}
