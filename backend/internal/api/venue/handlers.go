package venue

import (
	"encoding/json"
	"fmt"
	"math"
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
	path := strings.Trim(strings.TrimPrefix(r.URL.Path, "/venues/"), "/")
	parts := strings.Split(path, "/")
	if len(parts) == 2 && parts[1] == "dimensions" {
		h.dimensionMeasurementsHandler(w, r, parts[0])
		return
	}
	if r.Method != http.MethodGet {
		http.Error(
			w,
			"method not allowed",
			http.StatusMethodNotAllowed,
		)
		return
	}

	venueID := path

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
		Type            string `json:"type"`
		Address         string `json:"address"`
		MeasurementUnit string `json:"measurement_unit"`
		Name            string `json:"name"`
		Description     string `json:"description"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(
			w,
			"invalid request body",
			http.StatusBadRequest,
		)
		return
	}

	input.Name = strings.TrimSpace(input.Name)
	input.Type = strings.TrimSpace(input.Type)
	input.Address = strings.TrimSpace(input.Address)
	input.MeasurementUnit = strings.TrimSpace(input.MeasurementUnit)
	if input.Name == "" {
		http.Error(
			w,
			"venue name is required",
			http.StatusBadRequest,
		)
		return
	}
	if input.Type == "" {
		http.Error(w, "venue type is required", http.StatusBadRequest)
		return
	}
	if input.Address == "" {
		http.Error(w, "venue address is required", http.StatusBadRequest)
		return
	}
	if input.MeasurementUnit == "" {
		input.MeasurementUnit = "m"
	}
	if input.MeasurementUnit != "m" && input.MeasurementUnit != "ft" {
		http.Error(w, "measurement_unit must be m or ft", http.StatusBadRequest)
		return
	}

	venue := domain.Venue{
		ID:              domain.NewID(),
		Name:            input.Name,
		Type:            input.Type,
		Address:         input.Address,
		MeasurementUnit: input.MeasurementUnit,
		Description:     strings.TrimSpace(input.Description),
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

func (h *Handler) dimensionMeasurementsHandler(
	w http.ResponseWriter,
	r *http.Request,
	venueID string,
) {
	if venueID == "" {
		http.Error(w, "venue ID is required", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodGet:
		measurements, err := h.repository.ListDimensionMeasurements(r.Context(), venueID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeJSON(w, http.StatusOK, measurements)
	case http.MethodPost:
		var input struct {
			Measurements []struct {
				Dimension   string  `json:"dimension"`
				ValueMeters float64 `json:"value_meters"`
				Method      string  `json:"method"`
				Source      string  `json:"source"`
				Confidence  string  `json:"confidence"`
				DeviceInfo  string  `json:"device_info"`
				Notes       string  `json:"notes"`
			} `json:"measurements"`
		}
		decoder := json.NewDecoder(r.Body)
		decoder.DisallowUnknownFields()
		if err := decoder.Decode(&input); err != nil {
			http.Error(w, "invalid request body: "+err.Error(), http.StatusBadRequest)
			return
		}
		if len(input.Measurements) == 0 {
			http.Error(w, "at least one measurement is required", http.StatusBadRequest)
			return
		}

		groupID := domain.NewID()
		measurements := make([]domain.VenueDimensionMeasurement, 0, len(input.Measurements))
		seen := make(map[string]bool, len(input.Measurements))
		for _, item := range input.Measurements {
			item.Dimension = strings.ToLower(strings.TrimSpace(item.Dimension))
			item.Method = strings.ToLower(strings.TrimSpace(item.Method))
			item.Confidence = strings.ToLower(strings.TrimSpace(item.Confidence))
			item.Source = strings.TrimSpace(item.Source)
			if item.Dimension != "length" && item.Dimension != "width" && item.Dimension != "height" {
				http.Error(w, fmt.Sprintf("unsupported dimension %q", item.Dimension), http.StatusBadRequest)
				return
			}
			if seen[item.Dimension] {
				http.Error(w, "dimension may only appear once per save", http.StatusBadRequest)
				return
			}
			seen[item.Dimension] = true
			if item.ValueMeters <= 0 || math.IsNaN(item.ValueMeters) || math.IsInf(item.ValueMeters, 0) {
				http.Error(w, item.Dimension+" must be a positive finite number of metres", http.StatusBadRequest)
				return
			}
			switch item.Method {
			case "ar_walk", "ar_point", "manual", "laser":
			default:
				http.Error(w, "method must be ar_walk, ar_point, manual, or laser", http.StatusBadRequest)
				return
			}
			switch item.Confidence {
			case "excellent", "good", "needs_verification":
			default:
				http.Error(w, "confidence must be excellent, good, or needs_verification", http.StatusBadRequest)
				return
			}
			if item.Source == "" {
				http.Error(w, "source is required", http.StatusBadRequest)
				return
			}
			measurements = append(measurements, domain.VenueDimensionMeasurement{
				ID:                 domain.NewID(),
				VenueID:            venueID,
				MeasurementGroupID: groupID,
				Dimension:          item.Dimension,
				ValueMeters:        item.ValueMeters,
				Method:             item.Method,
				Source:             item.Source,
				Confidence:         item.Confidence,
				DeviceInfo:         strings.TrimSpace(item.DeviceInfo),
				Notes:              strings.TrimSpace(item.Notes),
			})
		}

		saved, err := h.repository.SaveDimensionMeasurements(r.Context(), measurements)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeJSON(w, http.StatusCreated, saved)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
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
