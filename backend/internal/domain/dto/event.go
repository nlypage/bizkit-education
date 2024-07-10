package dto

import "time"

type CreateEvent struct {
	Title       string    `json:"title" validate:"required,header"`
	Description string    `json:"description" validate:"required,body"`
	StartTime   time.Time `json:"-" validate:"required"`
	AuthorUUID  string    `json:"author_uuid" validate:"required,uuid64"`
	Longitude   float64   `json:"longitude" validate:"required,longitude"`
	Latitude    float64   `json:"latitude" validate:"required,latitude"`
}
