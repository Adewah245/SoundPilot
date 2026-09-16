package measurement

import (
	"context"
	"fmt"
	"log"
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
	// Validate the measurement request before DSP processing.
	if err := ValidateRequest(request); err != nil {
		return domain.Measurement{}, fmt.Errorf(
			"validate measurement request: %w",
			err,
		)
	}

	if s.dspEngine == nil {
		return domain.Measurement{}, fmt.Errorf("DSP engine is not configured")
	}

	if s.repository == nil {
		return domain.Measurement{}, fmt.Errorf(
			"measurement repository is not configured",
		)
	}

	// Send the measurement request to the Python DSP engine.
	response, err := s.dspEngine.Measure(ctx, request)
	if err != nil {
		return domain.Measurement{}, fmt.Errorf("measure audio: %w", err)
	}

	// Validate the response before converting or storing it.
	if err := ValidateResponse(request, response); err != nil {
		return domain.Measurement{}, fmt.Errorf(
			"validate DSP response: %w",
			err,
		)
	}

	// Convert DSP frequency measurements into domain measurements.
	frequencyData := make(
		[]domain.FrequencyMeasurement,
		0,
		len(response.FrequencyData),
	)

	for _, frequency := range response.FrequencyData {
		frequencyData = append(
			frequencyData,
			domain.FrequencyMeasurement{
				FrequencyHz: frequency.FrequencyHz,
				LevelDB:     frequency.LevelDB,
			},
		)
	}

	// Convert the DSP response into the SoundPilot domain model.
	measurement := domain.Measurement{
		ID:                 domain.NewID(),
		SessionID:          request.SessionID,
		VenueID:            request.VenueID,
		ZoneID:             request.ZoneID,
		MeasurementPointID: request.MeasurementPointID,
		Source:             request.AudioSource,
		RMSDecibels:        response.RMSDecibels,
		PeakDecibels:       response.PeakDecibels,
		FrequencyData:      frequencyData,
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
	log.Println("MEASUREMENT SAVED")

	return measurement, nil
}
