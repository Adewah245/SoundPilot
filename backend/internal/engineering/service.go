package engineering

import (
	"context"
	"fmt"

	"github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"
	"github.com/Adewah245/SoundPilot/backend/internal/storage"
)

// Service coordinates engineering evaluation.
type Service struct {
	engine     *Engine
	repository *storage.EngineeringRepository
}

// NewService creates an engineering service.
func NewService(
	engine *Engine,
	repository *storage.EngineeringRepository,
) *Service {
	return &Service{
		engine:     engine,
		repository: repository,
	}
}

// Evaluate evaluates a measurement against an engineering profile and stores the result.
func (s *Service) Evaluate(
	ctx context.Context,
	request contract.EngineeringEvaluationRequest,
) (contract.EngineeringEvaluationResponse, error) {
	if s.engine == nil {
		return contract.EngineeringEvaluationResponse{}, fmt.Errorf(
			"engineering engine is not configured",
		)
	}

	if s.repository == nil {
		return contract.EngineeringEvaluationResponse{}, fmt.Errorf(
			"engineering repository is not configured",
		)
	}

	result, err := s.engine.Evaluate(request)
	if err != nil {
		return contract.EngineeringEvaluationResponse{}, err
	}

	if err := s.repository.SaveEngineeringResult(
		ctx,
		request.MeasurementID,
		result,
	); err != nil {
		return contract.EngineeringEvaluationResponse{}, fmt.Errorf(
			"save engineering result: %w",
			err,
		)
	}

	return result, nil
}
