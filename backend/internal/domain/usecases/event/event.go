package event

import (
	"context"
	"github.com/nlypage/bizkit-education/internal/domain/dto"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
)

type Service interface {
	GetAll(ctx context.Context, limit, offset int, searchType string) ([]*entities.Event, error)
}

type UserService interface {
	GetByUUID(ctx context.Context, uuid string) (*entities.User, error)
}

type eventUseCase struct {
	eventService Service
	userService  UserService
}

func NewEventUseCase(eventService Service, userService UserService) *eventUseCase {
	return &eventUseCase{
		eventService: eventService,
		userService:  userService,
	}
}

func (u eventUseCase) GetAll(ctx context.Context, limit, offset int, searchType string) ([]*dto.ReturnEvent, error) {
	var (
		eventsDto []*dto.ReturnEvent
	)

	events, err := u.eventService.GetAll(ctx, limit, offset, searchType)

	if err != nil {
		return nil, err
	}

	for _, event := range events {
		user, errGetUser := u.userService.GetByUUID(ctx, event.AuthorUUID)

		if errGetUser != nil {
			return nil, errGetUser
		}

		eventsDto = append(eventsDto, &dto.ReturnEvent{
			Position: [2]string{
				event.Latitude, event.Longitude,
			},
			Data: dto.Event{
				Title:       event.Title,
				Description: event.Description,
				StartTime:   event.StartTime,
				Longitude:   event.Longitude,
				Latitude:    event.Latitude,
				Address:     event.Address,
				Author: dto.Author{
					UUID:     user.UUID,
					Username: user.Username,
					Rate:     user.Rate,
				},
			},
		})
	}

	return eventsDto, nil
}
