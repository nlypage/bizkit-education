package services

import (
	"context"
	"github.com/google/uuid"
	"github.com/nlypage/bizkit-education/internal/domain/common/errroz"
	"github.com/nlypage/bizkit-education/internal/domain/dto"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
	"github.com/nlypage/bizkit-education/internal/domain/utils"
)

// UserStorage is an interface that contains methods to interact with the database.
type UserStorage interface {
	Create(ctx context.Context, user *entities.User) (*entities.User, error)
	GetByUUID(ctx context.Context, uuid string) (*entities.User, error)
	GetAll(ctx context.Context, limit, offset int) ([]*entities.User, error)
	Update(ctx context.Context, user *entities.User) (*entities.User, error)
	Delete(ctx context.Context, uuid string) error
	GetByUsernameAndPassword(ctx context.Context, username string, password string) (*entities.User, error)
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

func (s userService) GenerateJwt(ctx context.Context, authUser *dto.AuthUser) (string, error) {
	user, err := s.storage.GetByUsernameAndPassword(ctx, authUser.Username, authUser.Password)
	if err != nil {
		return "", err
	}
	return utils.GenerateJwt(user.UUID, string(user.Password))
}

func (s userService) GetByUUID(ctx context.Context, uuid string) (*entities.User, error) {
	return s.storage.GetByUUID(ctx, uuid)
}

func (s userService) ChangeBalance(ctx context.Context, uuid string, change int) (*entities.User, error) {
	user, err := s.storage.GetByUUID(ctx, uuid)
	if err != nil {
		return nil, err
	}

	if user.CoinsAmount+change < 0 {
		return nil, errroz.NotEnoughCoins
	}

	user.CoinsAmount += change
	return s.storage.Update(ctx, user)
}
