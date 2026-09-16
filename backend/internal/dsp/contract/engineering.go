package contract

// EngineeringEvaluationRequest is sent to the Engineering Engine
// when a measurement needs to be evaluated against engineering rules.
type EngineeringEvaluationRequest struct {
	ContractVersion string `json:"contract_version"`

	MeasurementID string `json:"measurement_id"`

	// EngineeringProfile identifies the rules and targets to use.
	EngineeringProfileID string `json:"engineering_profile_id"`

	// Measurement values used for evaluation.
	RMSDecibels      float64 `json:"rms_decibels"`
	PeakDecibels     float64 `json:"peak_decibels"`
	NoiseLevel       float64 `json:"noise_level"`
	DistortionLevel  float64 `json:"distortion_level"`
	ClippingDetected bool    `json:"clipping_detected"`
	FeedbackDetected bool    `json:"feedback_detected"`
}

// EngineeringEvaluationResponse is returned after the Engineering Engine
// evaluates a measurement against the selected engineering profile.
type EngineeringEvaluationResponse struct {
	ContractVersion string `json:"contract_version"`

	MeasurementID string `json:"measurement_id"`

	EngineeringProfileID string `json:"engineering_profile_id"`

	// Overall evaluation status.
	Status string `json:"status"`

	// Score represents the overall result of the evaluation.
	Score float64 `json:"score"`

	// Findings explain what passed or failed.
	Findings []EngineeringFinding `json:"findings,omitempty"`

	// Recommendations explain what should be checked or adjusted.
	Recommendations []string `json:"recommendations,omitempty"`

	// Verification tells Go whether another verification test is required.
	RequiresVerification bool `json:"requires_verification"`
}

// EngineeringFinding describes one engineering result.
type EngineeringFinding struct {
	Metric   string  `json:"metric"`
	Status   string  `json:"status"`
	Actual   float64 `json:"actual"`
	Target   float64 `json:"target"`
	Tolerance float64 `json:"tolerance"`
	Message  string  `json:"message"`
}