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

// ConferenceService is an interface that contains a method to create a conference.
type ConferenceService interface {
	SetUrl(ctx context.Context, updateConference *dto.SetConferenceURL) (*entities.Conference, error)
	GetAll(ctx context.Context, limit, offset int, searchType string) ([]*entities.Conference, error)
	GetUserConferences(ctx context.Context, userUUID string) ([]*entities.Conference, error)
}

// ConferenceUseCase is an interface that contains a method to create a conference.
type ConferenceUseCase interface {
	NewConference(ctx context.Context, createConference *dto.CreateConference) (*entities.Conference, error)
}

// ConferenceHandler is a struct that contains instances of services.
type ConferenceHandler struct {
	conferenceService ConferenceService
	conferenceUseCase ConferenceUseCase
	validator         *validator.Validator
}

// NewConferenceHandler is a function that returns a new instance of ConferenceHandler.
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

// create is a method that creates a new conference.
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

	if createConference.StartTime.Before(time.Now()) {
		return errroz.InvalidStartTime
	}

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

// Update is a method that updates a conference.
func (h ConferenceHandler) setUrl(c *fiber.Ctx) error {
	var (
		setConferenceURL dto.SetConferenceURL
	)

	if err := c.BodyParser(&setConferenceURL); err != nil {
		return err
	}

	errValidate := h.validator.ValidateData(setConferenceURL)
	if errValidate != nil {
		return errValidate
	}

	conf, err := h.conferenceService.SetUrl(c.Context(), &setConferenceURL)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": true,
		"body":   conf,
	})
}

// GetAll is a method that returns all conferences.
func (h ConferenceHandler) GetAll(c *fiber.Ctx) error {
	searchType, err := h.validator.GetConferenceSearchType(c)
	if err != nil {
		return err
	}

	limit, offset := h.validator.GetLimitAndOffset(c)

	conferences, err := h.conferenceService.GetAll(c.Context(), limit, offset, searchType)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": true,
		"body":   conferences,
	})
}

// GetMy is a method that returns all conferences of the user.
func (h ConferenceHandler) GetMy(c *fiber.Ctx) error {
	uuid, err := utils.GetUUIDByToken(c)
	if err != nil {
		return err
	}

	conferences, err := h.conferenceService.GetUserConferences(c.Context(), uuid)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": true,
		"body":   conferences,
	})
}

// Setup is a method that sets up conference routes.
func (h ConferenceHandler) Setup(router fiber.Router, handler fiber.Handler) {
	conferenceGroup := router.Group("/conference")
	conferenceGroup.Post("/create", h.create, handler)
	conferenceGroup.Patch("/url", h.setUrl, handler)
	conferenceGroup.Get("/my", h.GetMy, handler)
	conferenceGroup.Get("/all", h.GetAll, handler)
}
