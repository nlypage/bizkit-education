package postgres

import (
	"context"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
	"gorm.io/gorm"
)

// usersStorage is a struct that contains a pointer to a gorm.DB instance.
type usersStorage struct {
	db *gorm.DB
}

// NewUserStorage is a function that returns a new instance of usersStorage.
func NewUserStorage(db *gorm.DB) *usersStorage {
	return &usersStorage{db: db}
}

// Create is a method to create a new User in database.
func (s *usersStorage) Create(ctx context.Context, user *entities.User) (*entities.User, error) {
	err := s.db.WithContext(ctx).Create(&user).Error
	return user, err
}

// GetByUUID is a method that returns an error and a pointer to a User instance.
func (s *usersStorage) GetByUUID(ctx context.Context, uuid string) (*entities.User, error) {
	var user *entities.User
	err := s.db.WithContext(ctx).Model(&entities.User{}).Where("uuid = ?", uuid).First(&user).Error
	return user, err
}

// GetAll is a method that returns a slice of pointers to User instances.
func (s *usersStorage) GetAll(ctx context.Context, limit, offset int) ([]*entities.User, error) {
	var users []*entities.User
	err := s.db.WithContext(ctx).Model(&entities.User{}).Limit(limit).Offset(offset).Find(&users).Error
	return users, err
}

// Update is a method to update an existing User in database.
func (s *usersStorage) Update(ctx context.Context, user *entities.User) (*entities.User, error) {
	err := s.db.WithContext(ctx).Model(&entities.User{}).Where("uuid = ?", user.UUID).Updates(&user).Error
	return user, err
}

// Delete is a method to delete an existing User in database.
func (s *usersStorage) Delete(ctx context.Context, uuid string) error {
	return s.db.WithContext(ctx).Unscoped().Delete(&entities.User{}, "uuid = ?", uuid).Error
}

// GetByUsernameAndPassword is a method that returns a pointer to a User instance and error.
func (s *usersStorage) GetByUsernameAndPassword(ctx context.Context, username string, password string) (*entities.User, error) {
	var user *entities.User
	err := s.db.WithContext(ctx).Where("username = ?", username).First(&user).Error
	if errInvalidPassword := user.ComparePassword(password); err != nil {
		return nil, errInvalidPassword
	}

	return user, err
}

// Transfer is a method to transfer coins between users.
func (s *usersStorage) Transfer(ctx context.Context, fromUUID, toUUID string, amount uint) error {
	tx := s.db.WithContext(ctx).Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	fromUser, err := s.GetByUUID(ctx, fromUUID)
	if err != nil {
		tx.Rollback()
		return err
	}

	toUser, err := s.GetByUUID(ctx, toUUID)
	if err != nil {
		tx.Rollback()
		return err
	}

	if fromUser.CoinsAmount < int(amount) {
		tx.Rollback()
		return err
	}

	fromUser.CoinsAmount -= int(amount)
	toUser.CoinsAmount += int(float32(amount) * 0.8)

	if err := tx.Model(&entities.User{}).Where("uuid = ?", fromUser.UUID).Save(fromUser).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Model(&entities.User{}).Where("uuid = ?", toUser.UUID).Save(toUser).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}
