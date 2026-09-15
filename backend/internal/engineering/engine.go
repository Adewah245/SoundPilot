package engineering

import (
	"fmt"

	"github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"
)

// Engine evaluates measurements against engineering rules.
type Engine struct{}

// NewEngine creates a new engineering evaluation engine.
func NewEngine() *Engine {
	return &Engine{}
}

// Evaluate evaluates a measurement using the selected engineering profile.
func (e *Engine) Evaluate(
	request contract.EngineeringEvaluationRequest,
) (contract.EngineeringEvaluationResponse, error) {
	if request.EngineeringProfileID == "" {
		return contract.EngineeringEvaluationResponse{}, fmt.Errorf(
			"engineering profile is required",
		)
	}

	// Start with a neutral evaluation until profile rules are applied.
	response := contract.EngineeringEvaluationResponse{
		ContractVersion:      request.ContractVersion,
		MeasurementID:        request.MeasurementID,
		Status:               "pending",
		Score:                0,
		RequiresVerification: true,
	}

	return response, nil
}
