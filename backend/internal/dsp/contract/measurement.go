package contract

import "time"

// MeasurementRequest is sent from Go to the Python DSP engine.
type MeasurementRequest struct {
	ContractVersion string `json:"contract_version"`
	SessionID       string `json:"session_id"`
	VenueID         string `json:"venue_id"`
	ZoneID          string `json:"zone_id"`
	MeasurementPointID string `json:"measurement_point_id"`

	// AudioSource identifies where the audio comes from.
	AudioSource string `json:"audio_source"`

	// DurationSeconds tells Python how long to analyse the audio.
	DurationSeconds float64 `json:"duration_seconds"`

	// SampleRate is the expected audio sample rate.
	SampleRate int `json:"sample_rate"`

	// Channels is the number of audio channels.
	Channels int `json:"channels"`
}

// MeasurementResponse is returned from Python DSP to Go.
type MeasurementResponse struct {
	ContractVersion string    `json:"contract_version"`
	SessionID       string    `json:"session_id"`
	Timestamp       time.Time `json:"timestamp"`

	// Basic signal measurements.
	RMSDecibels  float64 `json:"rms_decibels"`
	PeakDecibels float64 `json:"peak_decibels"`

	// Frequency analysis.
	FrequencyData []FrequencyMeasurement `json:"frequency_data,omitempty"`

	// Signal quality measurements.
	NoiseLevel      float64 `json:"noise_level"`
	DistortionLevel float64 `json:"distortion_level"`

	// Detection results.
	ClippingDetected bool `json:"clipping_detected"`
	FeedbackDetected bool `json:"feedback_detected"`

	// Additional DSP information.
	DurationSeconds float64 `json:"duration_seconds"`
	SampleRate      int     `json:"sample_rate"`
	Channels        int     `json:"channels"`
}

// FrequencyMeasurement represents one frequency measurement.
type FrequencyMeasurement struct {
	FrequencyHz float64 `json:"frequency_hz"`
	LevelDB     float64 `json:"level_db"`
}