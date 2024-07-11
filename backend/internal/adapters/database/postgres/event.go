package postgres

import (
	"context"
	"github.com/nlypage/bizkit-education/internal/domain/common/errroz"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
	"gorm.io/gorm"
)

type eventStorage struct {
	db *gorm.DB
}

func NewEventStorage(db *gorm.DB) *eventStorage {
	return &eventStorage{db: db}
}

func (s *eventStorage) Create(ctx context.Context, event *entities.Event) (*entities.Event, error) {
	err := s.db.WithContext(ctx).Create(event).Error
	return event, err
}

func (s *eventStorage) GetByUUID(ctx context.Context, uuid string) (*entities.Event, error) {
	var event *entities.Event
	err := s.db.WithContext(ctx).Model(&entities.Event{}).Where("uuid = ?", uuid).First(&event).Error
	return event, err
}

func (s *eventStorage) GetAll(ctx context.Context, limit, offset int, searchType string) ([]*entities.Event, error) {
	var query *gorm.DB

	switch searchType {
	case "upcoming":
		query = s.db.WithContext(ctx).Model(&entities.Event{}).Limit(limit).Offset(offset).Where("archived = ?", false).Order("start_time asc")
	case "archived":
		query = s.db.WithContext(ctx).Model(&entities.Event{}).Limit(limit).Offset(offset).Where("archived = ?", true).Order("start_time desc")
	case "all":
		query = s.db.WithContext(ctx).Model(&entities.Event{}).Limit(limit).Offset(offset).Order("start_time desc")
	default:
		return nil, errroz.InvalidSearchMethod
	}

	var events []*entities.Event
	err := query.Find(&events).Error
	return events, err
}

func (s *eventStorage) Update(ctx context.Context, event *entities.Event) (*entities.Event, error) {
	err := s.db.WithContext(ctx).Model(&entities.Event{}).Where("uuid = ?", event.UUID).Updates(event).Error
	return event, err
}

func (s *eventStorage) Delete(ctx context.Context, uuid string) error {
	return s.db.WithContext(ctx).Model(&entities.Event{}).Unscoped().Delete(&entities.Event{}, "uuid = ?", uuid).Error
}

func (s *eventStorage) GetUsersEvents(ctx context.Context, uuid string) ([]*entities.Event, error) {
	var events []*entities.Event
	err := s.db.WithContext(ctx).Model(&entities.Event{}).Where("archived_at = ?", true).Where("author_uuid = ?", uuid).Find(&events).Error
	return events, err
}
