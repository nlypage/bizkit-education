package conference

import (
	"context"
	"github.com/nlypage/bizkit-education/internal/domain/dto"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
)

// Service is an interface that contains a method to create a conference.
type Service interface {
	Create(ctx context.Context, createConference *dto.CreateConference) (*entities.Conference, error)
	GetAll(ctx context.Context, limit, offset int, searchType string) ([]*entities.Conference, error)
	GetByUUID(ctx context.Context, uuid string) (*entities.Conference, error)
	GetUserConferences(ctx context.Context, userUUID string) ([]*entities.Conference, error)
}

// UserService is an interface that contains a method to change the balance of a user.
type UserService interface {
	ChangeBalance(ctx context.Context, uuid string, change int) (*entities.User, error)
	GetByUUID(ctx context.Context, uuid string) (*entities.User, error)
	Transfer(ctx context.Context, fromUUID, toUUID string, amount uint) error
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

// Donate is a method that donates to a conference.
func (u conferenceUseCase) Donate(ctx context.Context, conferenceUUID string, userUUID string, amount uint) error {
	conference, err := u.conferenceService.GetByUUID(ctx, conferenceUUID)
	if err != nil {
		return err
	}

	errTransfer := u.userService.Transfer(ctx, userUUID, conference.AuthorUUID, amount)
	return errTransfer
}

// GetAll is a method that returns all conference in dto with author.
func (u conferenceUseCase) GetAll(ctx context.Context, limit, offset int, searchType string) ([]*dto.ReturnConference, error) {
	var (
		conferenceDto []*dto.ReturnConference
	)

	conferences, err := u.conferenceService.GetAll(ctx, limit, offset, searchType)

	if err != nil {
		return nil, err
	}

	for _, conference := range conferences {
		user, errGetUser := u.userService.GetByUUID(ctx, conference.AuthorUUID)

		if errGetUser != nil {
			return nil, err
		}

		conferenceDto = append(conferenceDto, &dto.ReturnConference{
			UUID:        conference.UUID,
			CreatedAt:   conference.CreatedAt,
			UpdatedAt:   conference.UpdatedAt,
			Title:       conference.Title,
			Description: conference.Description,
			StartTime:   conference.StartTime,
			Author: dto.Author{
				UUID:     user.UUID,
				Username: user.Username,
				Rate:     user.Rate,
			},
			URL:      conference.URL,
			Archived: conference.Archived,
		})
	}

	return conferenceDto, nil
}

func (u conferenceUseCase) GetMy(ctx context.Context, uuid string) ([]*dto.ReturnConference, error) {
	var (
		conferenceDto []*dto.ReturnConference
	)

	conferences, err := u.conferenceService.GetUserConferences(ctx, uuid)

	if err != nil {
		return nil, err
	}

	user, errGetUser := u.userService.GetByUUID(ctx, uuid)

	if errGetUser != nil {
		return nil, errGetUser
	}

	for _, conference := range conferences {
		conferenceDto = append(conferenceDto, &dto.ReturnConference{
			UUID:        conference.UUID,
			CreatedAt:   conference.CreatedAt,
			UpdatedAt:   conference.UpdatedAt,
			Title:       conference.Title,
			Description: conference.Description,
			StartTime:   conference.StartTime,
			Author: dto.Author{
				UUID:     user.UUID,
				Username: user.Username,
				Rate:     user.Rate,
			},
			URL:      conference.URL,
			Archived: conference.Archived,
		})
	}

	return conferenceDto, nil
}
