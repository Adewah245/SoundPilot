package measurement

import (
	"fmt"

	"github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"
)

// ValidateResponse validates the measurement response returned by the DSP engine.
func ValidateResponse(
	request contract.MeasurementRequest,
	response contract.MeasurementResponse,
) error {
	if response.ContractVersion == "" {
		return fmt.Errorf("DSP response contract version is missing")
	}

	if response.ContractVersion != request.ContractVersion {
		return fmt.Errorf("DSP response contract version does not match request")
	}

	if response.SessionID == "" {
		return fmt.Errorf("DSP response session ID is missing")
	}

	if response.SessionID != request.SessionID {
		return fmt.Errorf("DSP response session ID does not match request")
	}

	if response.DurationSeconds <= 0 {
		return fmt.Errorf("DSP response duration must be greater than zero")
	}

	if response.SampleRate <= 0 {
		return fmt.Errorf("DSP response sample rate must be greater than zero")
	}

	if response.Channels <= 0 {
		return fmt.Errorf("DSP response channels must be greater than zero")
	}

	if response.Timestamp.IsZero() {
		return fmt.Errorf("DSP response timestamp is missing")
	}

	return nil
}
