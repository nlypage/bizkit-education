package services

import (
	"context"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
)

// QuestionStorage is an interface that contains methods to interact with the database.
type QuestionStorage interface {
	Create(ctx context.Context, question *entities.Question) (*entities.Question, error)
	GetByUUID(ctx context.Context, uuid string) (*entities.Question, error)
	GetAll(ctx context.Context, limit, offset int) ([]*entities.Question, error)
	Update(ctx context.Context, question *entities.Question) (*entities.Question, error)
	Delete(ctx context.Context, uuid string) error
}

// userService is a struct that contains a pointer to an UserStorage instance.
type questionService struct {
	storage QuestionStorage
}

// NewQuestionService is a function that returns a new instance of questionService.
func NewQuestionService(storage UserStorage) *userService {
	return &userService{storage: storage}
}

//func (s questionService) Create(ctx context.Context, createUser *dto.CreateUser) (*entities.User, error) {
//	user := &entities.Question{
//		UUID:     uuid.NewString(),
//		Username: createUser.Username,
//		Email:    createUser.Email,
//	}
//	user.SetPassword(createUser.Password)
//
//	return s.storage.Create(ctx)
//}
