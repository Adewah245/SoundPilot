package config

import (
	"fmt"
	"os"
	"strconv"
)

// Config contains the runtime configuration for SoundPilot.
type Config struct {
	Port          string
	DatabaseURL   string
	PythonPath    string
	DSPRunnerPath string
}

// Load reads the SoundPilot configuration from environment variables.
func Load() (*Config, error) {
	port := os.Getenv("PORT")
	databaseURL := os.Getenv("DATABASE_URL")

	if port == "" {
		return nil, fmt.Errorf("PORT is required")
	}

	if databaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL is required")
	}

	// Use the project virtual environment Python by default.
	pythonPath := os.Getenv("PYTHON_PATH")
	if pythonPath == "" {
		pythonPath = ".venv/bin/python"
	}

	// Use the Python DSP runner by default.
	dspRunnerPath := os.Getenv("DSP_RUNNER_PATH")
	if dspRunnerPath == "" {
		dspRunnerPath = "dsp/runner.py"
	}

	// Validate that PORT contains a valid number.
	if _, err := strconv.Atoi(port); err != nil {
		return nil, fmt.Errorf("PORT must be a valid number")
	}

	return &Config{
		Port:          port,
		DatabaseURL:   databaseURL,
		PythonPath:    pythonPath,
		DSPRunnerPath: dspRunnerPath,
	}, nil
}
