package verification

import (
	"context"
	"fmt"
	"time"

	"github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"
)

// Service coordinates verification of a measurement against a baseline.
type Service struct{}

// NewService creates a new verification service.
func NewService() *Service {
	return &Service{}
}

// Verify creates a verification result from the latest measurement and engineering result.
func (s *Service) Verify(
	ctx context.Context,
	request contract.VerificationRequest,
	score float64,
	status string,
	summary string,
) (contract.VerificationResponse, error) {
	if request.ContractVersion == "" {
		return contract.VerificationResponse{}, fmt.Errorf(
			"contract version is required",
		)
	}

	if request.VenueID == "" {
		return contract.VerificationResponse{}, fmt.Errorf(
			"venue ID is required",
		)
	}

	if request.ZoneID == "" {
		return contract.VerificationResponse{}, fmt.Errorf(
			"zone ID is required",
		)
	}

	if request.MeasurementPointID == "" {
		return contract.VerificationResponse{}, fmt.Errorf(
			"measurement point ID is required",
		)
	}

	if request.BaselineID == "" {
		return contract.VerificationResponse{}, fmt.Errorf(
			"baseline ID is required",
		)
	}

	if request.MeasurementID == "" {
		return contract.VerificationResponse{}, fmt.Errorf(
			"measurement ID is required",
		)
	}

	if request.EngineeringResultID == "" {
		return contract.VerificationResponse{}, fmt.Errorf(
			"engineering result ID is required",
		)
	}

	if ctx == nil {
		return contract.VerificationResponse{}, fmt.Errorf(
			"context is required",
		)
	}

	return contract.VerificationResponse{
		ContractVersion:    request.ContractVersion,
		VenueID:            request.VenueID,
		ZoneID:             request.ZoneID,
		MeasurementPointID: request.MeasurementPointID,
		MeasurementID:      request.MeasurementID,
		BaselineID:         request.BaselineID,
		Status:             status,
		Score:              score,
		Summary:            summary,
		VerifiedAt:         time.Now(),
	}, nil
}
