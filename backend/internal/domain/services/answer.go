package services

import (
	"context"
	"github.com/google/uuid"
	"github.com/nlypage/bizkit-education/internal/domain/dto"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
)

// AnswerStorage is an interface that contains methods to interact with the database.
type AnswerStorage interface {
	Create(ctx context.Context, answer *entities.Answer) (*entities.Answer, error)
	GetByUUID(ctx context.Context, uuid string) (*entities.Answer, error)
	GetAll(ctx context.Context, questionUUID string) ([]*entities.Answer, error)
	Update(ctx context.Context, answer *entities.Answer) (*entities.Answer, error)
	Delete(ctx context.Context, uuid string) error
}

// answerService is a struct that contains a pointer to a AnswerStorage instance.
type answerService struct {
	storage AnswerStorage
}

// NewAnswerService is a function that returns a new instance of answerService.
func NewAnswerService(storage AnswerStorage) *answerService {
	return &answerService{storage: storage}
}

// Create is a method that creates a new answer.
func (s answerService) Create(ctx context.Context, createAnswer *dto.CreateAnswer) (*entities.Answer, error) {
	answer := &entities.Answer{
		UUID:         uuid.NewString(),
		Body:         createAnswer.Body,
		QuestionUUID: createAnswer.QuestionUUID,
		AuthorUUID:   createAnswer.AuthorUUID,
	}

	return s.storage.Create(ctx, answer)
}

// GetAll is a method that returns all question answers.
func (s answerService) GetAll(ctx context.Context, questionUUID string) ([]*entities.Answer, error) {
	return s.storage.GetAll(ctx, questionUUID)
}
