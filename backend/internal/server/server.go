package server

import (
	"net/http"
)

// New creates and configures the SoundPilot HTTP server.
func New(port string) *http.Server {
	mux := http.NewServeMux()

	// Basic health endpoint for checking whether the server is running.
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"ok"}`))
	})

	return &http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}
}
