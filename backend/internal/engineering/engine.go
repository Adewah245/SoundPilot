package engineering

import (
	"fmt"
	"math"

	"github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"
)

// Engine evaluates measurements against engineering rules.
type Engine struct{}

// NewEngine creates a new engineering evaluation engine.
func NewEngine() *Engine {
	return &Engine{}
}

// Evaluate evaluates measured audio values and produces engineering findings.
func (e *Engine) Evaluate(
	request contract.EngineeringEvaluationRequest,
) (contract.EngineeringEvaluationResponse, error) {
	if request.ContractVersion == "" {
		return contract.EngineeringEvaluationResponse{}, fmt.Errorf(
			"contract version is required",
		)
	}

	if request.MeasurementID == "" {
		return contract.EngineeringEvaluationResponse{}, fmt.Errorf(
			"measurement ID is required",
		)
	}

	if request.EngineeringProfileID == "" {
		return contract.EngineeringEvaluationResponse{}, fmt.Errorf(
			"engineering profile is required",
		)
	}

	values := []struct {
		metric string
		actual float64
	}{
		{"rms", request.RMSDecibels},
		{"peak", request.PeakDecibels},
		{"noise", request.NoiseLevel},
		{"distortion", request.DistortionLevel},
	}

	findings := make([]contract.EngineeringFinding, 0)

	for _, value := range values {
		if math.IsNaN(value.actual) || math.IsInf(value.actual, 0) {
			findings = append(findings, contract.EngineeringFinding{
				Metric:  value.metric,
				Status:  "invalid",
				Actual:  value.actual,
				Message: fmt.Sprintf("%s measurement is not a valid number", value.metric),
			})
		}
	}

	if request.ClippingDetected {
		findings = append(findings, contract.EngineeringFinding{
			Metric:  "clipping",
			Status:  "warning",
			Message: "clipping was detected in the measurement",
		})
	}

	if request.FeedbackDetected {
		findings = append(findings, contract.EngineeringFinding{
			Metric:  "feedback",
			Status:  "warning",
			Message: "possible feedback was detected in the measurement",
		})
	}

	status := "pass"
	score := 100.0
	requiresVerification := false

	for _, finding := range findings {
		if finding.Status == "invalid" {
			status = "invalid"
			score = 0
			requiresVerification = true
			break
		}

		if finding.Status == "warning" {
			status = "warning"
			score -= 25
			requiresVerification = true
		}
	}

	if score < 0 {
		score = 0
	}

	return contract.EngineeringEvaluationResponse{
		ContractVersion:      request.ContractVersion,
		MeasurementID:        request.MeasurementID,
		EngineeringProfileID: request.EngineeringProfileID,
		Status:               status,
		Score:                score,
		Findings:             findings,
		RequiresVerification: requiresVerification,
	}, nil
}
