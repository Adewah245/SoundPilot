package storage

import (
	"context"
	"fmt"

	"github.com/Adewah245/SoundPilot/backend/internal/domain"
)

// ZoneRepository provides PostgreSQL persistence for zones.
type ZoneRepository struct {
	db *Database
}

// NewZoneRepository creates a zone repository.
func NewZoneRepository(db *Database) *ZoneRepository {
	return &ZoneRepository{
		db: db,
	}
}

// CreateZone stores a new zone.
func (r *ZoneRepository) CreateZone(
	ctx context.Context,
	zone domain.Zone,
) error {
	if r == nil || r.db == nil || r.db.Pool == nil {
		return fmt.Errorf("zone repository is not configured")
	}

	_, err := r.db.Pool.Exec(
		ctx,
		`INSERT INTO zones (
			id,
			venue_id,
			name,
			type
		) VALUES ($1, $2, $3, $4)`,
		zone.ID,
		zone.VenueID,
		zone.Name,
		zone.Type,
	)

	if err != nil {
		return fmt.Errorf("create zone: %w", err)
	}

	return nil
}

// ListZones returns all zones for a venue.
func (r *ZoneRepository) ListZones(
	ctx context.Context,
	venueID string,
) ([]domain.Zone, error) {
	if r == nil || r.db == nil || r.db.Pool == nil {
		return nil, fmt.Errorf("zone repository is not configured")
	}

	rows, err := r.db.Pool.Query(
		ctx,
		`SELECT
			id,
			venue_id,
			name,
			type,
			created_at,
			updated_at
		FROM zones
		WHERE venue_id = $1
		ORDER BY name`,
		venueID,
	)

	if err != nil {
		return nil, fmt.Errorf("list zones: %w", err)
	}

	defer rows.Close()

	zones := make([]domain.Zone, 0)

	for rows.Next() {
		var zone domain.Zone

		if err := rows.Scan(
			&zone.ID,
			&zone.VenueID,
			&zone.Name,
			&zone.Type,
			&zone.CreatedAt,
			&zone.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan zone: %w", err)
		}

		zones = append(zones, zone)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("read zones: %w", err)
	}

	return zones, nil
}

// GetZone retrieves one zone by ID.
func (r *ZoneRepository) GetZone(
	ctx context.Context,
	zoneID string,
) (domain.Zone, error) {
	if r == nil || r.db == nil || r.db.Pool == nil {
		return domain.Zone{}, fmt.Errorf("zone repository is not configured")
	}

	var zone domain.Zone

	err := r.db.Pool.QueryRow(
		ctx,
		`SELECT
			id,
			venue_id,
			name,
			type,
			created_at,
			updated_at
		FROM zones
		WHERE id = $1`,
		zoneID,
	).Scan(
		&zone.ID,
		&zone.VenueID,
		&zone.Name,
		&zone.Type,
		&zone.CreatedAt,
		&zone.UpdatedAt,
	)

	if err != nil {
		return domain.Zone{}, fmt.Errorf("get zone: %w", err)
	}

	return zone, nil
}
