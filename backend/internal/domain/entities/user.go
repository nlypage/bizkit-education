package entities

import "time"

type User struct {
	UUID      string    `json:"uuid" gorm:"primaryKey,unique"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Username    string `json:"username"`
	Email       string `json:"email"`
	Role        string `json:"role" gorm:"enum('admin', 'master_admin', 'student')"`
	CoinsAmount uint   `json:"coins_amount"`
	Rate        string `json:"rate"`
	//TODO: questions
}
