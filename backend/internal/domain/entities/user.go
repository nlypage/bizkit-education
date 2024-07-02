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
	Role        string `json:"role" gorm:"enum('admin', 'master_admin', 'student')"`
	CoinsAmount uint   `json:"coins_amount"`
	Rate        string `json:"rate"`
	//TODO: questions
}

// SetPassword is a method to hash the password before storing it.
func (user *User) SetPassword(password string) {
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), 14)
	user.Password = hashedPassword
}

// ComparePassword is a method to compare the password with the hashed password.
func (user *User) ComparePassword(password string) error {
	return bcrypt.CompareHashAndPassword(user.Password, []byte(password))
}
