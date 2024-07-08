package services

import (
	"context"
	"github.com/google/uuid"
	"github.com/nlypage/bizkit-education/internal/domain/common/errroz"
	"github.com/nlypage/bizkit-education/internal/domain/dto"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
)

// ConferenceStorage is an interface that contains methods to interact with the database.
type ConferenceStorage interface {
	Create(ctx context.Context, conference *entities.Conference) (*entities.Conference, error)
	GetByUUID(ctx context.Context, uuid string) (*entities.Conference, error)
	GetAll(ctx context.Context, limit, offset int, searchType string) ([]*entities.Conference, error)
	GetUserConferences(ctx context.Context, userUUID string) ([]*entities.Conference, error)
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

// SetUrl is a method to set the conference url.
func (s conferenceService) SetUrl(ctx context.Context, updateConference *dto.SetConferenceURL) (*entities.Conference, error) {
	conference, err := s.storage.GetByUUID(ctx, updateConference.UUID)
	if err != nil {
		return nil, err
	}

	if conference.URL != "" {
		return nil, errroz.URLAlreadySet
	}

	conference.URL = updateConference.URL
	return s.storage.Update(ctx, conference)
}

// GetAll is a method that returns all conferences.
func (s conferenceService) GetAll(ctx context.Context, limit, offset int, searchType string) ([]*entities.Conference, error) {
	return s.storage.GetAll(ctx, limit, offset, searchType)
}

// GetUserConferences is a method that returns all conferences of the user.
func (s conferenceService) GetUserConferences(ctx context.Context, userUUID string) ([]*entities.Conference, error) {
	return s.storage.GetUserConferences(ctx, userUUID)
}
