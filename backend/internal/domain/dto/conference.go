package dto

import "time"

// CreateConference is a struct that contains the fields required to create a conference.
type CreateConference struct {
	Title       string    `json:"title" validate:"required,header"`
	Description string    `json:"description" validate:"required,body"`
	StartTime   time.Time `json:"-" validate:"required"`
	AuthorUUID  string    `json:"-" validate:"required,uuid4"`
}

type SetConferenceURL struct {
	UUID string `json:"uuid" validate:"required,uuid4"`
	URL  string `json:"url" validate:"required,url"`
}
