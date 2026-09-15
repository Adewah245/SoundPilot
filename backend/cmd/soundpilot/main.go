package main

import (
	"context"
	"log"

	"github.com/Adewah245/SoundPilot/backend/internal/config"
	"github.com/Adewah245/SoundPilot/backend/internal/dsp"
	"github.com/Adewah245/SoundPilot/backend/internal/server"
	"github.com/Adewah245/SoundPilot/backend/internal/storage"
)

// Start the SoundPilot application.
func main() {
	// Load application configuration.
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}

	// Connect to the PostgreSQL database.
	db, err := storage.Connect(context.Background(), cfg.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Create the Python DSP engine.
	dspEngine := dsp.NewEngine(
		cfg.PythonPath,
		cfg.DSPRunnerPath,
	)

	// Create the HTTP server.
	appServer := server.NewServer(
		cfg.Port,
		db,
		dspEngine,
	)

	// Start the SoundPilot server.
	log.Printf("SoundPilot server starting on port %s", cfg.Port)

	if err := appServer.Start(); err != nil {
		log.Fatal(err)
	}
}
