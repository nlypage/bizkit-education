package main

import (
	"github.com/nlypage/bizkit-education/cmd/app"
	"github.com/nlypage/bizkit-education/internal/adapters/config"
	"github.com/nlypage/bizkit-education/internal/adapters/controller/api/setup"
)

// main is the entry point of the application.
func main() {
	appConfig := config.GetConfig()
	bizkitEduApp := app.NewBizkitEduApp(appConfig)

	setup.Setup(bizkitEduApp)
	bizkitEduApp.Start()
}
