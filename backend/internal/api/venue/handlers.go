package venue

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/Adewah245/SoundPilot/backend/internal/domain"
	"github.com/Adewah245/SoundPilot/backend/internal/storage"
)

// Handler handles SoundPilot venue API requests.
type Handler struct {
	repository *storage.VenueRepository
}

// NewHandler creates a new venue API handler.
func NewHandler(
	repository *storage.VenueRepository,
) *Handler {
	return &Handler{
		repository: repository,
	}
}

// CollectionHandler handles venue collection requests.
func (h *Handler) CollectionHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	switch r.Method {
	case http.MethodGet:
		h.listVenues(w, r)

	case http.MethodPost:
		h.createVenue(w, r)

	default:
		http.Error(
			w,
			"method not allowed",
			http.StatusMethodNotAllowed,
		)
	}
}

// GetVenueHandler retrieves one venue.
func (h *Handler) GetVenueHandler(
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

	venueID := strings.TrimPrefix(
		r.URL.Path,
		"/venues/",
	)

	if venueID == "" {
		http.Error(
			w,
			"venue ID is required",
			http.StatusBadRequest,
		)
		return
	}

	venue, err := h.repository.GetVenue(
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

	writeJSON(w, http.StatusOK, venue)
}

// listVenues returns all venues.
func (h *Handler) listVenues(
	w http.ResponseWriter,
	r *http.Request,
) {
	venues, err := h.repository.ListVenues(
		r.Context(),
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
		venues,
	)
}

// createVenue creates a new venue.
func (h *Handler) createVenue(
	w http.ResponseWriter,
	r *http.Request,
) {
	var input struct {
		Name         string  `json:"name"`
		Description  string  `json:"description"`
		WidthMeters  float64 `json:"width_meters"`
		LengthMeters float64 `json:"length_meters"`
		HeightMeters float64 `json:"height_meters"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(
			w,
			"invalid request body",
			http.StatusBadRequest,
		)
		return
	}

	if strings.TrimSpace(input.Name) == "" {
		http.Error(
			w,
			"venue name is required",
			http.StatusBadRequest,
		)
		return
	}

	venue := domain.Venue{
		ID:           domain.NewID(),
		Name:         strings.TrimSpace(input.Name),
		Description:  strings.TrimSpace(input.Description),
		WidthMeters:  input.WidthMeters,
		LengthMeters: input.LengthMeters,
		HeightMeters: input.HeightMeters,
	}

	if err := h.repository.CreateVenue(
		r.Context(),
		venue,
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
		venue,
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
