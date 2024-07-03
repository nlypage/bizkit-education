package entities

import "time"

type Question struct {
	UUID      string    `json:"uuid" gorm:"primaryKey,unique"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Header  string    `json:"header"`
	Body    string    `json:"body"`
	Subject string    `json:"subject"`
	Reward  uint      `json:"reward"`
	Answer  []*Answer `json:"answer" gorm:"foreignKey:QuestionUUID"`
	Closed  bool      `json:"closed"`
}

type Answer struct {
	UUID      string    `json:"uuid" gorm:"primaryKey,unique"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	QuestionUUID string `json:"question_uuid"`
	Body         string `json:"body"`
	IsCorrect    bool   `json:"is_correct"`
}
