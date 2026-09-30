package storage

import (
	"context"

	"github.com/Adewah245/SoundPilot/backend/internal/domain"
)

// SignalChainRepository handles signal chain database operations.
type SignalChainRepository struct {
	db *Database
}

// NewSignalChainRepository creates a new signal chain repository.
func NewSignalChainRepository(db *Database) *SignalChainRepository {
	return &SignalChainRepository{db: db}
}

// CreateSignalChain stores a new signal chain and its equipment order.
func (r *SignalChainRepository) CreateSignalChain(
	ctx context.Context,
	signalChain domain.SignalChain,
) error {
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	_, err = tx.Exec(
		ctx,
		`
		INSERT INTO signal_chains (
			id,
			name
		)
		VALUES ($1, $2)
		`,
		signalChain.ID,
		signalChain.Name,
	)
	if err != nil {
		return err
	}

	for position, equipmentID := range signalChain.Equipment {
		_, err = tx.Exec(
			ctx,
			`
			INSERT INTO signal_chain_equipment (
				signal_chain_id,
				equipment_id,
				position
			)
			VALUES ($1, $2, $3)
			`,
			signalChain.ID,
			equipmentID,
			position,
		)
		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}

// ListSignalChains returns all signal chains with their equipment order.
func (r *SignalChainRepository) ListSignalChains(
	ctx context.Context,
) ([]domain.SignalChain, error) {
	rows, err := r.db.Pool.Query(
		ctx,
		`
		SELECT
			sc.id,
			sc.name,
			COALESCE(
				ARRAY_AGG(sce.equipment_id ORDER BY sce.position)
					FILTER (WHERE sce.equipment_id IS NOT NULL),
				'{}'
			)
		FROM signal_chains sc
		LEFT JOIN signal_chain_equipment sce
			ON sc.id = sce.signal_chain_id
		GROUP BY sc.id, sc.name
		ORDER BY sc.created_at ASC
		`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var signalChains []domain.SignalChain

	for rows.Next() {
		var signalChain domain.SignalChain

		if err := rows.Scan(
			&signalChain.ID,
			&signalChain.Name,
			&signalChain.Equipment,
		); err != nil {
			return nil, err
		}

		signalChains = append(signalChains, signalChain)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return signalChains, nil
}

// GetSignalChain retrieves one signal chain by ID.
func (r *SignalChainRepository) GetSignalChain(
	ctx context.Context,
	signalChainID string,
) (domain.SignalChain, error) {
	var signalChain domain.SignalChain

	err := r.db.Pool.QueryRow(
		ctx,
		`
		SELECT
			sc.id,
			sc.name,
			COALESCE(
				ARRAY_AGG(sce.equipment_id ORDER BY sce.position)
					FILTER (WHERE sce.equipment_id IS NOT NULL),
				'{}'
			)
		FROM signal_chains sc
		LEFT JOIN signal_chain_equipment sce
			ON sc.id = sce.signal_chain_id
		WHERE sc.id = $1
		GROUP BY sc.id, sc.name
		`,
		signalChainID,
	).Scan(
		&signalChain.ID,
		&signalChain.Name,
		&signalChain.Equipment,
	)

	return signalChain, err
}
