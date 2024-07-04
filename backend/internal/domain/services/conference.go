package services

import (
	"context"
	"github.com/google/uuid"
	"github.com/nlypage/bizkit-education/internal/domain/dto"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
)

// ConferenceStorage is an interface that contains methods to interact with the database.
type ConferenceStorage interface {
	Create(ctx context.Context, conference *entities.Conference) (*entities.Conference, error)
	GetByUUID(ctx context.Context, uuid string) (*entities.Conference, error)
	GetAll(ctx context.Context, limit, offset int) ([]*entities.Conference, error)
	Update(ctx context.Context, conference *entities.Conference) (*entities.Conference, error)
	Delete(ctx context.Context, uuid string) error
}

// conferenceService is a struct that contains a pointer to a ConferenceStorage instance.
type conferenceService struct {
	storage ConferenceStorage
}

// NewConferenceService is a function that returns a new instance of conferenceService.
func NewConferenceService(storage ConferenceStorage) *conferenceService {
	return &conferenceService{storage: storage}
}

// Create is a method that creates a new conference.
func (s conferenceService) Create(ctx context.Context, createConference *dto.CreateConference) (*entities.Conference, error) {
	conference := &entities.Conference{
		UUID:        uuid.NewString(),
		Title:       createConference.Title,
		Description: createConference.Description,
		StartTime:   createConference.StartTime,
		AuthorUUID:  createConference.AuthorUUID,
	}

	return s.storage.Create(ctx, conference)
}
