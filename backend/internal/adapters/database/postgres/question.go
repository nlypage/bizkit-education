package postgres

import (
	"context"

	"github.com/nlypage/bizkit-education/internal/domain/entities"
	"gorm.io/gorm"
)

// questionStorage is a struct that contains a pointer to a gorm.DB instance.
type questionStorage struct {
	db *gorm.DB
}

// NewQuestionStorage is a function that returns a new instance of questionStorage.
func NewQuestionStorage(db *gorm.DB) *questionStorage {
	return &questionStorage{db: db}
}

// Create is a method to create a new Question in database.
func (s *questionStorage) Create(ctx context.Context, question *entities.Question) (*entities.Question, error) {
	err := s.db.WithContext(ctx).Create(&question).Error
	return question, err
}

// GetByUUID is a method that returns an error and a pointer to a Question instance.
func (s *questionStorage) GetByUUID(ctx context.Context, uuid string) (*entities.Question, error) {
	var question *entities.Question
	err := s.db.WithContext(ctx).Model(&entities.Question{}).Where("uuid = ?", uuid).First(&question).Error
	return question, err
}

// GetAll is a method that returns a slice of pointers to Question instances.
func (s *questionStorage) GetAll(ctx context.Context, limit, offset int, subject string) ([]*entities.Question, error) {
	var questions []*entities.Question
	query := s.db.WithContext(ctx).Model(&entities.Question{})

	if subject != "" {
		query = query.Where("subject = ?", subject)
	}

	err := query.Limit(limit).Offset(offset).Find(&questions).Error
	return questions, err
}

// Update is a method to update an existing Question in database.
func (s *questionStorage) Update(ctx context.Context, question *entities.Question) (*entities.Question, error) {
	err := s.db.WithContext(ctx).Model(&entities.Question{}).Where("uuid = ?", question.UUID).Updates(&question).Error
	return question, err
}

// Delete is a method to delete an existing Question in database.
func (s *questionStorage) Delete(ctx context.Context, uuid string) error {
	return s.db.WithContext(ctx).Unscoped().Delete(&entities.Question{}, "uuid = ?", uuid).Error
}

// GetMy is a method that returns a slice of pointers to Question instances.
func (s *questionStorage) GetMy(ctx context.Context, limit, offset int, uuid string) ([]*entities.Question, error) {
	var questions []*entities.Question
	err := s.db.WithContext(ctx).Model(&entities.Question{}).Where("author_uuid = ?", uuid).Limit(limit).Offset(offset).Find(&questions).Error
	return questions, err
}
