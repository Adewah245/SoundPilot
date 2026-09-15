package config

import (
	"errors"
	"os"
)

// Config contains the application configuration.
type Config struct {
	Port        string
	DatabaseURL string
}

// Load reads the SoundPilot configuration from environment variables.
func Load() (Config, error) {
	port := os.Getenv("PORT")
	if port == "" {
		return Config{}, errors.New("PORT is required")
	}

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		return Config{}, errors.New("DATABASE_URL is required")
	}

	return Config{
		Port:        port,
		DatabaseURL: databaseURL,
	}, nil
}
