package measurement

import (
	"fmt"

	"github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"
)

// ValidateRequest validates a measurement request before DSP processing.
func ValidateRequest(request contract.MeasurementRequest) error {
	if request.ContractVersion == "" {
		return fmt.Errorf("contract version is required")
	}

	if request.SessionID == "" {
		return fmt.Errorf("session ID is required")
	}

	if request.VenueID == "" {
		return fmt.Errorf("venue ID is required")
	}

	if request.ZoneID == "" {
		return fmt.Errorf("zone ID is required")
	}

	if request.MeasurementPointID == "" {
		return fmt.Errorf("measurement point ID is required")
	}

	if request.AudioSource == "" {
		return fmt.Errorf("audio source is required")
	}

	if request.DurationSeconds <= 0 {
		return fmt.Errorf("duration seconds must be greater than zero")
	}

	if request.SampleRate <= 0 {
		return fmt.Errorf("sample rate must be greater than zero")
	}

	if request.Channels <= 0 {
		return fmt.Errorf("channels must be greater than zero")
	}

	return nil
}
