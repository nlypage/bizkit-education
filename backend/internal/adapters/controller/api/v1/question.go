package v1

import (
	"context"
	"github.com/gofiber/fiber/v2"
	"github.com/nlypage/bizkit-education/cmd/app"
	apiDto "github.com/nlypage/bizkit-education/internal/adapters/controller/api/dto"
	"github.com/nlypage/bizkit-education/internal/adapters/controller/api/validator"
	"github.com/nlypage/bizkit-education/internal/adapters/database/postgres"
	"github.com/nlypage/bizkit-education/internal/domain/dto"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
	"github.com/nlypage/bizkit-education/internal/domain/services"
	"github.com/nlypage/bizkit-education/internal/domain/usecases/question"
	"github.com/nlypage/bizkit-education/internal/domain/utils"
)

// QuestionService is an interface that contains methods to interact with the question service
type QuestionService interface {
	Create(ctx context.Context, createQuestion *dto.CreateQuestion) (*entities.Question, error)
	GetAll(ctx context.Context, limit, offset int, subject string) ([]*entities.Question, error)
	GetByUUID(ctx context.Context, uuid string) (*entities.Question, error)
}

type QuestionUseCase interface {
	CreateQuestion(ctx context.Context, question *dto.CreateQuestion) (*entities.Question, error)
}

// QuestionHandler is a struct that contains the questionService and validator.
type QuestionHandler struct {
	questionService QuestionService
	questionUseCase QuestionUseCase
	validator       *validator.Validator
}

// NewQuestionHandler is a function that returns a new instance of QuestionHandler.
func NewQuestionHandler(bizkitEduApp *app.BizkitEduApp) *QuestionHandler {
	questionStorage := postgres.NewQuestionStorage(bizkitEduApp.DB)
	questionService := services.NewQuestionService(questionStorage)

	userStorage := postgres.NewUserStorage(bizkitEduApp.DB)
	userService := services.NewUserService(userStorage)

	questionUseCase := question.NewQuestionUseCase(questionService, userService)

	return &QuestionHandler{
		questionService: questionService,
		questionUseCase: questionUseCase,
		validator:       bizkitEduApp.Validator,
	}
}

func (h QuestionHandler) Create(c *fiber.Ctx) error {
	var createQuestion dto.CreateQuestion

	if err := c.BodyParser(&createQuestion); err != nil {
		return err
	}

	errValidate := h.validator.ValidateData(createQuestion)
	if errValidate != nil {
		return errValidate
	}

	uuid, err := utils.GetUUIDByToken(c)
	if err != nil {
		return err
	}
	createQuestion.UserUUID = uuid

	question, err := h.questionUseCase.CreateQuestion(c.Context(), &createQuestion)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status": true,
		"body":   question,
	})
}

// GetAll is a handler for getting all questions.
func (h QuestionHandler) GetAll(c *fiber.Ctx) error {
	limit, offset := h.validator.GetLimitAndOffset(c)
	subject, err := h.validator.GetSubject(c)
	if err != nil {
		return err
	}

	questions, err := h.questionService.GetAll(c.Context(), limit, offset, subject)
	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"status": true,
		"body":   questions,
	})
}

// GetByUUID is a handler for getting a question by UUID.
func (h QuestionHandler) GetByUUID(c *fiber.Ctx) error {
	var uuid4 apiDto.UUID
	uuid := c.Params("uuid")

	uuid4.UUID = uuid

	errValidate := h.validator.ValidateData(uuid4)
	if errValidate != nil {
		return errValidate
	}

	question, err := h.questionService.GetByUUID(c.Context(), uuid4.UUID)
	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"status": true,
		"body":   question,
	})
}

// Setup is a function that registers all routes for the question.
func (h QuestionHandler) Setup(router fiber.Router, handler fiber.Handler) {
	userGroup := router.Group("/question")
	userGroup.Post("/create", h.Create, handler)
	userGroup.Get("/all", h.GetAll)
	userGroup.Get("/:uuid", h.GetByUUID)
}
