package question

import (
	"context"
	"github.com/nlypage/bizkit-education/internal/domain/common/errroz"
	"github.com/nlypage/bizkit-education/internal/domain/dto"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
)

// Service is an interface that contains a method to create a question.
type Service interface {
	GetByUUID(ctx context.Context, uuid string) (*entities.Question, error)
	Create(ctx context.Context, question *dto.CreateQuestion) (*entities.Question, error)
}

// UserService is an interface that contains a method to change the balance of a user.
type UserService interface {
	ChangeBalance(ctx context.Context, uuid string, change int) (*entities.User, error)
}

type AnswerService interface {
	GetAll(ctx context.Context, limit, offset int, questionUUID string) ([]*entities.Answer, error)
	Create(ctx context.Context, answer *dto.CreateAnswer) (*entities.Answer, error)
}

// question is a struct that contains instances of services.
type questionUseCase struct {
	questionService Service
	userService     UserService
	answerService   AnswerService
}

// NewQuestionUseCase is a function that returns a new instance of questionUseCase.
func NewQuestionUseCase(questionService Service, userService UserService, answerService AnswerService) *questionUseCase {
	return &questionUseCase{
		questionService: questionService,
		userService:     userService,
		answerService:   answerService,
	}
}

// CreateQuestion is a method that creates a new question.
func (u questionUseCase) CreateQuestion(ctx context.Context, question *dto.CreateQuestion) (*entities.Question, error) {
	_, err := u.userService.ChangeBalance(ctx, question.UserUUID, -int(question.Reward))
	if err != nil {
		return nil, err
	}

	return u.questionService.Create(ctx, question)
}

// CreateAnswer is a method that creates a new answer.
func (u questionUseCase) CreateAnswer(ctx context.Context, createAnswer *dto.CreateAnswer) (*entities.Answer, error) {
	question, err := u.questionService.GetByUUID(ctx, createAnswer.QuestionUUID)
	if err != nil {
		return nil, err
	}

	if question.Closed {
		return nil, errroz.QuestionClosed
	}

	return u.answerService.Create(ctx, createAnswer)
}

// GetQuestionWithAnswers is a method that returns a question with its answers.
func (u questionUseCase) GetQuestionWithAnswers(ctx context.Context, questionUUID string) (*entities.QuestionWithAnswers, error) {
	question, err := u.questionService.GetByUUID(ctx, questionUUID)
	if err != nil {
		return nil, err
	}

	answers, err := u.answerService.GetAll(ctx, 0, 0, questionUUID)
	if err != nil {
		return nil, err
	}

	return &entities.QuestionWithAnswers{
		Question: *question,
		Answers:  answers,
	}, nil
}
