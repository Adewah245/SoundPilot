package storage

import (
	"context"
	"fmt"
	"time"

	"github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"
	"github.com/Adewah245/SoundPilot/backend/internal/domain"
)

// EngineeringRepository stores engineering evaluation results in PostgreSQL.
type EngineeringRepository struct {
	db *Database
}

// NewEngineeringRepository creates an engineering repository.
func NewEngineeringRepository(db *Database) *EngineeringRepository {
	return &EngineeringRepository{
		db: db,
	}
}

// SaveEngineeringResult stores an engineering result with its findings and recommendations.
func (r *EngineeringRepository) SaveEngineeringResult(
	ctx context.Context,
	measurementID string,
	result contract.EngineeringEvaluationResponse,
) error {
	if r.db == nil || r.db.Pool == nil {
		return fmt.Errorf("database is not configured")
	}

	resultID := domain.NewID()

	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin engineering result transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	_, err = tx.Exec(
		ctx,
		`INSERT INTO engineering_results (
			id,
			measurement_id,
			engineering_profile_id,
			status,
			score,
			requires_verification,
			created_at
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		resultID,
		measurementID,
		result.EngineeringProfileID,
		result.Status,
		result.Score,
		result.RequiresVerification,
		time.Now().UTC(),
	)
	if err != nil {
		return fmt.Errorf("save engineering result: %w", err)
	}

	for _, finding := range result.Findings {
		_, err = tx.Exec(
			ctx,
			`INSERT INTO engineering_findings (
				id,
				engineering_result_id,
				metric,
				status,
				actual,
				target,
				tolerance,
				message
			)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
			domain.NewID(),
			resultID,
			finding.Metric,
			finding.Status,
			finding.Actual,
			finding.Target,
			finding.Tolerance,
			finding.Message,
		)
		if err != nil {
			return fmt.Errorf("save engineering finding: %w", err)
		}
	}

	for position, recommendation := range result.Recommendations {
		_, err = tx.Exec(
			ctx,
			`INSERT INTO recommendations (
				id,
				engineering_result_id,
				recommendation,
				position
			)
			VALUES ($1, $2, $3, $4)`,
			domain.NewID(),
			resultID,
			recommendation,
			position,
		)
		if err != nil {
			return fmt.Errorf("save engineering recommendation: %w", err)
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("commit engineering result transaction: %w", err)
	}

	return nil
}

// GetEngineeringResult retrieves one engineering result with its findings and recommendations.
func (r *EngineeringRepository) GetEngineeringResult(
	ctx context.Context,
	resultID string,
) (contract.EngineeringEvaluationResponse, error) {
	if r.db == nil || r.db.Pool == nil {
		return contract.EngineeringEvaluationResponse{}, fmt.Errorf(
			"database is not configured",
		)
	}

	var result contract.EngineeringEvaluationResponse

	err := r.db.Pool.QueryRow(
		ctx,
		`SELECT
			er.measurement_id,
			er.engineering_profile_id,
			er.status,
			er.score,
			er.requires_verification
		FROM engineering_results er
		WHERE er.id = $1`,
		resultID,
	).Scan(
		&result.MeasurementID,
		&result.EngineeringProfileID,
		&result.Status,
		&result.Score,
		&result.RequiresVerification,
	)
	if err != nil {
		return contract.EngineeringEvaluationResponse{}, fmt.Errorf(
			"get engineering result: %w",
			err,
		)
	}

	rows, err := r.db.Pool.Query(
		ctx,
		`SELECT
			metric,
			status,
			actual,
			target,
			tolerance,
			message
		FROM engineering_findings
		WHERE engineering_result_id = $1
		ORDER BY id`,
		resultID,
	)
	if err != nil {
		return contract.EngineeringEvaluationResponse{}, fmt.Errorf(
			"get engineering findings: %w",
			err,
		)
	}
	defer rows.Close()

	for rows.Next() {
		var finding contract.EngineeringFinding

		if err := rows.Scan(
			&finding.Metric,
			&finding.Status,
			&finding.Actual,
			&finding.Target,
			&finding.Tolerance,
			&finding.Message,
		); err != nil {
			return contract.EngineeringEvaluationResponse{}, fmt.Errorf(
				"scan engineering finding: %w",
				err,
			)
		}

		result.Findings = append(result.Findings, finding)
	}

	if err := rows.Err(); err != nil {
		return contract.EngineeringEvaluationResponse{}, fmt.Errorf(
			"read engineering findings: %w",
			err,
		)
	}

	recommendationRows, err := r.db.Pool.Query(
		ctx,
		`SELECT
			recommendation
		FROM recommendations
		WHERE engineering_result_id = $1
		ORDER BY position`,
		resultID,
	)
	if err != nil {
		return contract.EngineeringEvaluationResponse{}, fmt.Errorf(
			"get engineering recommendations: %w",
			err,
		)
	}
	defer recommendationRows.Close()

	for recommendationRows.Next() {
		var recommendation string

		if err := recommendationRows.Scan(&recommendation); err != nil {
			return contract.EngineeringEvaluationResponse{}, fmt.Errorf(
				"scan engineering recommendation: %w",
				err,
			)
		}

		result.Recommendations = append(
			result.Recommendations,
			recommendation,
		)
	}

	if err := recommendationRows.Err(); err != nil {
		return contract.EngineeringEvaluationResponse{}, fmt.Errorf(
			"read engineering recommendations: %w",
			err,
		)
	}

	return result, nil
}
