package storage

import (
	"context"
	"fmt"

	"github.com/Adewah245/SoundPilot/backend/internal/domain"
)

// MeasurementRepository stores SoundPilot measurements in PostgreSQL.
type MeasurementRepository struct {
	db *Database
}

// NewMeasurementRepository creates a measurement repository.
func NewMeasurementRepository(db *Database) *MeasurementRepository {
	return &MeasurementRepository{
		db: db,
	}
}

// SaveMeasurement stores a measurement and its frequency data.
func (r *MeasurementRepository) SaveMeasurement(
	ctx context.Context,
	measurement domain.Measurement,
) error {
	if r.db == nil || r.db.Pool == nil {
		return fmt.Errorf("database is not configured")
	}

	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin measurement transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	_, err = tx.Exec(
		ctx,
		`INSERT INTO measurements (
			id,
			session_id,
			venue_id,
			zone_id,
			measurement_point_id,
			source,
			rms_decibels,
			peak_decibels,
			noise_level,
			distortion_level,
			clipping_detected,
			feedback_detected,
			duration_seconds,
			sample_rate,
			channels,
			created_at
		)
		VALUES (
			$1, $2, $3, $4, $5, $6,
			$7, $8, $9, $10, $11, $12,
			$13, $14, $15, $16
		)`,
		measurement.ID,
		measurement.SessionID,
		measurement.VenueID,
		measurement.ZoneID,
		measurement.MeasurementPointID,
		measurement.Source,
		measurement.RMSDecibels,
		measurement.PeakDecibels,
		measurement.NoiseLevel,
		measurement.DistortionLevel,
		measurement.ClippingDetected,
		measurement.FeedbackDetected,
		measurement.DurationSeconds,
		measurement.SampleRate,
		measurement.Channels,
		measurement.CreatedAt,
	)
	if err != nil {
		return fmt.Errorf("save measurement: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("commit measurement transaction: %w", err)
	}

	return nil
}
