package server

import (
	"encoding/json"
	"log"
	"net/http"

	engineeringapi "github.com/Adewah245/SoundPilot/backend/internal/api/engineering"
	equipmentapi "github.com/Adewah245/SoundPilot/backend/internal/api/equipment"
	measurementapi "github.com/Adewah245/SoundPilot/backend/internal/api/measurement"
	measurementpointapi "github.com/Adewah245/SoundPilot/backend/internal/api/measurementpoint"
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

	signalChainHandler := signalchainapi.NewHandler(
		s.signalChainRepository,
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
