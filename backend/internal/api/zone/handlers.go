package zone

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/Adewah245/SoundPilot/backend/internal/domain"
	"github.com/Adewah245/SoundPilot/backend/internal/storage"
)

// Handler handles SoundPilot zone API requests.
type Handler struct {
	repository *storage.ZoneRepository
}

// NewHandler creates a new zone API handler.
func NewHandler(
	repository *storage.ZoneRepository,
) *Handler {
	return &Handler{
		repository: repository,
	}
}

// CollectionHandler handles zone collection requests.
func (h *Handler) CollectionHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	switch r.Method {
	case http.MethodGet:
		h.listZones(w, r)

	case http.MethodPost:
		h.createZone(w, r)

	default:
		http.Error(
			w,
			"method not allowed",
			http.StatusMethodNotAllowed,
		)
	}
}

// GetZoneHandler retrieves one zone.
func (h *Handler) GetZoneHandler(
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

	zoneID := strings.TrimPrefix(
		r.URL.Path,
		"/zones/",
	)

	if zoneID == "" {
		http.Error(
			w,
			"zone ID is required",
			http.StatusBadRequest,
		)
		return
	}

	zone, err := h.repository.GetZone(
		r.Context(),
		zoneID,
	)

	if err != nil {
		http.Error(
			w,
			err.Error(),
			http.StatusInternalServerError,
		)
		return
	}

	writeJSON(w, http.StatusOK, zone)
}

// listZones returns all zones for a venue.
func (h *Handler) listZones(
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

	zones, err := h.repository.ListZones(
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
		zones,
	)
}

// createZone creates a new zone.
func (h *Handler) createZone(
	w http.ResponseWriter,
	r *http.Request,
) {
	var input struct {
		VenueID string `json:"venue_id"`
		Name    string `json:"name"`
		Type    string `json:"type"`
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
	input.Type = strings.TrimSpace(input.Type)

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
			"zone name is required",
			http.StatusBadRequest,
		)
		return
	}

	zone := domain.Zone{
		ID:      domain.NewID(),
		VenueID: input.VenueID,
		Name:    input.Name,
		Type:    input.Type,
	}

	if err := h.repository.CreateZone(
		r.Context(),
		zone,
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
		zone,
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
