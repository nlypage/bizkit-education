package main

import (
	"github.com/nlypage/bizkit-education/cmd/app"
	"github.com/nlypage/bizkit-education/internal/adapters/config"
	"github.com/nlypage/bizkit-education/internal/adapters/controller/api/setup"
	"github.com/nlypage/bizkit-education/internal/domain/scheduler"
)

// main is the entry point of the application.
func main() {
	appConfig := config.GetConfig()
	bizkitEduApp := app.NewBizkitEduApp(appConfig)

	conferenceScheduler := scheduler.NewConferenceScheduler(bizkitEduApp)
	conferenceScheduler.Start()

	setup.Setup(bizkitEduApp)
	bizkitEduApp.Start()
}
