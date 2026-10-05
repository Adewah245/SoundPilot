package server

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	baselineapi "github.com/Adewah245/SoundPilot/backend/internal/api/baseline"
	engineeringapi "github.com/Adewah245/SoundPilot/backend/internal/api/engineering"
	equipmentapi "github.com/Adewah245/SoundPilot/backend/internal/api/equipment"
	measurementapi "github.com/Adewah245/SoundPilot/backend/internal/api/measurement"
	measurementpointapi "github.com/Adewah245/SoundPilot/backend/internal/api/measurementpoint"
	sessionapi "github.com/Adewah245/SoundPilot/backend/internal/api/session"
	signalchainapi "github.com/Adewah245/SoundPilot/backend/internal/api/signalchain"
	venueapi "github.com/Adewah245/SoundPilot/backend/internal/api/venue"
	verificationapi "github.com/Adewah245/SoundPilot/backend/internal/api/verification"
	zoneapi "github.com/Adewah245/SoundPilot/backend/internal/api/zone"
	"github.com/Adewah245/SoundPilot/backend/internal/engineering"
	"github.com/Adewah245/SoundPilot/backend/internal/measurement"
	"github.com/Adewah245/SoundPilot/backend/internal/storage"
	"github.com/Adewah245/SoundPilot/backend/internal/verification"
)

// Server represents the SoundPilot HTTP server.
type Server struct {
	port                       string
	db                         *storage.Database
	measurementService         *measurement.Service
	measurementRepository      *storage.MeasurementRepository
	measurementPointRepository *storage.MeasurementPointRepository
	engineeringService         *engineering.Service
	engineeringRepository      *storage.EngineeringRepository
	verificationService        *verification.Service
	verificationRepository     *storage.VerificationRepository
	equipmentRepository        *storage.EquipmentRepository
	signalChainRepository      *storage.SignalChainRepository
	venueRepository            *storage.VenueRepository
	zoneRepository             *storage.ZoneRepository
	baselineRepository         *storage.BaselineRepository
	sessionRepository          *storage.SessionRepository
}

// NewServer creates the SoundPilot HTTP server.
func NewServer(
	port string,
	db *storage.Database,
	measurementService *measurement.Service,
	measurementRepository *storage.MeasurementRepository,
	measurementPointRepository *storage.MeasurementPointRepository,
	engineeringService *engineering.Service,
	engineeringRepository *storage.EngineeringRepository,
	verificationService *verification.Service,
	verificationRepository *storage.VerificationRepository,
	equipmentRepository *storage.EquipmentRepository,
	signalChainRepository *storage.SignalChainRepository,
	venueRepository *storage.VenueRepository,
	zoneRepository *storage.ZoneRepository,
	baselineRepository *storage.BaselineRepository,
	sessionRepository *storage.SessionRepository,

) *Server {
	return &Server{
		port:                       port,
		db:                         db,
		measurementService:         measurementService,
		measurementRepository:      measurementRepository,
		measurementPointRepository: measurementPointRepository,
		venueRepository:            venueRepository,
		engineeringService:         engineeringService,
		engineeringRepository:      engineeringRepository,
		verificationService:        verificationService,
		verificationRepository:     verificationRepository,
		equipmentRepository:        equipmentRepository,
		signalChainRepository:      signalChainRepository,
		zoneRepository:             zoneRepository,
		baselineRepository:         baselineRepository,
		sessionRepository:          sessionRepository,
	}
}

func withCORS(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusNoContent)
            return
        }

        next.ServeHTTP(w, r)
    })
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

	// Measurement point routes.
	measurementPointHandler := measurementpointapi.NewHandler(
		s.measurementPointRepository,
	)

	mux.HandleFunc(
		"/measurement-points",
		measurementPointHandler.CollectionHandler,
	)

	mux.HandleFunc(
		"/measurement-points/",
		measurementPointHandler.GetMeasurementPointHandler,
	)

	venueHandler := venueapi.NewHandler(
		s.venueRepository,
	)
	mux.HandleFunc("/venues", venueHandler.CollectionHandler)
	mux.HandleFunc("/venues/", venueHandler.GetVenueHandler)
	equipmentHandler := equipmentapi.NewHandler(
		s.equipmentRepository,
	)
	zoneHandler := zoneapi.NewHandler(
		s.zoneRepository,
	)
	mux.HandleFunc("/zones", zoneHandler.CollectionHandler)
	mux.HandleFunc("/zones/", zoneHandler.GetZoneHandler)
	mux.HandleFunc(
		"/equipment",
		equipmentHandler.CollectionHandler,
	)

	mux.HandleFunc(
		"/equipment/",
		equipmentHandler.GetEquipmentHandler,
	)
	baselineHandler := baselineapi.NewHandler(
		s.baselineRepository,
	)

	mux.HandleFunc(
		"/baselines",
		baselineHandler.CollectionHandler,
	)

	mux.HandleFunc(
		"/baselines/",
		baselineHandler.GetBaselineHandler,
	)
	signalChainHandler := signalchainapi.NewHandler(
		s.signalChainRepository,
	)
	sessionHandler := sessionapi.NewHandler(
		s.sessionRepository,
	)

	mux.HandleFunc(
		"/sessions",
		sessionHandler.CollectionHandler,
	)

	mux.HandleFunc(
		"/sessions/",
		sessionHandler.GetSessionHandler,
	)
	mux.HandleFunc("/signal-chains", signalChainHandler.CollectionHandler)
	mux.HandleFunc("/signal-chains/", signalChainHandler.GetSignalChainHandler)
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

    return http.ListenAndServe(":"+s.port, withCORS(mux))
}

// healthHandler reports server health.
// healthHandler reports server health.
func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodGet {
        http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
        return
    }

    w.Header().Set("Content-Type", "application/json")

    payload := map[string]any{
        "status":          "ok",
        "apiConnected":    true,
        "dspEngineOnline": true,
        "lastSync":        time.Now().UTC().Format(time.RFC3339),
        "activeChannels":  1,
        "sampleRate":      44100,
        "latencyMs":       12,
    }

    if err := json.NewEncoder(w).Encode(payload); err != nil {
        log.Printf("encode health response: %v", err)
    }
}
