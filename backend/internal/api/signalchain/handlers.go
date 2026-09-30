package signalchain

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/Adewah245/SoundPilot/backend/internal/domain"
	"github.com/Adewah245/SoundPilot/backend/internal/storage"
)

// Handler handles signal chain HTTP requests.
type Handler struct {
	repository *storage.SignalChainRepository
}

// NewHandler creates a new signal chain API handler.
func NewHandler(
	repository *storage.SignalChainRepository,
) *Handler {
	return &Handler{
		repository: repository,
	}
}

// CollectionHandler handles signal chain collection requests.
func (h *Handler) CollectionHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	switch r.Method {
	case http.MethodGet:
		h.listSignalChains(w, r)
	case http.MethodPost:
		h.createSignalChain(w, r)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

// GetSignalChainHandler handles requests for one signal chain.
func (h *Handler) GetSignalChainHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	signalChainID := strings.TrimPrefix(r.URL.Path, "/signal-chains/")
	if signalChainID == "" {
		http.Error(w, "signal chain id is required", http.StatusBadRequest)
		return
	}

	signalChain, err := h.repository.GetSignalChain(
		r.Context(),
		signalChainID,
	)
	if err != nil {
		http.Error(w, "signal chain not found", http.StatusNotFound)
		return
	}

	writeJSON(w, http.StatusOK, signalChain)
}

// createSignalChain creates a new signal chain.
func (h *Handler) createSignalChain(
	w http.ResponseWriter,
	r *http.Request,
) {
	var signalChain domain.SignalChain

	if err := json.NewDecoder(r.Body).Decode(&signalChain); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if signalChain.ID == "" || signalChain.Name == "" {
		http.Error(
			w,
			"id and name are required",
			http.StatusBadRequest,
		)
		return
	}

	if err := h.repository.CreateSignalChain(
		r.Context(),
		signalChain,
	); err != nil {
		http.Error(
			w,
			"failed to create signal chain",
			http.StatusInternalServerError,
		)
		return
	}

	writeJSON(w, http.StatusCreated, signalChain)
}

// listSignalChains returns all signal chains.
func (h *Handler) listSignalChains(
	w http.ResponseWriter,
	r *http.Request,
) {
	signalChains, err := h.repository.ListSignalChains(
		r.Context(),
	)
	if err != nil {
		http.Error(
			w,
			"failed to list signal chains",
			http.StatusInternalServerError,
		)
		return
	}

	writeJSON(w, http.StatusOK, signalChains)
}

// writeJSON writes a JSON response.
func writeJSON(
	w http.ResponseWriter,
	status int,
	data any,
) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		http.Error(
			w,
			"failed to encode response",
			http.StatusInternalServerError,
		)
	}
}
