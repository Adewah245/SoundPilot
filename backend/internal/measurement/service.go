package measurement

import (
	"context"
	"fmt"

	"github.com/Adewah245/SoundPilot/backend/internal/domain"
	"github.com/Adewah245/SoundPilot/backend/internal/dsp"
	"github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"
)

// Service coordinates audio measurement through the DSP engine.
type Service struct {
	dspEngine *dsp.Engine
}

// NewService creates a new measurement service.
func NewService(dspEngine *dsp.Engine) *Service {
	return &Service{
		dspEngine: dspEngine,
	}
}

// Measure captures and analyses audio for a measurement point.
func (s *Service) Measure(
	ctx context.Context,
	request contract.MeasurementRequest,
) (domain.Measurement, error) {
	if s.dspEngine == nil {
		return domain.Measurement{}, fmt.Errorf("DSP engine is not configured")
	}

	// Send the measurement request to the Python DSP engine.
	response, err := s.dspEngine.Measure(ctx, request)
	if err != nil {
		return domain.Measurement{}, fmt.Errorf("measure audio: %w", err)
	}

	// Convert the DSP response into the SoundPilot domain model.
	return domain.Measurement{
		ID:                 request.SessionID,
		MeasurementPointID: request.MeasurementPointID,
		RMSDecibels:        response.RMSDecibels,
		PeakDecibels:       response.PeakDecibels,
		NoiseLevel:         response.NoiseLevel,
		DistortionLevel:    response.DistortionLevel,
		ClippingDetected:   response.ClippingDetected,
		FeedbackDetected:   response.FeedbackDetected,
		DurationSeconds:    response.DurationSeconds,
		SampleRate:         response.SampleRate,
		Channels:           response.Channels,
	}, nil
}
