package dto

type UUID struct {
	UUID string `json:"uuid" validate:"required,uuid4"`
}
