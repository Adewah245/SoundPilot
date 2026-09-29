package storage

import (
	"context"
	"fmt"

	"github.com/Adewah245/SoundPilot/backend/internal/domain"
)

// MeasurementPointRepository provides PostgreSQL persistence for measurement points.
type MeasurementPointRepository struct {
	db *Database
}

// NewMeasurementPointRepository creates a measurement point repository.
func NewMeasurementPointRepository(db *Database) *MeasurementPointRepository {
	return &MeasurementPointRepository{
		db: db,
	}
}

// CreateMeasurementPoint stores a new measurement point.
func (r *MeasurementPointRepository) CreateMeasurementPoint(
	ctx context.Context,
	point domain.MeasurementPoint,
) error {
	if r == nil || r.db == nil || r.db.Pool == nil {
		return fmt.Errorf("measurement point repository is not configured")
	}

	_, err := r.db.Pool.Exec(
		ctx,
		`INSERT INTO measurement_points (
			id,
			zone_id,
			name,
			position_x,
			position_y,
			position_z
		) VALUES ($1, $2, $3, $4, $5, $6)`,
		point.ID,
		point.ZoneID,
		point.Name,
		point.PositionX,
		point.PositionY,
		point.PositionZ,
	)

	if err != nil {
		return fmt.Errorf("create measurement point: %w", err)
	}

	return nil
}

// ListMeasurementPoints returns all measurement points for a zone.
func (r *MeasurementPointRepository) ListMeasurementPoints(
	ctx context.Context,
	zoneID string,
) ([]domain.MeasurementPoint, error) {
	if r == nil || r.db == nil || r.db.Pool == nil {
		return nil, fmt.Errorf("measurement point repository is not configured")
	}

	rows, err := r.db.Pool.Query(
		ctx,
		`SELECT
			id,
			zone_id,
			name,
			COALESCE(position_x, 0),
			COALESCE(position_y, 0),
			COALESCE(position_z, 0),
			created_at,
			updated_at
		FROM measurement_points
		WHERE zone_id = $1
		ORDER BY name`,
		zoneID,
	)

	if err != nil {
		return nil, fmt.Errorf("list measurement points: %w", err)
	}

	defer rows.Close()

	points := make([]domain.MeasurementPoint, 0)

	for rows.Next() {
		var point domain.MeasurementPoint

		if err := rows.Scan(
			&point.ID,
			&point.ZoneID,
			&point.Name,
			&point.PositionX,
			&point.PositionY,
			&point.PositionZ,
			&point.CreatedAt,
			&point.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan measurement point: %w", err)
		}

		points = append(points, point)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("read measurement points: %w", err)
	}

	return points, nil
}

// GetMeasurementPoint retrieves one measurement point by ID.
func (r *MeasurementPointRepository) GetMeasurementPoint(
	ctx context.Context,
	pointID string,
) (domain.MeasurementPoint, error) {
	if r == nil || r.db == nil || r.db.Pool == nil {
		return domain.MeasurementPoint{}, fmt.Errorf("measurement point repository is not configured")
	}

	var point domain.MeasurementPoint

	err := r.db.Pool.QueryRow(
		ctx,
		`SELECT
			id,
			zone_id,
			name,
			COALESCE(position_x, 0),
			COALESCE(position_y, 0),
			COALESCE(position_z, 0),
			created_at,
			updated_at
		FROM measurement_points
		WHERE id = $1`,
		pointID,
	).Scan(
		&point.ID,
		&point.ZoneID,
		&point.Name,
		&point.PositionX,
		&point.PositionY,
		&point.PositionZ,
		&point.CreatedAt,
		&point.UpdatedAt,
	)

	if err != nil {
		return domain.MeasurementPoint{}, fmt.Errorf("get measurement point: %w", err)
	}

	return point, nil
}
