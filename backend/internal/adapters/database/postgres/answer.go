package postgres

import (
	"context"

	"github.com/nlypage/bizkit-education/internal/domain/entities"
	"gorm.io/gorm"
)

// answerStorage is a struct that contains a pointer to a gorm.DB instance.
type answerStorage struct {
	db *gorm.DB
}

// NewAnswerStorage is a function that returns a new instance of usersStorage.
func NewAnswerStorage(db *gorm.DB) *answerStorage {
	return &answerStorage{db: db}
}

// Create is a method to create a new Answer in database.
func (s *answerStorage) Create(ctx context.Context, answer *entities.Answer) (*entities.Answer, error) {
	err := s.db.WithContext(ctx).Create(&answer).Error
	return answer, err
}

// GetByUUID is a method that returns an error and a pointer to a Answer instance.
func (s *answerStorage) GetByUUID(ctx context.Context, uuid string) (*entities.Answer, error) {
	var answer *entities.Answer
	err := s.db.WithContext(ctx).Model(&entities.Answer{}).Where("uuid = ?", uuid).First(&answer).Error
	return answer, err
}

// GetAll is a method that returns a slice of pointers to Answer instances.
func (s *answerStorage) GetAll(ctx context.Context, questionUUID string) ([]*entities.Answer, error) {
	var answers []*entities.Answer
	err := s.db.WithContext(ctx).Model(&entities.Answer{}).Order("created_at desc").Where("question_uuid = ?", questionUUID).Find(&answers).Error
	return answers, err
}

// Update is a method to update an existing Answer in database.
func (s *answerStorage) Update(ctx context.Context, answer *entities.Answer) (*entities.Answer, error) {
	err := s.db.WithContext(ctx).Model(&entities.Answer{}).Where("uuid = ?", answer.UUID).Updates(&answer).Error
	return answer, err
}

// Delete is a method to delete an existing Answer in database.
func (s *answerStorage) Delete(ctx context.Context, uuid string) error {
	return s.db.WithContext(ctx).Unscoped().Delete(&entities.Answer{}, "uuid = ?", uuid).Error
}
