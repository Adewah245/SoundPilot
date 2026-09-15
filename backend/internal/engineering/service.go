package engineering

import (
	"fmt"

	"github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"
)

// Service coordinates engineering evaluation.
type Service struct {
	engine *Engine
}

// NewService creates an engineering service.
func NewService(engine *Engine) *Service {
	return &Service{
		engine: engine,
	}
}

// Evaluate evaluates a measurement against an engineering profile.
func (s *Service) Evaluate(
	request contract.EngineeringEvaluationRequest,
) (contract.EngineeringEvaluationResponse, error) {
	if s.engine == nil {
		return contract.EngineeringEvaluationResponse{}, fmt.Errorf(
			"engineering engine is not configured",
		)
	}

	return s.engine.Evaluate(request)
}
