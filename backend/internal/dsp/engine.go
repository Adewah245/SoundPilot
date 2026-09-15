package dsp

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
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

	cmd.Stdin = bytes.NewReader(input)
	// Capture the Python response.
	output, err := cmd.Output()
	if err != nil {
		return contract.MeasurementResponse{}, fmt.Errorf("run DSP engine: %w", err)
	}

	// Convert the Python JSON response back into the Go contract.
	var response contract.MeasurementResponse

	if err := json.Unmarshal(output, &response); err != nil {
		return contract.MeasurementResponse{}, fmt.Errorf("decode DSP response: %w", err)
	}

	return response, nil
}
