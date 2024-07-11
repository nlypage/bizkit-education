package dto

import "time"

type CreateEvent struct {
	Title       string    `json:"title" validate:"required,header"`
	Description string    `json:"description" validate:"required,body"`
	StartTime   time.Time `json:"-" validate:"required"`
	AuthorUUID  string    `json:"-" validate:"required,uuid4"`
	Longitude   float64   `json:"lng" validate:"required,longitude"`
	Latitude    float64   `json:"lat" validate:"required,latitude"`
	Address     string    `json:"address"`
}

type Event struct {
	Title       string    `json:"title"`
	Description string    `json:"description"`
	StartTime   time.Time `json:"start_time"`
	Longitude   float64   `json:"longitude"`
	Latitude    float64   `json:"latitude"`
	Address     string    `json:"address"`
	Author      Author    `json:"author"`
}

type ReturnEvent struct {
	Position [2]float64 `json:"position"`
	Data     Event      `json:"data"`
}
