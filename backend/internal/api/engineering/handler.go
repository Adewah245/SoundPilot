package engineering

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"
	engineeringservice "github.com/Adewah245/SoundPilot/backend/internal/engineering"
	"github.com/Adewah245/SoundPilot/backend/internal/storage"
)

// Handler handles SoundPilot engineering API requests.
type Handler struct {
	service    *engineeringservice.Service
	repository *storage.EngineeringRepository
}

// NewHandler creates a new engineering API handler.
func NewHandler(
	service *engineeringservice.Service,
	repository *storage.EngineeringRepository,
) *Handler {
	return &Handler{
		service:    service,
		repository: repository,
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

	result, err := h.service.Evaluate(r.Context(), request)
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

// GetResultHandler retrieves one stored engineering result.
func (h *Handler) GetResultHandler(
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

	resultID := strings.TrimPrefix(
		r.URL.Path,
		"/engineering/results/",
	)

	if resultID == "" {
		http.Error(
			w,
			"engineering result ID is required",
			http.StatusBadRequest,
		)
		return
	}

	if h.repository == nil {
		http.Error(
			w,
			"engineering repository is not configured",
			http.StatusInternalServerError,
		)
		return
	}

	result, err := h.repository.GetEngineeringResult(
		r.Context(),
		resultID,
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

	if err := json.NewEncoder(w).Encode(result); err != nil {
		http.Error(
			w,
			"failed to encode response",
			http.StatusInternalServerError,
		)
	}
}
