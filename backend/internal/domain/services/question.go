package services

import (
	"context"
	"github.com/google/uuid"
	"github.com/nlypage/bizkit-education/internal/domain/dto"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
)

// QuestionStorage is an interface that contains methods to interact with the database.
type QuestionStorage interface {
	Create(ctx context.Context, question *entities.Question) (*entities.Question, error)
	GetByUUID(ctx context.Context, uuid string) (*entities.Question, error)
	GetAll(ctx context.Context, limit, offset int, subject string) ([]*entities.Question, error)
	Update(ctx context.Context, question *entities.Question) (*entities.Question, error)
	Delete(ctx context.Context, uuid string) error
}

// userService is a struct that contains a pointer to an UserStorage instance.
type questionService struct {
	storage QuestionStorage
}

// NewQuestionService is a function that returns a new instance of questionService.
func NewQuestionService(storage QuestionStorage) *questionService {
	return &questionService{storage: storage}
}

// Create is a method that creates a new question.
func (s questionService) Create(ctx context.Context, createQuestion *dto.CreateQuestion) (*entities.Question, error) {
	question := &entities.Question{
		UUID:    uuid.NewString(),
		Header:  createQuestion.Header,
		Body:    createQuestion.Body,
		Subject: createQuestion.Subject,
		Reward:  createQuestion.Reward,
	}

	return s.storage.Create(ctx, question)
}

func (s questionService) GetAll(ctx context.Context, limit, offset int, subject string) ([]*entities.Question, error) {
	return s.storage.GetAll(ctx, limit, offset, subject)
}

func (s questionService) GetByUUID(ctx context.Context, uuid string) (*entities.Question, error) {
	return s.storage.GetByUUID(ctx, uuid)
}
