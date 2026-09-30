// SoundPilot — Domain Types
// These types represent the data model the Go API returns.
// The frontend is a client of the existing Go API; these types
// mirror the API contract for type-safe consumption.

// ---------------------------------------------------------------------------
// Venue → Zone → Measurement Point hierarchy
// ---------------------------------------------------------------------------

export type VenueType =
  | 'church'
  | 'auditorium'
  | 'event_centre'
  | 'concert_hall'
  | 'studio'
  | 'other';

export interface Venue {
  id: string;
  name: string;
  type: VenueType;
  address: string;
  capacity: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Zone {
  id: string;
  venueId: string;
  name: string;
  description: string;
  order: number;
  measurementPointIds: string[];
}

export interface MeasurementPoint {
  id: string;
  zoneId: string;
  name: string;
  location: string;
  microphoneId: string | null;
  lastMeasurementId: string | null;
  status: MeasurementPointStatus;
}

export type MeasurementPointStatus =
  | 'optimal'
  | 'warning'
  | 'critical'
  | 'idle';

// ---------------------------------------------------------------------------
// Equipment & Signal Chain
// ---------------------------------------------------------------------------

export type EquipmentType =
  | 'mixer'
  | 'speaker'
  | 'subwoofer'
  | 'amplifier'
  | 'crossover'
  | 'microphone'
  | 'processor'
  | 'monitor';

export interface Equipment {
  id: string;
  venueId: string;
  name: string;
  type: EquipmentType;
  brand: string;
  model: string;
  quantity: number;
  status: EquipmentStatus;
  specs: Record<string, string>;
  notes: string;
}

export type EquipmentStatus = 'active' | 'standby' | 'fault' | 'offline';

export interface SignalChainNode {
  id: string;
  equipmentId: string;
  label: string;
  type: EquipmentType;
  order: number;
}

export interface SignalChain {
  id: string;
  venueId: string;
  name: string;
  nodes: SignalChainNode[];
}

// ---------------------------------------------------------------------------
// Measurement
// ---------------------------------------------------------------------------

export type MeasurementStatus = 'running' | 'stopped' | 'saved' | 'failed';

export interface Measurement {
  id: string;
  sessionId: string;
  measurementPointId: string;
  status: MeasurementStatus;
  timestamp: string;
  durationSec: number;
  metrics: MeasurementMetrics;
  waveform: number[];
  spectrum: SpectrumBin[];
}

export interface MeasurementMetrics {
  rms: number;
  peak: number;
  noise: number;
  distortion: number;
  clipping: boolean;
  feedback: number;
}

export interface SpectrumBin {
  freq: number;
  magnitude: number;
}

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

export type SessionStatus = 'active' | 'completed' | 'archived';

export interface Session {
  id: string;
  venueId: string;
  name: string;
  status: SessionStatus;
  engineerName: string;
  startedAt: string;
  endedAt: string | null;
  measurementCount: number;
  notes: string;
}

// ---------------------------------------------------------------------------
// Engineering
// ---------------------------------------------------------------------------

export interface EngineeringProfile {
  id: string;
  venueId: string;
  name: string;
  description: string;
  targets: EngineeringTarget[];
}

export interface EngineeringTarget {
  id: string;
  parameter: string;
  target: number;
  tolerance: number;
  unit: string;
}

export interface EngineeringResult {
  id: string;
  sessionId: string;
  profileId: string;
  parameter: string;
  target: number;
  actual: number;
  tolerance: number;
  unit: string;
  status: EngineeringStatus;
  finding: string;
  recommendation: string;
}

export type EngineeringStatus = 'accepted' | 'needs_adjustment' | 'rejected';

// ---------------------------------------------------------------------------
// Verification (Baseline → Change → Measure → Compare → Verify)
// ---------------------------------------------------------------------------

export type VerificationStatus = 'accepted' | 'needs_adjustment' | 'rejected';

export interface Baseline {
  id: string;
  venueId: string;
  measurementPointId: string;
  metrics: MeasurementMetrics;
  capturedAt: string;
  label: string;
}

export interface Verification {
  id: string;
  sessionId: string;
  measurementPointId: string;
  baselineId: string;
  parameter: string;
  before: number;
  after: number;
  target: number;
  unit: string;
  status: VerificationStatus;
  delta: number;
  note: string;
  verifiedAt: string;
}

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  venueId: string;
  sessionId: string | null;
  severity: AlertSeverity;
  title: string;
  message: string;
  source: string;
  acknowledged: boolean;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Smart Suggestion
// ---------------------------------------------------------------------------

export interface SmartSuggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  category: 'level' | 'eq' | 'feedback' | 'coverage' | 'safety';
}

// ---------------------------------------------------------------------------
// System Health
// ---------------------------------------------------------------------------

export interface SystemHealth {
  apiConnected: boolean;
  dspEngineOnline: boolean;
  lastSync: string;
  activeChannels: number;
  sampleRate: number;
  latencyMs: number;
}
