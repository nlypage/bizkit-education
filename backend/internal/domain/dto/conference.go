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

type ReturnConference struct {
	UUID      string    `json:"uuid"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Title       string    `json:"title"`
	Description string    `json:"description"`
	StartTime   time.Time `json:"start_time"`
	Author      Author    `json:"author"`
	URL         string    `json:"url"`
	Archived    bool      `json:"archived"`
}

type ConferenceDonate struct {
	ConferenceUUID string `json:"-" validate:"required,uuid4"`
	UserUUID       string `json:"-" validate:"required,uuid4"`
	Amount         uint   `json:"amount" validate:"required,numeric"`
}
