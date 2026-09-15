package contract

import "time"

// VerificationRequest represents a request to verify a measurement point.
type VerificationRequest struct {
	ContractVersion string `json:"contract_version"`

	VenueID            string `json:"venue_id"`
	ZoneID             string `json:"zone_id"`
	MeasurementPointID string `json:"measurement_point_id"`

	// The baseline represents the expected reference state.
	BaselineID string `json:"baseline_id"`

	// The latest measurement being verified.
	MeasurementID string `json:"measurement_id"`

	// The engineering result used during verification.
	EngineeringResultID string `json:"engineering_result_id"`
}

// VerificationResponse represents the result of a verification operation.
type VerificationResponse struct {
	ContractVersion string `json:"contract_version"`

	VenueID            string `json:"venue_id"`
	ZoneID             string `json:"zone_id"`
	MeasurementPointID string `json:"measurement_point_id"`

	MeasurementID string `json:"measurement_id"`
	BaselineID    string `json:"baseline_id"`

	// Status describes the verification state.
	Status string `json:"status"`

	// Score represents how well the measurement matched
	// the defined engineering expectations.
	Score float64 `json:"score"`

	// Summary gives a human-readable explanation.
	Summary string `json:"summary"`

	// VerifiedAt records when this verification was completed.
	VerifiedAt time.Time `json:"verified_at"`
}
