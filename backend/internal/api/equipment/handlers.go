package equipment

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/Adewah245/SoundPilot/backend/internal/domain"
	"github.com/Adewah245/SoundPilot/backend/internal/storage"
)

// Handler handles equipment HTTP requests.
type Handler struct {
	repository *storage.EquipmentRepository
}

// NewHandler creates a new equipment API handler.
func NewHandler(
	repository *storage.EquipmentRepository,
) *Handler {
	return &Handler{
		repository: repository,
	}
}

// CollectionHandler handles equipment collection requests.
func (h *Handler) CollectionHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	switch r.Method {
	case http.MethodGet:
		h.listEquipment(w, r)

	case http.MethodPost:
		h.createEquipment(w, r)

	default:
		http.Error(
			w,
			"method not allowed",
			http.StatusMethodNotAllowed,
		)
	}
}

// GetEquipmentHandler handles requests for one equipment record.
func (h *Handler) GetEquipmentHandler(
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

	equipmentID := strings.TrimPrefix(
		r.URL.Path,
		"/equipment/",
	)

	if equipmentID == "" {
		http.Error(
			w,
			"equipment id is required",
			http.StatusBadRequest,
		)
		return
	}

	equipment, err := h.repository.GetEquipment(
		r.Context(),
		equipmentID,
	)
	if err != nil {
		http.Error(
			w,
			"equipment not found",
			http.StatusNotFound,
		)
		return
	}

	writeJSON(
		w,
		http.StatusOK,
		equipment,
	)
}

// createEquipment creates a new equipment record.
func (h *Handler) createEquipment(
	w http.ResponseWriter,
	r *http.Request,
) {
	var equipment domain.Equipment

	if err := json.NewDecoder(r.Body).Decode(&equipment); err != nil {
		http.Error(
			w,
			"invalid request body",
			http.StatusBadRequest,
		)
		return
	}

	if equipment.ID == "" ||
		equipment.Name == "" ||
		equipment.Type == "" {
		http.Error(
			w,
			"id, name and type are required",
			http.StatusBadRequest,
		)
		return
	}

	if err := h.repository.CreateEquipment(
		r.Context(),
		equipment,
	); err != nil {
		http.Error(
			w,
			"failed to create equipment",
			http.StatusInternalServerError,
		)
		return
	}

	writeJSON(
		w,
		http.StatusCreated,
		equipment,
	)
}

// listEquipment returns all equipment records.
func (h *Handler) listEquipment(
	w http.ResponseWriter,
	r *http.Request,
) {
	equipmentList, err := h.repository.ListEquipment(
		r.Context(),
	)
	if err != nil {
		http.Error(
			w,
			"failed to list equipment",
			http.StatusInternalServerError,
		)
		return
	}

	writeJSON(
		w,
		http.StatusOK,
		equipmentList,
	)
}

// writeJSON writes a JSON response.
func writeJSON(
	w http.ResponseWriter,
	status int,
	data any,
) {
	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		http.Error(
			w,
			"failed to encode response",
			http.StatusInternalServerError,
		)
	}
}
