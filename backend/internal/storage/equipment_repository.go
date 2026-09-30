package storage

import (
	"context"

	"github.com/Adewah245/SoundPilot/backend/internal/domain"
)

// EquipmentRepository handles equipment database operations.
type EquipmentRepository struct {
	db *Database
}

// NewEquipmentRepository creates a new equipment repository.
func NewEquipmentRepository(db *Database) *EquipmentRepository {
	return &EquipmentRepository{
		db: db,
	}
}

// CreateEquipment stores a new equipment record.
func (r *EquipmentRepository) CreateEquipment(
	ctx context.Context,
	equipment domain.Equipment,
) error {
	_, err := r.db.Pool.Exec(
		ctx,
		`
		INSERT INTO equipment (
			id,
			name,
			type,
			manufacturer,
			model,
			location,
			description
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		`,
		equipment.ID,
		equipment.Name,
		equipment.Type,
		equipment.Manufacturer,
		equipment.Model,
		equipment.Location,
		equipment.Description,
	)

	return err
}

// ListEquipment returns all equipment records.
func (r *EquipmentRepository) ListEquipment(
	ctx context.Context,
) ([]domain.Equipment, error) {
	rows, err := r.db.Pool.Query(
		ctx,
		`
		SELECT
			id,
			name,
			type,
			COALESCE(manufacturer, ''),
			COALESCE(model, ''),
			COALESCE(location, ''),
			COALESCE(description, ''),
			created_at,
			updated_at
		FROM equipment
		ORDER BY created_at ASC
		`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var equipmentList []domain.Equipment

	for rows.Next() {
		var equipment domain.Equipment

		if err := rows.Scan(
			&equipment.ID,
			&equipment.Name,
			&equipment.Type,
			&equipment.Manufacturer,
			&equipment.Model,
			&equipment.Location,
			&equipment.Description,
			&equipment.CreatedAt,
			&equipment.UpdatedAt,
		); err != nil {
			return nil, err
		}

		equipmentList = append(equipmentList, equipment)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return equipmentList, nil
}

// GetEquipment retrieves one equipment record by ID.
func (r *EquipmentRepository) GetEquipment(
	ctx context.Context,
	equipmentID string,
) (domain.Equipment, error) {
	var equipment domain.Equipment

	err := r.db.Pool.QueryRow(
		ctx,
		`
		SELECT
			id,
			name,
			type,
			COALESCE(manufacturer, ''),
			COALESCE(model, ''),
			COALESCE(location, ''),
			COALESCE(description, ''),
			created_at,
			updated_at
		FROM equipment
		WHERE id = $1
		`,
		equipmentID,
	).Scan(
		&equipment.ID,
		&equipment.Name,
		&equipment.Type,
		&equipment.Manufacturer,
		&equipment.Model,
		&equipment.Location,
		&equipment.Description,
		&equipment.CreatedAt,
		&equipment.UpdatedAt,
	)

	return equipment, err
}