package server

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Adewah245/SoundPilot/backend/internal/dsp"
	"github.com/Adewah245/SoundPilot/backend/internal/storage"
)

// Server contains the SoundPilot HTTP server configuration.
type Server struct {
	port      string
	db        *storage.Database
	dspEngine *dsp.Engine
}

// NewServer creates a new SoundPilot HTTP server.
func NewServer(
	port string,
	db *storage.Database,
	dspEngine *dsp.Engine,
) *Server {
	return &Server{
		port:      port,
		db:        db,
		dspEngine: dspEngine,
	}
}

// Start starts the SoundPilot HTTP server.
func (s *Server) Start() error {
	mux := http.NewServeMux()

	// Health endpoint confirms that the Go application is running.
	mux.HandleFunc("/health", s.healthHandler)

	address := fmt.Sprintf(":%s", s.port)

	log.Printf("HTTP server listening on %s", address)

	return http.ListenAndServe(address, mux)
}

// healthHandler returns the current application health status.
func (s *Server) healthHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	w.Header().Set("Content-Type", "application/json")

	w.WriteHeader(http.StatusOK)

	_, _ = w.Write([]byte(`{"status":"ok"}`))
}
