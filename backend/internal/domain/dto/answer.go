package dto

import "time"

// CreateAnswer is a struct that contains the fields to create a new Answer.
type CreateAnswer struct {
	QuestionUUID string `json:"question_uuid" validate:"required,uuid4"`
	Body         string `json:"body" validate:"required,body"`
	AuthorUUID   string `json:"-" validate:"required,uuid4"`
}

type ReturnAnswer struct {
	UUID      string    `json:"uuid"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Author       Author `json:"author"`
	QuestionUUID string `json:"question_uuid"`
	Body         string `json:"body"`
	IsCorrect    bool   `json:"is_correct"`
}
