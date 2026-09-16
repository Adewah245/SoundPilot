package main

import (
	"context"
	"log"

	"github.com/Adewah245/SoundPilot/backend/internal/config"
	"github.com/Adewah245/SoundPilot/backend/internal/dsp"
	"github.com/Adewah245/SoundPilot/backend/internal/engineering"
	"github.com/Adewah245/SoundPilot/backend/internal/measurement"
	"github.com/Adewah245/SoundPilot/backend/internal/server"
	"github.com/Adewah245/SoundPilot/backend/internal/storage"
	"github.com/Adewah245/SoundPilot/backend/internal/verification"
	"github.com/joho/godotenv"
)

// Start the SoundPilot application.
func main() {
	// Load environment variables from .env file.
	if err := godotenv.Load(); err != nil {
		log.Printf("warning: .env file not loaded: %v", err)
	}
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

	var dbName string
	err = db.Pool.QueryRow(
		context.Background(),
		"SELECT current_database()",
	).Scan(&dbName)

	if err != nil {
		log.Fatal(err)
	}

	log.Println("CONNECTED DATABASE:", dbName)
	// Create the Python DSP engine.
	dspEngine := dsp.NewEngine(
		cfg.PythonPath,
		cfg.DSPRunnerPath,
	)

	// Create the measurement repository.
	measurementRepository := storage.NewMeasurementRepository(db)

	// Create the measurement service.
	measurementService := measurement.NewService(
		dspEngine,
		measurementRepository,
	)

	// Create the engineering engine and service.
	engineeringEngine := engineering.NewEngine()
	engineeringRepository := storage.NewEngineeringRepository(db)
	engineeringService := engineering.NewService(
		engineeringEngine,
		engineeringRepository,
	)

	// Create the verification repository and service.
	verificationRepository := storage.NewVerificationRepository(db)
	verificationService := verification.NewService()

	// Create the HTTP server.
	appServer := server.NewServer(
		cfg.Port,
		db,
		measurementService,
		measurementRepository,
		engineeringService,
		engineeringRepository,
		verificationService,
		verificationRepository,
	)

	// Start the SoundPilot server.
	log.Printf("SoundPilot server starting on port %s", cfg.Port)

	if err := appServer.Start(); err != nil {
		log.Fatal(err)
	}
}
