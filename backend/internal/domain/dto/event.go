package dto

import "time"

type CreateEvent struct {
	Title       string    `json:"title" validate:"required,header"`
	Description string    `json:"description" validate:"required,body"`
	StartTime   time.Time `json:"-" validate:"required"`
	AuthorUUID  string    `json:"-" validate:"required,uuid4"`
	Longitude   string    `json:"lng" validate:"required"`
	Latitude    string    `json:"lat" validate:"required"`
	Address     string    `json:"address" validate:"required"`
}

type Event struct {
	Title       string    `json:"title"`
	Description string    `json:"description"`
	StartTime   time.Time `json:"start_time"`
	Longitude   string    `json:"longitude"`
	Latitude    string    `json:"latitude"`
	Address     string    `json:"address"`
	Author      Author    `json:"author"`
}

type ReturnEvent struct {
	Position [2]string `json:"position"`
	Data     Event     `json:"data"`
}
