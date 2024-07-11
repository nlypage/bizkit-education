package services

import (
	"context"
	"github.com/google/uuid"
	"github.com/nlypage/bizkit-education/internal/domain/common/errroz"
	"github.com/nlypage/bizkit-education/internal/domain/dto"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
)

type EventStorage interface {
	Create(ctx context.Context, event *entities.Event) (*entities.Event, error)
	GetByUUID(ctx context.Context, uuid string) (*entities.Event, error)
	GetAll(ctx context.Context, limit, offset int, searchType string) ([]*entities.Event, error)
	Update(ctx context.Context, event *entities.Event) (*entities.Event, error)
	Delete(ctx context.Context, uuid string) error
	GetUsersEvents(ctx context.Context, uuid string) ([]*entities.Event, error)
}

type eventService struct {
	storage EventStorage
}

func NewEventService(storage EventStorage) *eventService {
	return &eventService{storage: storage}
}

func (s *eventService) Create(ctx context.Context, event *dto.CreateEvent) (*entities.Event, error) {
	returnEvent := &entities.Event{
		UUID:        uuid.NewString(),
		Title:       event.Title,
		Description: event.Description,
		StartTime:   event.StartTime,
		AuthorUUID:  event.AuthorUUID,
		Archived:    false,
		Longitude:   event.Longitude,
		Latitude:    event.Latitude,
		Address:     event.Address,
	}

	return s.storage.Create(ctx, returnEvent)
}

func (s *eventService) GetAll(ctx context.Context, limit, offset int, searchType string) ([]*entities.Event, error) {
	return s.storage.GetAll(ctx, limit, offset, searchType)
}

func (s *eventService) Archive(ctx context.Context, uuid string, userUIID string) (*entities.Event, error) {
	event, err := s.storage.GetByUUID(ctx, uuid)
	if err != nil {
		return nil, err
	}

	if event.AuthorUUID != userUIID {
		return nil, errroz.NotEnoughPermissions
	}
	event.Archived = true
	return s.storage.Update(ctx, event)
}

func (s *eventService) GetUserEvents(ctx context.Context, uuid string) ([]*entities.Event, error) {
	return s.storage.GetUsersEvents(ctx, uuid)
}

func (s *eventService) GetByUUID(ctx context.Context, uuid string) (*entities.Event, error) {
	return s.storage.GetByUUID(ctx, uuid)
}
