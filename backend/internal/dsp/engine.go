package dsp

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/exec"

	"github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"
)

// Engine runs the Python DSP engine from the Go application.
type Engine struct {
	PythonPath string
	ScriptPath string
}

// NewEngine creates a new DSP engine runner.
func NewEngine(pythonPath, scriptPath string) *Engine {
	return &Engine{
		PythonPath: pythonPath,
		ScriptPath: scriptPath,
	}
}

// Measure sends a measurement request to Python and returns the DSP result.
func (e *Engine) Measure(
	ctx context.Context,
	request contract.MeasurementRequest,
) (contract.MeasurementResponse, error) {
	// Convert the Go request into JSON for the Python process.
	input, err := json.Marshal(request)
	if err != nil {
		return contract.MeasurementResponse{}, fmt.Errorf("marshal DSP request: %w", err)
	}

	// Start the Python DSP runner with the request as standard input.
	cmd := exec.CommandContext(
		ctx,
		e.PythonPath,
		e.ScriptPath,
	)

	// Provide Python access to the SoundPilot DSP package and PortAudio library.
	cmd.Env = append(
		os.Environ(),
		"PYTHONPATH=.",
		"LD_LIBRARY_PATH=.local/usr/lib/x86_64-linux-gnu",
	)
	cmd.Stdin = bytes.NewReader(input)

	// Show Python errors in the terminal for debugging.
	cmd.Stderr = os.Stderr

	// Capture the Python response.
	var output bytes.Buffer

	cmd.Stdout = &output
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		return contract.MeasurementResponse{}, fmt.Errorf("run DSP engine: %w", err)
	}

	responseBytes := output.Bytes()
	log.Printf("DSP RAW START: %.200s", responseBytes)
	// Convert the Python JSON response back into the Go contract.
	var response contract.MeasurementResponse

	if err := json.Unmarshal(responseBytes, &response); err != nil {
		return contract.MeasurementResponse{}, fmt.Errorf("decode DSP response: %w", err)
	}

	return response, nil
}
