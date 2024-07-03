package dto

// CreateAnswer is a struct that contains the fields to create a new Answer.
type CreateAnswer struct {
	QuestionUUID string `json:"question_uuid" validate:"required,uuid4"`
	Body         string `json:"body" validate:"required,body"`
	AuthorUUID   string `json:"-" validate:"required,uuid4"`
}
