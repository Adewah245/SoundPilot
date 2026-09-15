package measurement

import (
	"encoding/json"
	"net/http"

	"github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"
	measurementservice "github.com/Adewah245/SoundPilot/backend/internal/measurement"
)

// Handler handles SoundPilot measurement API requests.
type Handler struct {
	service *measurementservice.Service
}

// NewHandler creates a new measurement API handler.
func NewHandler(service *measurementservice.Service) *Handler {
	return &Handler{
		service: service,
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
