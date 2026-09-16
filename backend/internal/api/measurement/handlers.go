package measurement

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"
	measurementservice "github.com/Adewah245/SoundPilot/backend/internal/measurement"
)

// Handler handles SoundPilot measurement API requests.
type Handler struct {
	service    *measurementservice.Service
	repository MeasurementRepository
}

// MeasurementRepository retrieves stored measurements for the API.
type MeasurementRepository interface {
	GetMeasurement(
		ctx context.Context,
		measurementID string,
	) (domain.Measurement, error)
}

// NewHandler creates a new measurement API handler.
func NewHandler(
	service *measurementservice.Service,
	repository MeasurementRepository,
) *Handler {
	return &Handler{
		service:    service,
		repository: repository,
	}
}

// MeasureHandler captures and analyses audio for a measurement point.
func (h *Handler) MeasureHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	if r.Method != http.MethodPost {
		http.Error(
			w,
			"method not allowed",
			http.StatusMethodNotAllowed,
		)
		return
	}

	var request contract.MeasurementRequest

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(
			w,
			"invalid request body",
			http.StatusBadRequest,
		)
		return
	}

	result, err := h.service.Measure(r.Context(), request)
	if err != nil {
		var validationErr *measurementservice.ValidationError

		if errors.As(err, &validationErr) {
			http.Error(
				w,
				err.Error(),
				http.StatusBadRequest,
			)
			return
		}

		http.Error(
			w,
			err.Error(),
			http.StatusInternalServerError,
		)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(result); err != nil {
		http.Error(
			w,
			"failed to encode response",
			http.StatusInternalServerError,
		)
	}
}

// GetMeasurementHandler retrieves one stored measurement.
func (h *Handler) GetMeasurementHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	if r.Method != http.MethodGet {
		http.Error(
			w,
			"method not allowed",
			http.StatusMethodNotAllowed,
		)
		return
	}

	measurementID := strings.TrimPrefix(
		r.URL.Path,
		"/measurements/",
	)

	if measurementID == "" {
		http.Error(
			w,
			"measurement ID is required",
			http.StatusBadRequest,
		)
		return
	}

	measurement, err := h.repository.GetMeasurement(
		r.Context(),
		measurementID,
	)
	if err != nil {
		http.Error(
			w,
			err.Error(),
			http.StatusInternalServerError,
		)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(measurement); err != nil {
		http.Error(
			w,
			"failed to encode response",
			http.StatusInternalServerError,
		)
	}
}
