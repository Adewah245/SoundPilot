package measurementpoint

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/Adewah245/SoundPilot/backend/internal/domain"
	"github.com/Adewah245/SoundPilot/backend/internal/storage"
)

// Handler handles SoundPilot measurement point API requests.
type Handler struct {
	repository *storage.MeasurementPointRepository
}

// NewHandler creates a new measurement point API handler.
func NewHandler(
	repository *storage.MeasurementPointRepository,
) *Handler {
	return &Handler{
		repository: repository,
	}
}

// CollectionHandler handles measurement point collection requests.
func (h *Handler) CollectionHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	switch r.Method {
	case http.MethodGet:
		h.listMeasurementPoints(w, r)
	case http.MethodPost:
		h.createMeasurementPoint(w, r)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

// GetMeasurementPointHandler retrieves one measurement point.
func (h *Handler) GetMeasurementPointHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pointID := strings.TrimPrefix(r.URL.Path, "/measurement-points/")

	if pointID == "" {
		http.Error(w, "measurement point ID is required", http.StatusBadRequest)
		return
	}

	point, err := h.repository.GetMeasurementPoint(
		r.Context(),
		pointID,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusOK, point)
}

// listMeasurementPoints returns all measurement points for a zone.
func (h *Handler) listMeasurementPoints(
	w http.ResponseWriter,
	r *http.Request,
) {
	zoneID := strings.TrimSpace(
		r.URL.Query().Get("zone_id"),
	)

	if zoneID == "" {
		http.Error(w, "zone_id is required", http.StatusBadRequest)
		return
	}

	points, err := h.repository.ListMeasurementPoints(
		r.Context(),
		zoneID,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusOK, points)
}

// createMeasurementPoint creates a new measurement point.
func (h *Handler) createMeasurementPoint(
	w http.ResponseWriter,
	r *http.Request,
) {
	var input struct {
		ZoneID    string  `json:"zone_id"`
		Name      string  `json:"name"`
		PositionX float64 `json:"position_x"`
		PositionY float64 `json:"position_y"`
		PositionZ float64 `json:"position_z"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	input.ZoneID = strings.TrimSpace(input.ZoneID)
	input.Name = strings.TrimSpace(input.Name)

	if input.ZoneID == "" {
		http.Error(w, "zone_id is required", http.StatusBadRequest)
		return
	}

	if input.Name == "" {
		http.Error(w, "measurement point name is required", http.StatusBadRequest)
		return
	}

	point := domain.MeasurementPoint{
		ID:        domain.NewID(),
		ZoneID:    input.ZoneID,
		Name:      input.Name,
		PositionX: input.PositionX,
		PositionY: input.PositionY,
		PositionZ: input.PositionZ,
	}

	if err := h.repository.CreateMeasurementPoint(
		r.Context(),
		point,
	); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusCreated, point)
}

// writeJSON writes a JSON API response.
func writeJSON(
	w http.ResponseWriter,
	status int,
	value any,
) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(value); err != nil {
		http.Error(
			w,
			"failed to encode response",
			http.StatusInternalServerError,
		)
	}
}
