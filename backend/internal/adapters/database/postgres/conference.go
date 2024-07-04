package postgres

import (
	"context"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
	"gorm.io/gorm"
)

// conferenceStorage is a struct that contains a pointer to a gorm.DB instance.
type conferenceStorage struct {
	db *gorm.DB
}

// NewConferenceStorage is a function that returns a new instance of conferenceStorage.
func NewConferenceStorage(db *gorm.DB) *conferenceStorage {
	return &conferenceStorage{db: db}
}

// Create is a method to create a new conference in database.
func (s *conferenceStorage) Create(ctx context.Context, conference *entities.Conference) (*entities.Conference, error) {
	err := s.db.WithContext(ctx).Create(&conference).Error
	return conference, err
}

// GetByUUID is a method that returns an error and a pointer to a Conference instance.
func (s *conferenceStorage) GetByUUID(ctx context.Context, uuid string) (*entities.Conference, error) {
	var conference *entities.Conference
	err := s.db.WithContext(ctx).Model(&entities.Conference{}).Where("uuid = ?", uuid).First(&conference).Error
	return conference, err
}

// GetAll is a method that returns a slice of pointers to Conference instances.
func (s *conferenceStorage) GetAll(ctx context.Context, limit, offset int) ([]*entities.Conference, error) {
	var conference []*entities.Conference
	err := s.db.WithContext(ctx).Model(&entities.Conference{}).Order("start_time desc").Limit(limit).Offset(offset).Find(&conference).Error
	return conference, err
}

// Update is a method to update an existing Conference in database.
func (s *conferenceStorage) Update(ctx context.Context, conference *entities.Conference) (*entities.Conference, error) {
	err := s.db.WithContext(ctx).Model(&entities.Conference{}).Where("uuid = ?", conference.UUID).Updates(&conference).Error
	return conference, err
}

// Delete is a method to delete an existing Conference in database.
func (s *conferenceStorage) Delete(ctx context.Context, uuid string) error {
	return s.db.WithContext(ctx).Unscoped().Delete(&entities.Conference{}, "uuid = ?", uuid).Error
}
