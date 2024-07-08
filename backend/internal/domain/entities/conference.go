package entities

import "time"

type Conference struct {
	UUID      string    `json:"uuid" gorm:"primaryKey,unique"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Title       string    `json:"title"`
	Description string    `json:"description"`
	StartTime   time.Time `json:"start_time"`
	AuthorUUID  string    `json:"author_uuid"`
	URL         string    `json:"url"`
	Archived    bool      `json:"archived"`
}
