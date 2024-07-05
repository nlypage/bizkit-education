package dto

import "time"

type CreateConference struct {
	Title       string    `json:"title" validate:"required,header"`
	Description string    `json:"description" validate:"required,body"`
	StartTime   time.Time `json:"-"`
	AuthorUUID  string    `json:"-" validate:"required,uuid4"`
}
