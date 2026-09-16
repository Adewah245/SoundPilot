package storage

import (
	"context"
	"fmt"

	"github.com/Adewah245/SoundPilot/backend/internal/domain"
	"github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"
)

// VerificationRepository persists verification results.
type VerificationRepository struct {
	db *Database
}

// NewVerificationRepository creates a verification repository.
func NewVerificationRepository(db *Database) *VerificationRepository {
	return &VerificationRepository{
		db: db,
	}
}

// SaveVerification stores a verification result.
func (r *VerificationRepository) SaveVerification(
	ctx context.Context,
	request contract.VerificationRequest,
	response contract.VerificationResponse,
) error {
	if r == nil || r.db == nil {
		return fmt.Errorf("verification repository is not configured")
	}

	const query = `
		INSERT INTO verifications (
			id,
			venue_id,
			zone_id,
			measurement_point_id,
			baseline_id,
			measurement_id,
			engineering_result_id,
			status,
			score,
			summary,
			created_at
		)
		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			$7,
			$8,
			$9,
			$10,
			$11
		)
	`

	_, err := r.db.Pool.Exec(
		ctx,
		query,
		domain.NewID(),
		request.VenueID,
		request.ZoneID,
		request.MeasurementPointID,
		request.BaselineID,
		request.MeasurementID,
		request.EngineeringResultID,
		response.Status,
		response.Score,
		response.Summary,
		response.VerifiedAt,
	)
	if err != nil {
		return fmt.Errorf("save verification: %w", err)
	}

	return nil
}
