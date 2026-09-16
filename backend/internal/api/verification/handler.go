package verification

import (
	"encoding/json"
	"net/http"

	"github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"
	"github.com/Adewah245/SoundPilot/backend/internal/storage"
	verificationservice "github.com/Adewah245/SoundPilot/backend/internal/verification"
)

// Handler handles verification HTTP requests.
type Handler struct {
	service    *verificationservice.Service
	repository *storage.VerificationRepository
}

// NewHandler creates a verification HTTP handler.
func NewHandler(
	service *verificationservice.Service,
	repository *storage.VerificationRepository,
) *Handler {
	return &Handler{
		service:    service,
		repository: repository,
	}
}

// VerifyHandler verifies a measurement against its baseline and engineering result.
func (h *Handler) VerifyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var request contract.VerificationRequest

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// The engineering result currently supplies the score and status.
	// Detailed engineering rules will be connected here when the engine is completed.
	response, err := h.service.Verify(
		r.Context(),
		request,
		0,
		"pending",
		"Verification is pending engineering evaluation.",
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.repository.SaveVerification(
		r.Context(),
		request,
		response,
	); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "failed to encode response", http.StatusInternalServerError)
	}
}
