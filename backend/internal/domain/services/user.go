package services

import (
	"context"
	"github.com/google/uuid"
	"github.com/nlypage/bizkit-education/internal/domain/dto"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
)

// UserStorage is an interface that contains methods to interact with the database.
type UserStorage interface {
	Create(ctx context.Context, user *entities.User) (*entities.User, error)
	GetByUUID(ctx context.Context, uuid string) (*entities.User, error)
	GetAll(ctx context.Context, limit, offset int) ([]*entities.User, error)
	Update(ctx context.Context, user *entities.User) (*entities.User, error)
	Delete(ctx context.Context, uuid string) error
}

// userService is a struct that contains a pointer to an UserStorage instance.
type userService struct {
	storage UserStorage
}

// NewUserService is a function that returns a new instance of userService.
func NewUserService(storage UserStorage) *userService {
	return &userService{storage: storage}
}

func (s userService) Create(ctx context.Context, createUser *dto.CreateUser) (*entities.User, error) {
	user := &entities.User{
		UUID:     uuid.NewString(),
		Username: createUser.Username,
		Email:    createUser.Email,
	}
	user.SetPassword(createUser.Password)

	return s.storage.Create(ctx, user)
}
