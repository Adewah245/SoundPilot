package domain

import "time"

// Venue represents a physical location where SoundPilot is used.
type Venue struct {
	ID              string    `json:"id"`
	Name            string    `json:"name"`
	Description     string    `json:"description,omitempty"`
	WidthMeters     float64   `json:"width_meters,omitempty"`
	LengthMeters    float64   `json:"length_meters,omitempty"`
	HeightMeters    float64   `json:"height_meters,omitempty"`
	DurationSeconds float64   `json:"duration_seconds"`
	SampleRate      int       `json:"sample_rate"`
	Channels        int       `json:"channels"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// Zone represents a logical area inside a venue.
type Zone struct {
	ID              string    `json:"id"`
	VenueID         string    `json:"venue_id"`
	Name            string    `json:"name"`
	Type            string    `json:"type"`
	DurationSeconds float64   `json:"duration_seconds"`
	SampleRate      int       `json:"sample_rate"`
	Channels        int       `json:"channels"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// MeasurementPoint represents a specific location where measurements are taken.
type MeasurementPoint struct {
	ID              string    `json:"id"`
	ZoneID          string    `json:"zone_id"`
	Name            string    `json:"name"`
	PositionX       float64   `json:"position_x,omitempty"`
	PositionY       float64   `json:"position_y,omitempty"`
	PositionZ       float64   `json:"position_z,omitempty"`
	DurationSeconds float64   `json:"duration_seconds"`
	SampleRate      int       `json:"sample_rate"`
	Channels        int       `json:"channels"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// Equipment represents a physical sound-system component.
type Equipment struct {
	ID              string    `json:"id"`
	Name            string    `json:"name"`
	Type            string    `json:"type"`
	Manufacturer    string    `json:"manufacturer,omitempty"`
	Model           string    `json:"model,omitempty"`
	Location        string    `json:"location,omitempty"`
	Description     string    `json:"description,omitempty"`
	DurationSeconds float64   `json:"duration_seconds"`
	SampleRate      int       `json:"sample_rate"`
	Channels        int       `json:"channels"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// SignalChain represents the order and relationship of equipment in the audio path.
type SignalChain struct {
	ID        string   `json:"id"`
	Name      string   `json:"name"`
	Equipment []string `json:"equipment"`
}

// Baseline represents a known reference state of a sound system.
type Baseline struct {
	ID              string    `json:"id"`
	VenueID         string    `json:"venue_id"`
	Name            string    `json:"name"`
	Description     string    `json:"description,omitempty"`
	DurationSeconds float64   `json:"duration_seconds"`
	SampleRate      int       `json:"sample_rate"`
	Channels        int       `json:"channels"`
	CreatedAt       time.Time `json:"created_at"`
}

// FrequencyMeasurement represents one measured frequency and its level.
type FrequencyMeasurement struct {
        FrequencyHz float64 `json:"frequency_hz"`
        LevelDB     float64 `json:"level_db"`
}

// Measurement represents a measurement produced by the DSP engine.
type Measurement struct {
	ID                 string `json:"id"`
	SessionID          string `json:"session_id"`
	VenueID            string `json:"venue_id"`
	ZoneID             string `json:"zone_id"`
	MeasurementPointID string `json:"measurement_point_id"`
	Source             string `json:"source"`

	RMSDecibels   float64   `json:"rms_decibels"`
	PeakDecibels  float64   `json:"peak_decibels"`
	FrequencyData []FrequencyMeasurement `json:"frequency_data,omitempty"`

	NoiseLevel      float64 `json:"noise_level,omitempty"`
	DistortionLevel float64 `json:"distortion_level,omitempty"`

	ClippingDetected bool `json:"clipping_detected"`
	FeedbackDetected bool `json:"feedback_detected"`

	DurationSeconds float64   `json:"duration_seconds"`
	SampleRate      int       `json:"sample_rate"`
	Channels        int       `json:"channels"`
	CreatedAt       time.Time `json:"created_at"`
}

// Test represents a measurement or engineering test performed by SoundPilot.
type Test struct {
	ID          string     `json:"id"`
	SessionID   string     `json:"session_id"`
	Name        string     `json:"name"`
	Type        string     `json:"type"`
	Status      string     `json:"status"`
	StartedAt   time.Time  `json:"started_at"`
	CompletedAt *time.Time `json:"completed_at,omitempty"`
}

// Verification represents the verification state of a system or measurement point.
type Verification struct {
	ID                 string `json:"id"`
	VenueID            string `json:"venue_id"`
	ZoneID             string `json:"zone_id"`
	MeasurementPointID string `json:"measurement_point_id"`

	BaselineID    string `json:"baseline_id"`
	MeasurementID string `json:"measurement_id"`

	Status  string  `json:"status"`
	Score   float64 `json:"score,omitempty"`
	Summary string  `json:"summary,omitempty"`

	DurationSeconds float64   `json:"duration_seconds"`
	SampleRate      int       `json:"sample_rate"`
	Channels        int       `json:"channels"`
	CreatedAt       time.Time `json:"created_at"`
}

// EngineeringProfile defines the engineering expectations used for evaluation.
type EngineeringProfile struct {
	ID              string    `json:"id"`
	Name            string    `json:"name"`
	Description     string    `json:"description,omitempty"`
	Version         string    `json:"version"`
	DurationSeconds float64   `json:"duration_seconds"`
	SampleRate      int       `json:"sample_rate"`
	Channels        int       `json:"channels"`
	CreatedAt       time.Time `json:"created_at"`
}

// EngineeringResult represents the engineering interpretation of a measurement.
type EngineeringResult struct {
	ID            string `json:"id"`
	MeasurementID string `json:"measurement_id"`

	Status          string   `json:"status"`
	Score           float64  `json:"score,omitempty"`
	Findings        []string `json:"findings,omitempty"`
	Recommendations []string `json:"recommendations,omitempty"`

	RequiresVerification bool `json:"requires_verification"`
}

// Alert represents a condition that requires user attention.
type Alert struct {
	ID              string    `json:"id"`
	SessionID       string    `json:"session_id,omitempty"`
	Type            string    `json:"type"`
	Severity        string    `json:"severity"`
	Title           string    `json:"title"`
	Message         string    `json:"message"`
	Acknowledged    bool      `json:"acknowledged"`
	DurationSeconds float64   `json:"duration_seconds"`
	SampleRate      int       `json:"sample_rate"`
	Channels        int       `json:"channels"`
	CreatedAt       time.Time `json:"created_at"`
}

// Session represents a SoundPilot working or measurement session.
type Session struct {
	ID        string     `json:"id"`
	VenueID   string     `json:"venue_id"`
	Name      string     `json:"name,omitempty"`
	Status    string     `json:"status"`
	StartedAt time.Time  `json:"started_at"`
	EndedAt   *time.Time `json:"ended_at,omitempty"`
}
