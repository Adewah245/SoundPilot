package engineering

import (
	"encoding/json"
	"net/http"

	"github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"
	engineeringservice "github.com/Adewah245/SoundPilot/backend/internal/engineering"
)

// Handler handles SoundPilot engineering API requests.
type Handler struct {
	service *engineeringservice.Service
}

// NewHandler creates a new engineering API handler.
func NewHandler(service *engineeringservice.Service) *Handler {
	return &Handler{
		service: service,
	}
}

// EvaluateHandler evaluates a measurement against engineering rules.
func (h *Handler) EvaluateHandler(
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

	var request contract.EngineeringEvaluationRequest

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(
			w,
			"invalid request body",
			http.StatusBadRequest,
		)
		return
	}

	result, err := h.service.Evaluate(request)
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
