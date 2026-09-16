package measurement

import "github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"

// CurrentContractVersion identifies the Go <-> Python measurement contract.
const CurrentContractVersion = "1.0"

// NewRequest creates a measurement request for the DSP engine.
func NewRequest(
	sessionID string,
	venueID string,
	zoneID string,
	measurementPointID string,
	audioSource string,
	durationSeconds float64,
	sampleRate int,
	channels int,
) contract.MeasurementRequest {
	return contract.MeasurementRequest{
		ContractVersion:    CurrentContractVersion,
		SessionID:          sessionID,
		VenueID:            venueID,
		ZoneID:             zoneID,
		MeasurementPointID: measurementPointID,
		AudioSource:        audioSource,
		DurationSeconds:    durationSeconds,
		SampleRate:         sampleRate,
		Channels:           channels,
	}
}
