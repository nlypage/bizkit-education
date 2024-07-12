package entities

import (
	"golang.org/x/crypto/bcrypt"
	"time"
)

type User struct {
	UUID      string    `json:"uuid" gorm:"primaryKey,unique"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Username    string `json:"username" gorm:"unique"`
	Email       string `json:"email" gorm:"unique"`
	Password    []byte `json:"-"`
	Role        string `json:"role" gorm:"default:student"`
	CoinsAmount int    `json:"coins_amount" gorm:"default:300"`
	Rate        string `json:"rate" gorm:"default:Ученик"`
	//TODO: questions
}

// HashedPassword is a function to hash the password.
func HashedPassword(password string) []byte {
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), 14)
	return hashedPassword
}

// SetPassword is a method to hash the password before storing it.
func (user *User) SetPassword(password string) {
	user.Password = HashedPassword(password)
}

// ComparePassword is a method to compare the password with the hashed password.
func (user *User) ComparePassword(password string) error {
	return bcrypt.CompareHashAndPassword(user.Password, []byte(password))
}
