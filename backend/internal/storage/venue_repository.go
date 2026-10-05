package storage

import (
	"context"
	"fmt"

	"github.com/Adewah245/SoundPilot/backend/internal/domain"
)

// VenueRepository provides PostgreSQL persistence for venues.
type VenueRepository struct {
	db *Database
}

// NewVenueRepository creates a venue repository.
func NewVenueRepository(db *Database) *VenueRepository {
	return &VenueRepository{
		db: db,
	}
}

// CreateVenue stores a new venue.
func (r *VenueRepository) CreateVenue(
	ctx context.Context,
	venue domain.Venue,
) error {
	if r == nil || r.db == nil || r.db.Pool == nil {
		return fmt.Errorf("venue repository is not configured")
	}

	_, err := r.db.Pool.Exec(
		ctx,
		`INSERT INTO venues (
			id,
			name,
			venue_type,
			address,
			measurement_unit,
			description,
			width_meters,
			length_meters,
			height_meters
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
		venue.ID,
		venue.Name,
		venue.Type,
		venue.Address,
		venue.MeasurementUnit,
		venue.Description,
		venue.WidthMeters,
		venue.LengthMeters,
		venue.HeightMeters,
	)

	if err != nil {
		return fmt.Errorf("create venue: %w", err)
	}

	return nil
}

// ListVenues returns all venues.
// ListVenues returns all venues.
func (r *VenueRepository) ListVenues(
	ctx context.Context,
) ([]domain.Venue, error) {
	if r == nil || r.db == nil || r.db.Pool == nil {
		return nil, fmt.Errorf("venue repository is not configured")
	}

	rows, err := r.db.Pool.Query(
		ctx,
		`SELECT
			id,
			name,
			venue_type,
			address,
			measurement_unit,
			description,
			COALESCE(width_meters, 0),
			COALESCE(length_meters, 0),
			COALESCE(height_meters, 0),
			created_at,
			updated_at
		FROM venues
		ORDER BY name`,
	)

	if err != nil {
		return nil, fmt.Errorf("list venues: %w", err)
	}

	defer rows.Close()

	venues := make([]domain.Venue, 0)

	for rows.Next() {
		var venue domain.Venue

		if err := rows.Scan(
			&venue.ID,
			&venue.Name,
			&venue.Type,
			&venue.Address,
			&venue.MeasurementUnit,
			&venue.Description,
			&venue.WidthMeters,
			&venue.LengthMeters,
			&venue.HeightMeters,
			&venue.CreatedAt,
			&venue.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan venue: %w", err)
		}

		venues = append(venues, venue)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("read venues: %w", err)
	}

	return venues, nil
}

// GetVenue retrieves one venue by ID.
// GetVenue retrieves one venue by ID.
func (r *VenueRepository) GetVenue(
	ctx context.Context,
	venueID string,
) (domain.Venue, error) {
	if r == nil || r.db == nil || r.db.Pool == nil {
		return domain.Venue{}, fmt.Errorf("venue repository is not configured")
	}

	var venue domain.Venue

	err := r.db.Pool.QueryRow(
		ctx,
		`SELECT
			id,
			name,
			venue_type,
			address,
			measurement_unit,
			description,
			COALESCE(width_meters, 0),
			COALESCE(length_meters, 0),
			COALESCE(height_meters, 0),
			created_at,
			updated_at
		FROM venues
		WHERE id = $1`,
		venueID,
	).Scan(
		&venue.ID,
		&venue.Name,
		&venue.Type,
		&venue.Address,
		&venue.MeasurementUnit,
		&venue.Description,
		&venue.WidthMeters,
		&venue.LengthMeters,
		&venue.HeightMeters,
		&venue.CreatedAt,
		&venue.UpdatedAt,
	)

	if err != nil {
		return domain.Venue{}, fmt.Errorf("get venue: %w", err)
	}

	return venue, nil
}

// ListDimensionMeasurements returns raw dimension measurements without averaging or replacing them.
func (r *VenueRepository) ListDimensionMeasurements(
	ctx context.Context,
	venueID string,
) ([]domain.VenueDimensionMeasurement, error) {
	if r == nil || r.db == nil || r.db.Pool == nil {
		return nil, fmt.Errorf("venue repository is not configured")
	}

	rows, err := r.db.Pool.Query(
		ctx,
		`SELECT
			id,
			venue_id,
			measurement_group_id,
			dimension,
			value_meters,
			method,
			source,
			confidence,
			COALESCE(device_info, ''),
			measured_at,
			COALESCE(notes, '')
		FROM venue_dimension_measurements
		WHERE venue_id = $1
		ORDER BY measured_at DESC, id`,
		venueID,
	)
	if err != nil {
		return nil, fmt.Errorf("list venue dimension measurements: %w", err)
	}
	defer rows.Close()

	measurements := make([]domain.VenueDimensionMeasurement, 0)
	for rows.Next() {
		var measurement domain.VenueDimensionMeasurement
		if err := rows.Scan(
			&measurement.ID,
			&measurement.VenueID,
			&measurement.MeasurementGroupID,
			&measurement.Dimension,
			&measurement.ValueMeters,
			&measurement.Method,
			&measurement.Source,
			&measurement.Confidence,
			&measurement.DeviceInfo,
			&measurement.MeasuredAt,
			&measurement.Notes,
		); err != nil {
			return nil, fmt.Errorf("scan venue dimension measurement: %w", err)
		}
		measurements = append(measurements, measurement)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("read venue dimension measurements: %w", err)
	}
	return measurements, nil
}

// SaveDimensionMeasurements appends raw records and updates the venue's current dimensions atomically.
func (r *VenueRepository) SaveDimensionMeasurements(
	ctx context.Context,
	measurements []domain.VenueDimensionMeasurement,
) ([]domain.VenueDimensionMeasurement, error) {
	if r == nil || r.db == nil || r.db.Pool == nil {
		return nil, fmt.Errorf("venue repository is not configured")
	}
	if len(measurements) == 0 {
		return nil, fmt.Errorf("at least one dimension measurement is required")
	}

	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("begin dimension measurement transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	saved := make([]domain.VenueDimensionMeasurement, 0, len(measurements))
	for _, measurement := range measurements {
		err := tx.QueryRow(
			ctx,
			`INSERT INTO venue_dimension_measurements (
				id,
				venue_id,
				measurement_group_id,
				dimension,
				value_meters,
				method,
				source,
				confidence,
				device_info,
				notes
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
			RETURNING measured_at`,
			measurement.ID,
			measurement.VenueID,
			measurement.MeasurementGroupID,
			measurement.Dimension,
			measurement.ValueMeters,
			measurement.Method,
			measurement.Source,
			measurement.Confidence,
			measurement.DeviceInfo,
			measurement.Notes,
		).Scan(&measurement.MeasuredAt)
		if err != nil {
			return nil, fmt.Errorf("insert venue dimension measurement: %w", err)
		}

		column := ""
		switch measurement.Dimension {
		case "length":
			column = "length_meters"
		case "width":
			column = "width_meters"
		case "height":
			column = "height_meters"
		default:
			return nil, fmt.Errorf("unsupported venue dimension %q", measurement.Dimension)
		}
		if _, err := tx.Exec(
			ctx,
			`UPDATE venues SET `+column+` = $1, updated_at = NOW() WHERE id = $2`,
			measurement.ValueMeters,
			measurement.VenueID,
		); err != nil {
			return nil, fmt.Errorf("update venue dimension: %w", err)
		}
		saved = append(saved, measurement)
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("commit venue dimension measurements: %w", err)
	}
	return saved, nil
}
