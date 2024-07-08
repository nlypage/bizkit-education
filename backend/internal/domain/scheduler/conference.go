package scheduler

import (
	"github.com/nlypage/bizkit-education/cmd/app"
	"github.com/nlypage/bizkit-education/internal/domain/entities"
	"gorm.io/gorm"
	"log"
	"time"
)

// ConferenceScheduler is a struct that contains a pointer to a gorm.DB instance.
type ConferenceScheduler struct {
	db *gorm.DB
}

// NewConferenceScheduler is a function that returns a new instance of ConferenceScheduler.
func NewConferenceScheduler(app *app.BizkitEduApp) *ConferenceScheduler {
	return &ConferenceScheduler{db: app.DB}
}

// periodicallyArchiveConferences is a method that archives conferences every hour.
func (s ConferenceScheduler) periodicallyArchiveConferences() {
	ticker := time.NewTicker(10 * time.Second)
	for {
		select {
		case <-ticker.C:
			s.archiveConferences()
		}
	}
}

// archiveConferences is a method that archives conferences that have already started.
func (s ConferenceScheduler) archiveConferences() {
	now := time.Now()
	twoHoursAgo := now.Add(-2 * time.Hour)
	result := s.db.Model(&entities.Conference{}).
		Where("start_time <= ? AND archived = ?", twoHoursAgo, false).
		Update("archived", true)

	if result.Error != nil {
		log.Printf("Error archiving conferences: %v\n", result.Error)
	} else {
		log.Printf("Successfully archived %v conferences\n", result.RowsAffected)
	}
}

// Start is a method that starts the conference scheduler.
func (s ConferenceScheduler) Start() {
	log.Println("conference scheduler started")
	go s.periodicallyArchiveConferences()
}
