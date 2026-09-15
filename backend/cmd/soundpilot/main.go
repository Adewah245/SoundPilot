package main

import (
	"context"
	"log"

	"github.com/Adewah245/SoundPilot/backend/internal/config"
	"github.com/Adewah245/SoundPilot/backend/internal/server"
	"github.com/Adewah245/SoundPilot/backend/internal/storage"
)

// main starts the SoundPilot application.
func main() {
	// Load application configuration.
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}

	// Create a context for the database connection.
	ctx := context.Background()

	// Connect to PostgreSQL.
	db, err := storage.Connect(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Create the HTTP server.
	app := server.New(cfg.Port)

	log.Printf("SoundPilot server starting on port %s", cfg.Port)

	// Start the HTTP server.
	if err := app.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
