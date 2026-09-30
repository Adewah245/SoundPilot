package baseline

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/Adewah245/SoundPilot/backend/internal/domain"
	"github.com/Adewah245/SoundPilot/backend/internal/storage"
)

// Handler handles SoundPilot baseline API requests.
type Handler struct {
	repository *storage.BaselineRepository
}

// NewHandler creates a new baseline API handler.
func NewHandler(
	repository *storage.BaselineRepository,
) *Handler {
	return &Handler{
		repository: repository,
	}
}

// CollectionHandler handles baseline collection requests.
func (h *Handler) CollectionHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	switch r.Method {
	case http.MethodGet:
		h.listBaselines(w, r)

	case http.MethodPost:
		h.createBaseline(w, r)

	default:
		http.Error(
			w,
			"method not allowed",
			http.StatusMethodNotAllowed,
		)
	}
}

// GetBaselineHandler retrieves one baseline.
func (h *Handler) GetBaselineHandler(
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

	baselineID := strings.TrimPrefix(
		r.URL.Path,
		"/baselines/",
	)

	if baselineID == "" {
		http.Error(
			w,
			"baseline ID is required",
			http.StatusBadRequest,
		)
		return
	}

	baseline, err := h.repository.GetBaseline(
		r.Context(),
		baselineID,
	)

	if err != nil {
		http.Error(
			w,
			err.Error(),
			http.StatusInternalServerError,
		)
		return
	}

	writeJSON(w, http.StatusOK, baseline)
}

// listBaselines returns all baselines for a venue.
func (h *Handler) listBaselines(
	w http.ResponseWriter,
	r *http.Request,
) {
	venueID := strings.TrimSpace(
		r.URL.Query().Get("venue_id"),
	)

	if venueID == "" {
		http.Error(
			w,
			"venue_id is required",
			http.StatusBadRequest,
		)
		return
	}

	baselines, err := h.repository.ListBaselines(
		r.Context(),
		venueID,
	)

	if err != nil {
		http.Error(
			w,
			err.Error(),
			http.StatusInternalServerError,
		)
		return
	}

	writeJSON(
		w,
		http.StatusOK,
		baselines,
	)
}

// createBaseline creates a new baseline.
func (h *Handler) createBaseline(
	w http.ResponseWriter,
	r *http.Request,
) {
	var input struct {
		VenueID     string `json:"venue_id"`
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(
			w,
			"invalid request body",
			http.StatusBadRequest,
		)
		return
	}

	input.VenueID = strings.TrimSpace(input.VenueID)
	input.Name = strings.TrimSpace(input.Name)
	input.Description = strings.TrimSpace(input.Description)

	if input.VenueID == "" {
		http.Error(
			w,
			"venue_id is required",
			http.StatusBadRequest,
		)
		return
	}

	if input.Name == "" {
		http.Error(
			w,
			"baseline name is required",
			http.StatusBadRequest,
		)
		return
	}

	baseline := domain.Baseline{
		ID:          domain.NewID(),
		VenueID:     input.VenueID,
		Name:        input.Name,
		Description: input.Description,
	}

	if err := h.repository.CreateBaseline(
		r.Context(),
		baseline,
	); err != nil {
		http.Error(
			w,
			err.Error(),
			http.StatusInternalServerError,
		)
		return
	}

	writeJSON(
		w,
		http.StatusCreated,
		baseline,
	)
}

// writeJSON writes a JSON API response.
func writeJSON(
	w http.ResponseWriter,
	status int,
	value any,
) {
	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(value); err != nil {
		http.Error(
			w,
			"failed to encode response",
			http.StatusInternalServerError,
		)
	}
}
