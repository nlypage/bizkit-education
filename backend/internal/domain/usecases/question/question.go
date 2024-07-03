package question

import (
	"context"
	"github.com/nlypage/bizkit-education/internal/domain/dto"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
)

// Service is an interface that contains a method to create a question.
type Service interface {
	Create(ctx context.Context, question *dto.CreateQuestion) (*entities.Question, error)
}

// UserService is an interface that contains a method to change the balance of a user.
type UserService interface {
	ChangeBalance(ctx context.Context, uuid string, change int) (*entities.User, error)
}

// question is a struct that contains instances of services.
type questionUseCase struct {
	questionService Service
	userService     UserService
}

// NewQuestionUseCase is a function that returns a new instance of questionUseCase.
func NewQuestionUseCase(questionService Service, userService UserService) *questionUseCase {
	return &questionUseCase{
		questionService: questionService,
		userService:     userService,
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
