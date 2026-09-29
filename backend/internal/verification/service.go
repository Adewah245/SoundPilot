package verification

import (
	"context"
	"fmt"
	"time"

	"github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"
	"github.com/Adewah245/SoundPilot/backend/internal/storage"
)

// Service coordinates verification of a measurement against an engineering result.
type Service struct {
	measurementRepository *storage.MeasurementRepository
	engineeringRepository *storage.EngineeringRepository
}

// NewService creates a new verification service.
func NewService(
	measurementRepository *storage.MeasurementRepository,
	engineeringRepository *storage.EngineeringRepository,
) *Service {
	return &Service{
		measurementRepository: measurementRepository,
		engineeringRepository: engineeringRepository,
	}
}

// Verify verifies a measurement using its stored engineering result.
func (s *Service) Verify(
	ctx context.Context,
	request contract.VerificationRequest,
) (contract.VerificationResponse, error) {
	if s == nil {
		return contract.VerificationResponse{}, fmt.Errorf(
			"verification service is not configured",
		)
	}

	if s.measurementRepository == nil {
		return contract.VerificationResponse{}, fmt.Errorf(
			"measurement repository is not configured",
		)
	}

	if s.engineeringRepository == nil {
		return contract.VerificationResponse{}, fmt.Errorf(
			"engineering repository is not configured",
		)
	}

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

	measurement, err := s.measurementRepository.GetMeasurement(
		ctx,
		request.MeasurementID,
	)
	if err != nil {
		return contract.VerificationResponse{}, fmt.Errorf(
			"get measurement for verification: %w",
			err,
		)
	}

	engineeringResult, err := s.engineeringRepository.GetEngineeringResult(
		ctx,
		request.EngineeringResultID,
	)
	if err != nil {
		return contract.VerificationResponse{}, fmt.Errorf(
			"get engineering result for verification: %w",
			err,
		)
	}

	if measurement.VenueID != request.VenueID ||
		measurement.ZoneID != request.ZoneID ||
		measurement.MeasurementPointID != request.MeasurementPointID {
		return contract.VerificationResponse{}, fmt.Errorf(
			"measurement location does not match verification request",
		)
	}

	status := engineeringResult.Status
	score := engineeringResult.Score

	summary := fmt.Sprintf(
		"Verification used measurement %s and engineering result %s.",
		measurement.ID,
		request.EngineeringResultID,
	)

	if engineeringResult.RequiresVerification {
		status = "needs_adjustment"
		summary = fmt.Sprintf(
			"Measurement %s requires adjustment based on the engineering evaluation.",
			measurement.ID,
		)
	} else if status == "pass" {
		status = "verified"
		summary = fmt.Sprintf(
			"Measurement %s passed the engineering evaluation.",
			measurement.ID,
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
		VerifiedAt:         time.Now().UTC(),
	}, nil
}
