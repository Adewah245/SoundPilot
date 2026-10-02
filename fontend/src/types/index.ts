// SoundPilot — Domain Types
// These types mirror the Go backend domain models and API contracts.

// ---------------------------------------------------------------------------
// Venue → Zone → Measurement Point hierarchy
// ---------------------------------------------------------------------------

export interface Venue {
  id: string;
  name: string;
  description?: string;
  width_meters?: number;
  length_meters?: number;
  height_meters?: number;
  created_at: string;
  updated_at: string;
}

export interface Zone {
  id: string;
  venue_id: string;
  name: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface MeasurementPoint {
  id: string;
  zone_id: string;
  name: string;
  position_x?: number;
  position_y?: number;
  position_z?: number;
  created_at: string;
  updated_at: string;
}

export type MeasurementPointStatus =
  | 'optimal'
  | 'warning'
  | 'critical'
  | 'idle';

// ---------------------------------------------------------------------------
// Equipment
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

export type EquipmentStatus =
  | 'active'
  | 'standby'
  | 'fault'
  | 'offline';

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType | string;
  manufacturer?: string;
  model?: string;
  location?: string;
  description?: string;
  duration_seconds?: number;
  sample_rate?: number;
  channels?: number;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Signal Chain
// ---------------------------------------------------------------------------

export interface SignalChain {
  id: string;
  name: string;
  equipment: string[];
}

export interface SignalChainNode {
  id: string;
  equipmentId: string;
  label: string;
  type: EquipmentType;
  order: number;
}

// ---------------------------------------------------------------------------
// Measurement
// ---------------------------------------------------------------------------

export interface MeasurementFrequencyData {
  frequency_hz: number;
  level_db: number;
}

export interface Measurement {
  id: string;

  session_id: string;
  venue_id: string;
  zone_id: string;
  measurement_point_id: string;

  source: string;

  rms_decibels: number;
  peak_decibels: number;

  frequency_data: MeasurementFrequencyData[];

  noise_level: number;
  distortion_level: number;

  clipping_detected: boolean;
  feedback_detected: boolean;

  duration_seconds: number;
  sample_rate: number;
  channels: number;

  created_at: string;
}

// ---------------------------------------------------------------------------
// Frontend Measurement Display Types
// ---------------------------------------------------------------------------

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

export type MeasurementStatus =
  | 'running'
  | 'stopped'
  | 'saved'
  | 'failed';

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

export type SessionStatus =
  | 'active'
  | 'completed'
  | 'archived';

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

export type EngineeringStatus =
  | 'accepted'
  | 'needs_adjustment'
  | 'rejected';

// ---------------------------------------------------------------------------
// Baseline
// ---------------------------------------------------------------------------

export interface Baseline {
  id: string;
  venueId: string;
  measurementPointId: string;
  metrics: MeasurementMetrics;
  capturedAt: string;
  label: string;
}

// ---------------------------------------------------------------------------
// Verification
// ---------------------------------------------------------------------------

export type VerificationStatus =
  | 'accepted'
  | 'needs_adjustment'
  | 'rejected';

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

export type AlertSeverity =
  | 'info'
  | 'warning'
  | 'critical';

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
// Smart Suggestions
// ---------------------------------------------------------------------------

export interface SmartSuggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  category:
    | 'level'
    | 'eq'
    | 'feedback'
    | 'coverage'
    | 'safety';
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