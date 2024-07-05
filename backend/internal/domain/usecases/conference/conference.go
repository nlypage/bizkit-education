package conference

import (
	"context"
	"github.com/nlypage/bizkit-education/internal/domain/dto"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
)

// Service is an interface that contains a method to create a conference.
type Service interface {
	Create(ctx context.Context, createConference *dto.CreateConference) (*entities.Conference, error)
}

// UserService is an interface that contains a method to change the balance of a user.
type UserService interface {
	ChangeBalance(ctx context.Context, uuid string, change int) (*entities.User, error)
}

// conferenceUseCase is an interface that contains a method to create a conference.
type conferenceUseCase struct {
	conferenceService Service
	userService       UserService
}

// NewConferenceUseCase is a function that returns a new instance of conferenceUseCase.
func NewConferenceUseCase(conferenceService Service, userService UserService) *conferenceUseCase {
	return &conferenceUseCase{
		conferenceService: conferenceService,
		userService:       userService,
	}
}

// NewConference is a method that creates a new conference.
func (u conferenceUseCase) NewConference(ctx context.Context, createConference *dto.CreateConference) (*entities.Conference, error) {
	_, err := u.userService.ChangeBalance(ctx, createConference.AuthorUUID, -50)
	if err != nil {
		return nil, err
	}

	return u.conferenceService.Create(ctx, createConference)
}
