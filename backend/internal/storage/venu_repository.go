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
			description,
			width_meters,
			length_meters,
			height_meters
		) VALUES ($1, $2, $3, $4, $5, $6)`,
		venue.ID,
		venue.Name,
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
