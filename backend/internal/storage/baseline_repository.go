package storage

import (
	"context"
	"fmt"

	"github.com/Adewah245/SoundPilot/backend/internal/domain"
)

// BaselineRepository provides PostgreSQL persistence for baselines.
type BaselineRepository struct {
	db *Database
}

// NewBaselineRepository creates a baseline repository.
func NewBaselineRepository(db *Database) *BaselineRepository {
	return &BaselineRepository{
		db: db,
	}
}

// CreateBaseline stores a new baseline.
func (r *BaselineRepository) CreateBaseline(
	ctx context.Context,
	baseline domain.Baseline,
) error {
	if r == nil || r.db == nil || r.db.Pool == nil {
		return fmt.Errorf("baseline repository is not configured")
	}

	_, err := r.db.Pool.Exec(
		ctx,
		`INSERT INTO baselines (
			id,
			venue_id,
			name,
			description
		) VALUES ($1, $2, $3, $4)`,
		baseline.ID,
		baseline.VenueID,
		baseline.Name,
		baseline.Description,
	)

	if err != nil {
		return fmt.Errorf("create baseline: %w", err)
	}

	return nil
}

// ListBaselines returns all baselines for a venue.
func (r *BaselineRepository) ListBaselines(
	ctx context.Context,
	venueID string,
) ([]domain.Baseline, error) {
	if r == nil || r.db == nil || r.db.Pool == nil {
		return nil, fmt.Errorf("baseline repository is not configured")
	}

	rows, err := r.db.Pool.Query(
		ctx,
		`SELECT
			id,
			venue_id,
			name,
			description,
			created_at
		FROM baselines
		WHERE venue_id = $1
		ORDER BY created_at ASC`,
		venueID,
	)

	if err != nil {
		return nil, fmt.Errorf("list baselines: %w", err)
	}

	defer rows.Close()

	baselines := make([]domain.Baseline, 0)

	for rows.Next() {
		var baseline domain.Baseline

		if err := rows.Scan(
			&baseline.ID,
			&baseline.VenueID,
			&baseline.Name,
			&baseline.Description,
			&baseline.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan baseline: %w", err)
		}

		baselines = append(baselines, baseline)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("read baselines: %w", err)
	}

	return baselines, nil
}

// GetBaseline retrieves one baseline by ID.
func (r *BaselineRepository) GetBaseline(
	ctx context.Context,
	baselineID string,
) (domain.Baseline, error) {
	if r == nil || r.db == nil || r.db.Pool == nil {
		return domain.Baseline{}, fmt.Errorf("baseline repository is not configured")
	}

	var baseline domain.Baseline

	err := r.db.Pool.QueryRow(
		ctx,
		`SELECT
			id,
			venue_id,
			name,
			description,
			created_at
		FROM baselines
		WHERE id = $1`,
		baselineID,
	).Scan(
		&baseline.ID,
		&baseline.VenueID,
		&baseline.Name,
		&baseline.Description,
		&baseline.CreatedAt,
	)

	if err != nil {
		return domain.Baseline{}, fmt.Errorf("get baseline: %w", err)
	}

	return baseline, nil
}