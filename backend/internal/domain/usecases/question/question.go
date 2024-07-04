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
	Close(ctx context.Context, uuid string) (*entities.Question, error)
}

// UserService is an interface that contains a method to change the balance of a user.
type UserService interface {
	ChangeBalance(ctx context.Context, uuid string, change int) (*entities.User, error)
}

type AnswerService interface {
	GetAll(ctx context.Context, questionUUID string) ([]*entities.Answer, error)
	Create(ctx context.Context, answer *dto.CreateAnswer) (*entities.Answer, error)
	GetByUUID(ctx context.Context, uuid string) (*entities.Answer, error)
	Correct(ctx context.Context, answerUUID string) (*entities.Answer, error)
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

	answers, err := u.answerService.GetAll(ctx, questionUUID)
	if err != nil {
		return nil, err
	}

	return &entities.QuestionWithAnswers{
		Question: *question,
		Answers:  answers,
	}, nil
}

// CorrectAnswer is a method for confirming the correctness of the response and closing the question with reward for answer author.
func (u questionUseCase) CorrectAnswer(ctx context.Context, answerUUID string, userUUID string) (*entities.QuestionWithAnswers, error) {
	answer, err := u.answerService.GetByUUID(ctx, answerUUID)
	if err != nil {
		return nil, err
	}

	question, err := u.questionService.GetByUUID(ctx, answer.QuestionUUID)
	if err != nil {
		return nil, err
	}

	if question.AuthorUUID != userUUID {
		return nil, errroz.NotEnoughPermissions
	}

	if question.Closed {
		return nil, errroz.QuestionClosed
	}

	question, err = u.questionService.Close(ctx, question.UUID)
	if err != nil {
		return nil, err
	}

	answer, err = u.answerService.Correct(ctx, answer.UUID)
	if err != nil {
		return nil, err
	}

	if question.AuthorUUID != answer.AuthorUUID {
		_, err = u.userService.ChangeBalance(ctx, answer.AuthorUUID, int(question.Reward))
		if err != nil {
			return nil, err
		}
	}

	return u.GetQuestionWithAnswers(ctx, question.UUID)
}
