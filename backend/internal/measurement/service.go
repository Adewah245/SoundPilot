package measurement

import (
	"context"
	"fmt"
	"time"

	"github.com/Adewah245/SoundPilot/backend/internal/domain"
	"github.com/Adewah245/SoundPilot/backend/internal/dsp"
	"github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"
	"github.com/Adewah245/SoundPilot/backend/internal/storage"
)

// Service coordinates audio measurement through the DSP engine.
type Service struct {
	dspEngine  *dsp.Engine
	repository *storage.MeasurementRepository
}

// NewService creates a new measurement service.
func NewService(
	dspEngine *dsp.Engine,
	repository *storage.MeasurementRepository,
) *Service {
	return &Service{
		dspEngine:  dspEngine,
		repository: repository,
	}
}

// Measure captures, analyses, and stores audio measurement data.
func (s *Service) Measure(
	ctx context.Context,
	request contract.MeasurementRequest,
) (domain.Measurement, error) {
	if s.dspEngine == nil {
		return domain.Measurement{}, fmt.Errorf("DSP engine is not configured")
	}

	if s.repository == nil {
		return domain.Measurement{}, fmt.Errorf("measurement repository is not configured")
	}

	// Send the measurement request to the Python DSP engine.
	response, err := s.dspEngine.Measure(ctx, request)
	if err != nil {
		return domain.Measurement{}, fmt.Errorf("measure audio: %w", err)
	}

	// Convert the DSP response into the SoundPilot domain model.
	measurement := domain.Measurement{
		ID:                 request.SessionID,
		SessionID:          request.SessionID,
		VenueID:            request.VenueID,
		ZoneID:             request.ZoneID,
		MeasurementPointID: request.MeasurementPointID,
		Source:             request.AudioSource,
		RMSDecibels:        response.RMSDecibels,
		PeakDecibels:       response.PeakDecibels,
		NoiseLevel:         response.NoiseLevel,
		DistortionLevel:    response.DistortionLevel,
		ClippingDetected:   response.ClippingDetected,
		FeedbackDetected:   response.FeedbackDetected,
		DurationSeconds:    response.DurationSeconds,
		SampleRate:         response.SampleRate,
		Channels:           response.Channels,
		CreatedAt:          response.Timestamp,
	}

	if measurement.CreatedAt.IsZero() {
		measurement.CreatedAt = time.Now().UTC()
	}

	// Store the completed measurement in PostgreSQL.
	if err := s.repository.SaveMeasurement(ctx, measurement); err != nil {
		return domain.Measurement{}, fmt.Errorf("save measurement: %w", err)
	}

	return measurement, nil
}
