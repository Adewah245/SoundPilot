package measurement

import "github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"

// ValidateRequest validates a measurement request before DSP processing.
func ValidateRequest(request contract.MeasurementRequest) error {
	if request.ContractVersion == "" {
		return &ValidationError{Message: "contract version is required"}
	}

	if request.SessionID == "" {
		return &ValidationError{Message: "session ID is required"}
	}

	if request.VenueID == "" {
		return &ValidationError{Message: "venue ID is required"}
	}

	if request.ZoneID == "" {
		return &ValidationError{Message: "zone ID is required"}
	}

	if request.MeasurementPointID == "" {
		return &ValidationError{Message: "measurement point ID is required"}
	}

	if request.AudioSource == "" {
		return &ValidationError{Message: "audio source is required"}
	}

	if request.DurationSeconds <= 0 {
		return &ValidationError{Message: "duration seconds must be greater than zero"}
	}

	if request.SampleRate <= 0 {
		return &ValidationError{Message: "sample rate must be greater than zero"}
	}

	if request.Channels <= 0 {
		return &ValidationError{Message: "channels must be greater than zero"}
	}

	return nil
}
