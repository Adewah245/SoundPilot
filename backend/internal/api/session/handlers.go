package session

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/Adewah245/SoundPilot/backend/internal/domain"
	"github.com/Adewah245/SoundPilot/backend/internal/storage"
)

// Handler handles SoundPilot session API requests.
type Handler struct {
	repository *storage.SessionRepository
}

// NewHandler creates a new session API handler.
func NewHandler(
	repository *storage.SessionRepository,
) *Handler {
	return &Handler{
		repository: repository,
	}
}

// CollectionHandler handles session collection requests.
func (h *Handler) CollectionHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	switch r.Method {
	case http.MethodGet:
		h.listSessions(w, r)

	case http.MethodPost:
		h.createSession(w, r)

	default:
		http.Error(
			w,
			"method not allowed",
			http.StatusMethodNotAllowed,
		)
	}
}

// GetSessionHandler retrieves one session.
func (h *Handler) GetSessionHandler(
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

	sessionID := strings.TrimPrefix(
		r.URL.Path,
		"/sessions/",
	)

	if sessionID == "" {
		http.Error(
			w,
			"session ID is required",
			http.StatusBadRequest,
		)
		return
	}

	session, err := h.repository.GetSession(
		r.Context(),
		sessionID,
	)

	if err != nil {
		http.Error(
			w,
			err.Error(),
			http.StatusInternalServerError,
		)
		return
	}

	writeJSON(w, http.StatusOK, session)
}

// listSessions returns all sessions for a venue.
func (h *Handler) listSessions(
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

	sessions, err := h.repository.ListSessions(
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
		sessions,
	)
}

// createSession creates a new session.
func (h *Handler) createSession(
	w http.ResponseWriter,
	r *http.Request,
) {
	var input struct {
		VenueID string `json:"venue_id"`
		Name    string `json:"name"`
		Status  string `json:"status"`
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
	input.Status = strings.TrimSpace(input.Status)

	if input.VenueID == "" {
		http.Error(
			w,
			"venue_id is required",
			http.StatusBadRequest,
		)
		return
	}

	if input.Status == "" {
		input.Status = "active"
	}

	session := domain.Session{
		ID:        domain.NewID(),
		VenueID:   input.VenueID,
		Name:      input.Name,
		Status:    input.Status,
		StartedAt: time.Now(),
	}

	if err := h.repository.CreateSession(
		r.Context(),
		session,
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
		session,
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
