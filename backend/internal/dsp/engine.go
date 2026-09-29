package dsp

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"math"
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
	if e == nil {
		return contract.MeasurementResponse{}, fmt.Errorf("DSP engine is nil")
	}

	if ctx == nil {
		return contract.MeasurementResponse{}, fmt.Errorf("context is nil")
	}

	if e.PythonPath == "" {
		return contract.MeasurementResponse{}, fmt.Errorf("Python path is empty")
	}

	if e.ScriptPath == "" {
		return contract.MeasurementResponse{}, fmt.Errorf("DSP script path is empty")
	}

	if request.ContractVersion == "" {
		return contract.MeasurementResponse{}, fmt.Errorf(
			"DSP request contract version is required",
		)
	}

	// Convert the Go request into JSON for the Python process.
	input, err := json.Marshal(request)
	if err != nil {
		return contract.MeasurementResponse{}, fmt.Errorf(
			"marshal DSP request: %w",
			err,
		)
	}

	// Start the Python DSP runner with the request as standard input.
	cmd := exec.CommandContext(
		ctx,
		e.PythonPath,
		e.ScriptPath,
	)

	// Inherit the current environment for the Python process.
	cmd.Env = os.Environ()
	cmd.Stdin = bytes.NewReader(input)

	// Show Python errors in the terminal for debugging.
	cmd.Stderr = os.Stderr

	// Capture the Python response.
	var output bytes.Buffer
	cmd.Stdout = &output

	if err := cmd.Run(); err != nil {
		return contract.MeasurementResponse{}, fmt.Errorf(
			"run DSP engine: %w",
			err,
		)
	}

	if output.Len() == 0 {
		return contract.MeasurementResponse{}, fmt.Errorf(
			"DSP engine returned an empty response",
		)
	}

	// Convert the Python JSON response back into the Go contract.
	var response contract.MeasurementResponse

	if err := json.Unmarshal(output.Bytes(), &response); err != nil {
		return contract.MeasurementResponse{}, fmt.Errorf(
			"decode DSP response: %w",
			err,
		)
	}

	if response.ContractVersion != request.ContractVersion {
		return contract.MeasurementResponse{}, fmt.Errorf(
			"DSP response contract version %q does not match request version %q",
			response.ContractVersion,
			request.ContractVersion,
		)
	}

	if response.SessionID != request.SessionID {
		return contract.MeasurementResponse{}, fmt.Errorf(
			"DSP response session ID does not match request",
		)
	}

	if !isFinite(response.RMSDecibels) {
		return contract.MeasurementResponse{}, fmt.Errorf(
			"DSP response contains an invalid RMS value",
		)
	}

	if !isFinite(response.PeakDecibels) {
		return contract.MeasurementResponse{}, fmt.Errorf(
			"DSP response contains an invalid peak value",
		)
	}

	if !isFinite(response.NoiseLevel) {
		return contract.MeasurementResponse{}, fmt.Errorf(
			"DSP response contains an invalid noise value",
		)
	}

	if !isFinite(response.DistortionLevel) {
		return contract.MeasurementResponse{}, fmt.Errorf(
			"DSP response contains an invalid distortion value",
		)
	}

	if response.DurationSeconds <= 0 {
		return contract.MeasurementResponse{}, fmt.Errorf(
			"DSP response duration must be greater than 0",
		)
	}

	if response.SampleRate <= 0 {
		return contract.MeasurementResponse{}, fmt.Errorf(
			"DSP response sample rate must be greater than 0",
		)
	}

	if response.Channels <= 0 {
		return contract.MeasurementResponse{}, fmt.Errorf(
			"DSP response channels must be greater than 0",
		)
	}

	return response, nil
}

// isFinite checks whether a floating-point value is a valid number.
func isFinite(value float64) bool {
	return !math.IsNaN(value) && !math.IsInf(value, 0)
}
