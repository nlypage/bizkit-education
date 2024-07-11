package entities

import "time"

type Event struct {
	UUID      string    `json:"uuid" gorm:"primaryKey,unique"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Title       string    `json:"title"`
	Description string    `json:"description"`
	StartTime   time.Time `json:"start_date"`
	AuthorUUID  string    `json:"author_uuid"`
	Archived    bool      `json:"archived"`
	Longitude   string    `json:"longitude"`
	Latitude    string    `json:"latitude"`
	Address     string    `json:"address"`
}
