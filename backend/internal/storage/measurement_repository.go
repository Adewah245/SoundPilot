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

	for _, frequency := range measurement.FrequencyData {
		_, err = tx.Exec(
			ctx,
			`INSERT INTO measurement_frequencies (
				measurement_id,
				frequency_hz,
				level_db
			)
			VALUES ($1, $2, $3)`,
			measurement.ID,
			frequency.FrequencyHz,
			frequency.LevelDB,
		)
		if err != nil {
			return fmt.Errorf("save measurement frequency: %w", err)
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("commit measurement transaction: %w", err)
	}

	var count int

	err = r.db.Pool.QueryRow(
		ctx,
		"SELECT COUNT(*) FROM measurements",
	).Scan(&count)

	if err != nil {
		return fmt.Errorf("check measurement count: %w", err)
	}

	fmt.Println("MEASUREMENTS IN DB:", count)

	return nil
}

// GetMeasurement retrieves one measurement and its frequency data.
func (r *MeasurementRepository) GetMeasurement(
	ctx context.Context,
	measurementID string,
) (domain.Measurement, error) {
	if r.db == nil || r.db.Pool == nil {
		return domain.Measurement{}, fmt.Errorf("database is not configured")
	}

	var measurement domain.Measurement

	err := r.db.Pool.QueryRow(
		ctx,
		`SELECT
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
		FROM measurements
		WHERE id = $1`,
		measurementID,
	).Scan(
		&measurement.ID,
		&measurement.SessionID,
		&measurement.VenueID,
		&measurement.ZoneID,
		&measurement.MeasurementPointID,
		&measurement.Source,
		&measurement.RMSDecibels,
		&measurement.PeakDecibels,
		&measurement.NoiseLevel,
		&measurement.DistortionLevel,
		&measurement.ClippingDetected,
		&measurement.FeedbackDetected,
		&measurement.DurationSeconds,
		&measurement.SampleRate,
		&measurement.Channels,
		&measurement.CreatedAt,
	)
	if err != nil {
		return domain.Measurement{}, fmt.Errorf("get measurement: %w", err)
	}

	rows, err := r.db.Pool.Query(
		ctx,
		`SELECT
			frequency_hz,
			level_db
		FROM measurement_frequencies
		WHERE measurement_id = $1
		ORDER BY frequency_hz`,
		measurementID,
	)
	if err != nil {
		return domain.Measurement{}, fmt.Errorf(
			"get measurement frequencies: %w",
			err,
		)
	}
	defer rows.Close()

	for rows.Next() {
		var frequency domain.FrequencyMeasurement

		if err := rows.Scan(
			&frequency.FrequencyHz,
			&frequency.LevelDB,
		); err != nil {
			return domain.Measurement{}, fmt.Errorf(
				"scan measurement frequency: %w",
				err,
			)
		}

		measurement.FrequencyData = append(
			measurement.FrequencyData,
			frequency,
		)
	}

	if err := rows.Err(); err != nil {
		return domain.Measurement{}, fmt.Errorf(
			"read measurement frequencies: %w",
			err,
		)
	}

	return measurement, nil
}
