package conference

import (
	"context"
	"github.com/nlypage/bizkit-education/internal/domain/dto"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
)

type Service interface {
	Create(ctx context.Context, createConference *dto.CreateConference) (*entities.Conference, error)
}

type UserService interface {
	ChangeBalance(ctx context.Context, uuid string, change int) (*entities.User, error)
}

type conferenceUseCase struct {
	conferenceService Service
	userService       UserService
}

func NewConferenceUseCase(conferenceService Service, userService UserService) *conferenceUseCase {
	return &conferenceUseCase{
		conferenceService: conferenceService,
		userService:       userService,
	}
}

func (u conferenceUseCase) NewConference(ctx context.Context, createConference *dto.CreateConference) (*entities.Conference, error) {
	_, err := u.userService.ChangeBalance(ctx, createConference.AuthorUUID, -50)
	if err != nil {
		return nil, err
	}

	return u.conferenceService.Create(ctx, createConference)
}
