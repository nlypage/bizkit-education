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

// QuestionService is an interface that contains methods to interact with the question service
type QuestionService interface {
	Create(ctx context.Context, createQuestion *dto.CreateQuestion) (*entities.Question, error)
}

// QuestionHandler is a struct that contains the questionService and validator.
type QuestionHandler struct {
	questionService QuestionService
	validator       *validator.Validator
}

// NewQuestionHandler is a function that returns a new instance of QuestionHandler.
func NewQuestionHandler(bizkitEduApp *app.BizkitEduApp) *QuestionHandler {
	questionStorage := postgres.NewQuestionStorage(bizkitEduApp.DB)
	questionService := services.NewQuestionService(questionStorage)

	return &QuestionHandler{
		questionService: questionService,
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

	question, err := h.questionService.Create(c.Context(), &createQuestion)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status": true,
		"body":   question,
	})
}

// Setup is a function that registers all routes for the question.
func (h QuestionHandler) Setup(router fiber.Router, handler fiber.Handler) {
	userGroup := router.Group("/question", handler)
	userGroup.Post("/create", h.Create)
}
