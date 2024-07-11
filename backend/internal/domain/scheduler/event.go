package scheduler

import (
	"github.com/nlypage/bizkit-education/cmd/app"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
	"gorm.io/gorm"
	"log"
	"time"
)

type EventScheduler struct {
	db *gorm.DB
}

func NewEventScheduler(app *app.BizkitEduApp) *EventScheduler {
	return &EventScheduler{db: app.DB}
}

func (s EventScheduler) periodicallyArchiveConferences() {
	ticker := time.NewTicker(15 * time.Minute)
	for {
		select {
		case <-ticker.C:
		}
	}
}

func (s EventScheduler) archiveEvent() {
	now := time.Now()
	oneHourAgo := now.Add(-1 * time.Hour)
	result := s.db.Model(&entities.Event{}).
		Where("start_time <= ? AND archived = ?", oneHourAgo, false).
		Update("archived", true)

	if result.Error != nil {
		log.Printf("Error archiving conferences: %v\n", result.Error)
	} else {
		log.Printf("Successfully archived %v conferences\n", result.RowsAffected)
	}
}

func (s EventScheduler) Start() {
	log.Println("conference scheduler started")
	go s.periodicallyArchiveConferences()
}
