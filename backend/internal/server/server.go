package server

import (
	"encoding/json"
	"log"
	"net/http"

	engineeringapi "github.com/Adewah245/SoundPilot/backend/internal/api/engineering"
	measurementapi "github.com/Adewah245/SoundPilot/backend/internal/api/measurement"
	verificationapi "github.com/Adewah245/SoundPilot/backend/internal/api/verification"
	"github.com/Adewah245/SoundPilot/backend/internal/engineering"
	"github.com/Adewah245/SoundPilot/backend/internal/measurement"
	"github.com/Adewah245/SoundPilot/backend/internal/storage"
	"github.com/Adewah245/SoundPilot/backend/internal/verification"
)

// Server represents the SoundPilot HTTP server.
type Server struct {
	port                   string
	db                     *storage.Database
	measurementService     *measurement.Service
	measurementRepository  *storage.MeasurementRepository
	engineeringService     *engineering.Service
	engineeringRepository  *storage.EngineeringRepository
	verificationService    *verification.Service
	verificationRepository *storage.VerificationRepository
}

// NewServer creates the SoundPilot HTTP server.
func NewServer(
	port string,
	db *storage.Database,
	measurementService *measurement.Service,
	measurementRepository *storage.MeasurementRepository,
	engineeringService *engineering.Service,
	engineeringRepository *storage.EngineeringRepository,
	verificationService *verification.Service,
	verificationRepository *storage.VerificationRepository,
) *Server {
	return &Server{
		port:                   port,
		db:                     db,
		measurementService:     measurementService,
		measurementRepository:  measurementRepository,
		engineeringService:     engineeringService,
		engineeringRepository:  engineeringRepository,
		verificationService:    verificationService,
		verificationRepository: verificationRepository,
	}
}

// Start starts the SoundPilot HTTP server.
func (s *Server) Start() error {
	mux := http.NewServeMux()

	// Measurement routes.
	measurementHandler := measurementapi.NewHandler(
		s.measurementService,
		s.measurementRepository,
	)

	mux.HandleFunc("/measurements", measurementHandler.MeasureHandler)
	mux.HandleFunc("/measurements/", measurementHandler.GetMeasurementHandler)

	// Engineering routes.
	engineeringHandler := engineeringapi.NewHandler(
		s.engineeringService,
		s.engineeringRepository,
	)

	mux.HandleFunc(
		"/engineering/evaluate",
		engineeringHandler.EvaluateHandler,
	)

	mux.HandleFunc(
		"/engineering/results/",
		engineeringHandler.GetResultHandler,
	)
	// Verification route.
	verificationHandler := verificationapi.NewHandler(
		s.verificationService,
		s.verificationRepository,
	)

	mux.HandleFunc(
		"/verification",
		verificationHandler.VerifyHandler,
	)
	// Health route.
	mux.HandleFunc("/health", s.healthHandler)

	log.Printf("SoundPilot server listening on :%s", s.port)

	return http.ListenAndServe(":"+s.port, mux)
}

// healthHandler reports server health.
func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(map[string]string{
		"status": "ok",
	}); err != nil {
		log.Printf("encode health response: %v", err)
	}
}
