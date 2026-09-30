package storage

import (
	"context"
	"fmt"

	"github.com/Adewah245/SoundPilot/backend/internal/domain"
)

// SessionRepository provides PostgreSQL persistence for sessions.
type SessionRepository struct {
	db *Database
}

// NewSessionRepository creates a session repository.
func NewSessionRepository(db *Database) *SessionRepository {
	return &SessionRepository{
		db: db,
	}
}

// CreateSession stores a new session.
func (r *SessionRepository) CreateSession(
	ctx context.Context,
	session domain.Session,
) error {
	if r == nil || r.db == nil || r.db.Pool == nil {
		return fmt.Errorf("session repository is not configured")
	}

	_, err := r.db.Pool.Exec(
		ctx,
		`INSERT INTO sessions (
			id,
			venue_id,
			name,
			status,
			started_at,
			ended_at
		) VALUES ($1, $2, $3, $4, $5, $6)`,
		session.ID,
		session.VenueID,
		session.Name,
		session.Status,
		session.StartedAt,
		session.EndedAt,
	)

	if err != nil {
		return fmt.Errorf("create session: %w", err)
	}

	return nil
}

// ListSessions returns all sessions for a venue.
func (r *SessionRepository) ListSessions(
	ctx context.Context,
	venueID string,
) ([]domain.Session, error) {
	if r == nil || r.db == nil || r.db.Pool == nil {
		return nil, fmt.Errorf("session repository is not configured")
	}

	rows, err := r.db.Pool.Query(
		ctx,
		`SELECT
			id,
			venue_id,
			name,
			status,
			started_at,
			ended_at
		FROM sessions
		WHERE venue_id = $1
		ORDER BY started_at ASC`,
		venueID,
	)

	if err != nil {
		return nil, fmt.Errorf("list sessions: %w", err)
	}

	defer rows.Close()

	sessions := make([]domain.Session, 0)

	for rows.Next() {
		var session domain.Session

		if err := rows.Scan(
			&session.ID,
			&session.VenueID,
			&session.Name,
			&session.Status,
			&session.StartedAt,
			&session.EndedAt,
		); err != nil {
			return nil, fmt.Errorf("scan session: %w", err)
		}

		sessions = append(sessions, session)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("read sessions: %w", err)
	}

	return sessions, nil
}

// GetSession retrieves one session by ID.
func (r *SessionRepository) GetSession(
	ctx context.Context,
	sessionID string,
) (domain.Session, error) {
	if r == nil || r.db == nil || r.db.Pool == nil {
		return domain.Session{}, fmt.Errorf("session repository is not configured")
	}

	var session domain.Session

	err := r.db.Pool.QueryRow(
		ctx,
		`SELECT
			id,
			venue_id,
			name,
			status,
			started_at,
			ended_at
		FROM sessions
		WHERE id = $1`,
		sessionID,
	).Scan(
		&session.ID,
		&session.VenueID,
		&session.Name,
		&session.Status,
		&session.StartedAt,
		&session.EndedAt,
	)

	if err != nil {
		return domain.Session{}, fmt.Errorf("get session: %w", err)
	}

	return session, nil
}
