// SoundPilot — Mock Data
// Demo data used only when the API is unavailable.
// The data structure follows the backend domain types.

import type {
  Alert,
  Baseline,
  EngineeringProfile,
  EngineeringResult,
  Equipment,
  Measurement,
  MeasurementPoint,
  Session,
  SignalChain,
  SmartSuggestion,
  SystemHealth,
  Venue,
  Verification,
  Zone,
} from '@/types';


// ---------------------------------------------------------------------------
// Venue → Zone → Measurement Point
// ---------------------------------------------------------------------------

export const mockVenues: Venue[] = [
  {
    id: 'v-001',
    name: 'Main Auditorium',
    description:
      'Primary worship auditorium with a full-range PA system and dedicated FOH mixing position.',
    width_meters: 30,
    length_meters: 45,
    height_meters: 12,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'v-002',
    name: 'Chapel Hall',
    description:
      'Intimate chapel space with a compact PA system.',
    width_meters: 15,
    length_meters: 25,
    height_meters: 8,
    created_at: '2026-02-20T08:00:00Z',
    updated_at: '2026-09-20T10:00:00Z',
  },
];

export const mockZones: Zone[] = [
  {
    id: 'z-001',
    venue_id: 'v-001',
    name: 'Front',
    type: 'seating',
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'z-002',
    venue_id: 'v-001',
    name: 'Middle',
    type: 'seating',
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'z-003',
    venue_id: 'v-001',
    name: 'Rear',
    type: 'seating',
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'z-004',
    venue_id: 'v-001',
    name: 'Altar',
    type: 'stage',
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'z-005',
    venue_id: 'v-001',
    name: 'Stage',
    type: 'stage',
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'z-006',
    venue_id: 'v-001',
    name: 'Monitors',
    type: 'monitor',
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'z-007',
    venue_id: 'v-002',
    name: 'Main Floor',
    type: 'seating',
    created_at: '2026-02-20T08:00:00Z',
    updated_at: '2026-09-20T10:00:00Z',
  },
];

export const mockMeasurementPoints: MeasurementPoint[] = [
  {
    id: 'mp-001',
    zone_id: 'z-001',
    name: 'FOH Center',
    position_x: 15,
    position_y: 5,
    position_z: 1.2,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'mp-002',
    zone_id: 'z-001',
    name: 'FOH Left',
    position_x: 8,
    position_y: 7,
    position_z: 1.2,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'mp-003',
    zone_id: 'z-002',
    name: 'Mid Center',
    position_x: 15,
    position_y: 20,
    position_z: 1.2,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'mp-004',
    zone_id: 'z-003',
    name: 'Balcony Rear',
    position_x: 15,
    position_y: 40,
    position_z: 4,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'mp-005',
    zone_id: 'z-004',
    name: 'Altar Center',
    position_x: 15,
    position_y: 2,
    position_z: 1.2,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'mp-006',
    zone_id: 'z-005',
    name: 'Stage Monitor',
    position_x: 15,
    position_y: 0,
    position_z: 1.2,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'mp-007',
    zone_id: 'z-006',
    name: 'Monitor World',
    position_x: 5,
    position_y: 5,
    position_z: 1.2,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'mp-008',
    zone_id: 'z-007',
    name: 'Chapel Center',
    position_x: 7.5,
    position_y: 12,
    position_z: 1.2,
    created_at: '2026-02-20T08:00:00Z',
    updated_at: '2026-09-20T10:00:00Z',
  },
];


// ---------------------------------------------------------------------------
// Equipment
// ---------------------------------------------------------------------------

export const mockEquipment: Equipment[] = [
  {
    id: 'eq-001',
    name: 'Main L/R',
    type: 'speaker',
    manufacturer: 'Spirit',
    model: 'PX-215',
    location: 'Main Auditorium',
    description: 'Left, center and right main speaker system.',
    duration_seconds: 0,
    sample_rate: 48000,
    channels: 2,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'eq-002',
    name: 'Sub Array',
    type: 'subwoofer',
    manufacturer: 'Tovaste',
    model: 'TVX-18B',
    location: 'Main Auditorium',
    description: 'Ground-stacked centre subwoofer array.',
    duration_seconds: 0,
    sample_rate: 48000,
    channels: 2,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'eq-003',
    name: 'FOH Mixer',
    type: 'mixer',
    manufacturer: 'Delta-F',
    model: 'LX7-24',
    location: 'FOH',
    description: 'Primary FOH console.',
    duration_seconds: 0,
    sample_rate: 48000,
    channels: 24,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'eq-004',
    name: 'Main Amp',
    type: 'amplifier',
    manufacturer: 'Infinity',
    model: 'GS-7000',
    location: 'Amplifier Rack',
    description: 'Powers main L/R tops.',
    duration_seconds: 0,
    sample_rate: 48000,
    channels: 2,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'eq-005',
    name: 'Sub Amp',
    type: 'amplifier',
    manufacturer: 'Infinity',
    model: 'GS-7000',
    location: 'Amplifier Rack',
    description: 'Bridged mode for subs.',
    duration_seconds: 0,
    sample_rate: 48000,
    channels: 2,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'eq-006',
    name: 'System Processor',
    type: 'processor',
    manufacturer: 'Spirit',
    model: 'SP-260',
    location: 'Processor Rack',
    description: 'Crossover, limiting and EQ.',
    duration_seconds: 0,
    sample_rate: 96000,
    channels: 6,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'eq-007',
    name: 'Crossover',
    type: 'crossover',
    manufacturer: 'Spirit',
    model: 'CX-24',
    location: 'Processor Rack',
    description: 'Backup two-way crossover unit.',
    duration_seconds: 0,
    sample_rate: 48000,
    channels: 2,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'eq-mic-01',
    name: 'Measurement Mic 1',
    type: 'microphone',
    manufacturer: 'Earthworks',
    model: 'M30',
    location: 'Main Auditorium',
    description: 'Calibrated RTA measurement microphone.',
    duration_seconds: 0,
    sample_rate: 48000,
    channels: 1,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'eq-mic-02',
    name: 'Measurement Mic 2',
    type: 'microphone',
    manufacturer: 'Earthworks',
    model: 'M30',
    location: 'Main Auditorium',
    description: 'Calibrated RTA measurement microphone.',
    duration_seconds: 0,
    sample_rate: 48000,
    channels: 1,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'eq-mic-03',
    name: 'Stage Mic',
    type: 'microphone',
    manufacturer: 'sE Electronics',
    model: 'RF-PRO',
    location: 'Stage',
    description: 'Stage measurement microphone.',
    duration_seconds: 0,
    sample_rate: 48000,
    channels: 1,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'eq-008',
    name: 'Stage Wedges',
    type: 'monitor',
    manufacturer: 'JBL',
    model: '12AM',
    location: 'Stage',
    description: 'Four floor wedge monitors.',
    duration_seconds: 0,
    sample_rate: 48000,
    channels: 4,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 'eq-009',
    name: 'Chapel PA',
    type: 'speaker',
    manufacturer: 'QSC',
    model: 'K12.2',
    location: 'Chapel Hall',
    description: 'Powered speakers on stands.',
    duration_seconds: 0,
    sample_rate: 48000,
    channels: 2,
    created_at: '2026-02-20T08:00:00Z',
    updated_at: '2026-09-20T10:00:00Z',
  },
  {
    id: 'eq-010',
    name: 'Chapel Mixer',
    type: 'mixer',
    manufacturer: 'Yamaha',
    model: 'TF-1',
    location: 'Chapel FOH',
    description: 'Chapel FOH console.',
    duration_seconds: 0,
    sample_rate: 48000,
    channels: 24,
    created_at: '2026-02-20T08:00:00Z',
    updated_at: '2026-09-20T10:00:00Z',
  },
];


// ---------------------------------------------------------------------------
// Signal Chain
// ---------------------------------------------------------------------------

export const mockSignalChain: SignalChain[] = [
  {
    id: 'sc-001',
    name: 'Main PA Signal Chain',
    equipment: [
      'eq-mic-01',
      'eq-003',
      'eq-006',
      'eq-004',
      'eq-001',
    ],
  },
];


// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

export const mockSessions: Session[] = [
  {
    id: 's-001',
    venueId: 'v-001',
    name: 'Sunday Service — System Tuning',
    status: 'active',
    engineerName: 'Daniel Okafor',
    startedAt: '2026-09-30T07:00:00Z',
    endedAt: null,
    measurementCount: 12,
    notes: 'Pre-service system check and tuning.',
  },
  {
    id: 's-002',
    venueId: 'v-001',
    name: 'Wednesday Rehearsal',
    status: 'completed',
    engineerName: 'Daniel Okafor',
    startedAt: '2026-09-25T18:00:00Z',
    endedAt: '2026-09-25T21:30:00Z',
    measurementCount: 8,
    notes: 'Band rehearsal — monitor adjustments.',
  },
  {
    id: 's-003',
    venueId: 'v-001',
    name: 'Subwoofer Alignment',
    status: 'completed',
    engineerName: 'Sarah Lin',
    startedAt: '2026-09-20T10:00:00Z',
    endedAt: '2026-09-20T14:00:00Z',
    measurementCount: 15,
    notes: 'Sub-to-top crossover alignment.',
  },
  {
    id: 's-004',
    venueId: 'v-002',
    name: 'Chapel PA Setup',
    status: 'completed',
    engineerName: 'Sarah Lin',
    startedAt: '2026-09-15T09:00:00Z',
    endedAt: '2026-09-15T12:00:00Z',
    measurementCount: 5,
    notes: 'Initial setup and gain structure.',
  },
  {
    id: 's-005',
    venueId: 'v-001',
    name: 'Feedback Hunt — Stage',
    status: 'archived',
    engineerName: 'Daniel Okafor',
    startedAt: '2026-09-10T16:00:00Z',
    endedAt: '2026-09-10T18:00:00Z',
    measurementCount: 6,
    notes: 'Tracking ring at 2.4 kHz.',
  },
];


// ---------------------------------------------------------------------------
// Measurements
// ---------------------------------------------------------------------------

export const mockMeasurements: Measurement[] = [
  {
    id: 'm-1001',
    session_id: 's-001',
    venue_id: 'v-001',
    zone_id: 'z-001',
    measurement_point_id: 'mp-001',
    source: 'demo',
    rms_decibels: -18.2,
    peak_decibels: -6.4,
    frequency_data: [],
    noise_level: -52.1,
    distortion_level: 0.8,
    clipping_detected: false,
    feedback_detected: false,
    duration_seconds: 30,
    sample_rate: 48000,
    channels: 1,
    created_at: '2026-09-30T07:15:00Z',
  },
  {
    id: 'm-1002',
    session_id: 's-001',
    venue_id: 'v-001',
    zone_id: 'z-001',
    measurement_point_id: 'mp-002',
    source: 'demo',
    rms_decibels: -20.1,
    peak_decibels: -8.2,
    frequency_data: [],
    noise_level: -48.5,
    distortion_level: 1.2,
    clipping_detected: false,
    feedback_detected: false,
    duration_seconds: 30,
    sample_rate: 48000,
    channels: 1,
    created_at: '2026-09-30T07:22:00Z',
  },
  {
    id: 'm-1003',
    session_id: 's-001',
    venue_id: 'v-001',
    zone_id: 'z-002',
    measurement_point_id: 'mp-003',
    source: 'demo',
    rms_decibels: -19.5,
    peak_decibels: -7.1,
    frequency_data: [],
    noise_level: -54.2,
    distortion_level: 0.6,
    clipping_detected: false,
    feedback_detected: false,
    duration_seconds: 30,
    sample_rate: 48000,
    channels: 1,
    created_at: '2026-09-30T07:30:00Z',
  },
  {
    id: 'm-1006',
    session_id: 's-001',
    venue_id: 'v-001',
    zone_id: 'z-005',
    measurement_point_id: 'mp-006',
    source: 'demo',
    rms_decibels: -12.3,
    peak_decibels: -2.1,
    frequency_data: [],
    noise_level: -41.0,
    distortion_level: 3.4,
    clipping_detected: true,
    feedback_detected: true,
    duration_seconds: 30,
    sample_rate: 48000,
    channels: 1,
    created_at: '2026-09-30T07:45:00Z',
  },
];

export const latestMeasurement =
  mockMeasurements[0] ?? null;


// ---------------------------------------------------------------------------
// Engineering Profiles
// ---------------------------------------------------------------------------

export const mockEngineeringProfiles: EngineeringProfile[] = [
  {
    id: 'ep-001',
    venueId: 'v-001',
    name: 'Standard Worship Profile',
    description:
      'Target parameters for speech intelligibility and music clarity.',
    targets: [
      {
        id: 'et-1',
        parameter: 'RMS Level',
        target: -18,
        tolerance: 3,
        unit: 'dBFS',
      },
      {
        id: 'et-2',
        parameter: 'Peak Level',
        target: -6,
        tolerance: 3,
        unit: 'dBFS',
      },
      {
        id: 'et-3',
        parameter: 'Noise Floor',
        target: -55,
        tolerance: 5,
        unit: 'dBFS',
      },
      {
        id: 'et-4',
        parameter: 'THD+N',
        target: 1,
        tolerance: 0.5,
        unit: '%',
      },
      {
        id: 'et-5',
        parameter: 'Feedback Margin',
        target: 0,
        tolerance: 0.2,
        unit: 'ratio',
      },
      {
        id: 'et-6',
        parameter: 'Sub-to-Top Level',
        target: 3,
        tolerance: 2,
        unit: 'dB',
      },
    ],
  },
];


// ---------------------------------------------------------------------------
// Engineering Results
// ---------------------------------------------------------------------------

export const mockEngineeringResults: EngineeringResult[] = [
  {
    id: 'er-1',
    sessionId: 's-001',
    profileId: 'ep-001',
    parameter: 'RMS Level',
    target: -18,
    actual: -18.2,
    tolerance: 3,
    unit: 'dBFS',
    status: 'accepted',
    finding:
      'Within tolerance. Consistent across front zone.',
    recommendation: 'No action required.',
  },
  {
    id: 'er-2',
    sessionId: 's-001',
    profileId: 'ep-001',
    parameter: 'Peak Level',
    target: -6,
    actual: -6.4,
    tolerance: 3,
    unit: 'dBFS',
    status: 'accepted',
    finding:
      'Peaks controlled. No clipping detected.',
    recommendation: 'No action required.',
  },
  {
    id: 'er-3',
    sessionId: 's-001',
    profileId: 'ep-001',
    parameter: 'Noise Floor',
    target: -55,
    actual: -48.5,
    tolerance: 5,
    unit: 'dBFS',
    status: 'needs_adjustment',
    finding:
      'Noise floor elevated in front-left position.',
    recommendation:
      'Investigate possible HVAC interference.',
  },
  {
    id: 'er-4',
    sessionId: 's-001',
    profileId: 'ep-001',
    parameter: 'THD+N',
    target: 1,
    actual: 3.4,
    tolerance: 0.5,
    unit: '%',
    status: 'rejected',
    finding:
      'Distortion exceeds tolerance at stage monitor position.',
    recommendation:
      'Reduce monitor send level and check gain structure.',
  },
  {
    id: 'er-5',
    sessionId: 's-001',
    profileId: 'ep-001',
    parameter: 'Feedback Margin',
    target: 0,
    actual: 0.8,
    tolerance: 0.2,
    unit: 'ratio',
    status: 'rejected',
    finding:
      'Feedback risk detected at 2.4 kHz.',
    recommendation:
      'Apply a narrow notch filter and re-measure.',
  },
  {
    id: 'er-6',
    sessionId: 's-001',
    profileId: 'ep-001',
    parameter: 'Sub-to-Top Level',
    target: 3,
    actual: 4.2,
    tolerance: 2,
    unit: 'dB',
    status: 'accepted',
    finding:
      'Sub level is slightly high but within tolerance.',
    recommendation:
      'Optional: reduce sub amplifier gain by 1 dB.',
  },
];


// ---------------------------------------------------------------------------
// Baselines
// ---------------------------------------------------------------------------

export const mockBaselines: Baseline[] = [
  {
    id: 'b-001',
    venueId: 'v-001',
    measurementPointId: 'mp-001',
    metrics: {
      rms: -19,
      peak: -7,
      noise: -53,
      distortion: 0.9,
      clipping: false,
      feedback: 0,
    },
    capturedAt: '2026-09-28T08:00:00Z',
    label: 'Pre-tuning baseline',
  },
  {
    id: 'b-002',
    venueId: 'v-001',
    measurementPointId: 'mp-006',
    metrics: {
      rms: -12,
      peak: -2,
      noise: -40,
      distortion: 3.5,
      clipping: true,
      feedback: 0.85,
    },
    capturedAt: '2026-09-28T08:15:00Z',
    label: 'Stage monitor — before EQ',
  },
];


// ---------------------------------------------------------------------------
// Verifications
// ---------------------------------------------------------------------------

export const mockVerifications: Verification[] = [
  {
    id: 'ver-1',
    sessionId: 's-001',
    measurementPointId: 'mp-001',
    baselineId: 'b-001',
    parameter: 'RMS Level',
    before: -19,
    after: -18.2,
    target: -18,
    unit: 'dBFS',
    status: 'accepted',
    delta: 0.8,
    note: 'Adjusted FOH master trim +0.8 dB.',
    verifiedAt: '2026-09-30T07:45:00Z',
  },
  {
    id: 'ver-2',
    sessionId: 's-001',
    measurementPointId: 'mp-001',
    baselineId: 'b-001',
    parameter: 'Noise Floor',
    before: -53,
    after: -52.1,
    target: -55,
    unit: 'dBFS',
    status: 'needs_adjustment',
    delta: 0.9,
    note: 'HVAC identified as possible source.',
    verifiedAt: '2026-09-30T07:46:00Z',
  },
  {
    id: 'ver-3',
    sessionId: 's-001',
    measurementPointId: 'mp-006',
    baselineId: 'b-002',
    parameter: 'THD+N',
    before: 3.5,
    after: 3.4,
    target: 1,
    unit: '%',
    status: 'rejected',
    delta: -0.1,
    note: 'Monitor level not yet reduced.',
    verifiedAt: '2026-09-30T07:47:00Z',
  },
  {
    id: 'ver-4',
    sessionId: 's-001',
    measurementPointId: 'mp-006',
    baselineId: 'b-002',
    parameter: 'Feedback Margin',
    before: 0.85,
    after: 0.8,
    target: 0,
    unit: 'ratio',
    status: 'rejected',
    delta: -0.05,
    note: 'Notch filter not yet applied.',
    verifiedAt: '2026-09-30T07:48:00Z',
  },
  {
    id: 'ver-5',
    sessionId: 's-002',
    measurementPointId: 'mp-003',
    baselineId: 'b-001',
    parameter: 'RMS Level',
    before: -21,
    after: -19.5,
    target: -18,
    unit: 'dBFS',
    status: 'accepted',
    delta: 1.5,
    note: 'Mid-zone level improved during rehearsal.',
    verifiedAt: '2026-09-25T20:00:00Z',
  },
];


// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------

export const mockAlerts: Alert[] = [
  {
    id: 'a-001',
    venueId: 'v-001',
    sessionId: 's-001',
    severity: 'critical',
    title: 'Clipping on Stage Monitor',
    message:
      'THD+N at 3.4% exceeds the configured threshold.',
    source: 'Measurement Engine',
    acknowledged: false,
    createdAt: '2026-09-30T07:46:00Z',
  },
  {
    id: 'a-002',
    venueId: 'v-001',
    sessionId: 's-001',
    severity: 'critical',
    title: 'Feedback Risk at 2.4 kHz',
    message:
      'Feedback margin risk detected on stage monitor path.',
    source: 'DSP Engine',
    acknowledged: false,
    createdAt: '2026-09-30T07:47:00Z',
  },
  {
    id: 'a-003',
    venueId: 'v-001',
    sessionId: 's-001',
    severity: 'warning',
    title: 'Elevated Noise Floor — FOH Left',
    message:
      'Noise floor is above the configured target.',
    source: 'Measurement Engine',
    acknowledged: false,
    createdAt: '2026-09-30T07:23:00Z',
  },
  {
    id: 'a-004',
    venueId: 'v-001',
    sessionId: null,
    severity: 'info',
    title: 'Sub-to-top alignment updated',
    message:
      'Sub crossover delay was updated during the last alignment session.',
    source: 'Engineering',
    acknowledged: true,
    createdAt: '2026-09-20T14:00:00Z',
  },
];


// ---------------------------------------------------------------------------
// Smart Suggestions
// ---------------------------------------------------------------------------

export const mockSmartSuggestions: SmartSuggestion[] = [
  {
    id: 'ss-1',
    title: 'Reduce Stage Monitor Level',
    description:
      'THD+N on the stage monitor path is elevated and clipping is active.',
    action:
      'Lower monitor send by 3 dB, then re-measure.',
    priority: 'high',
    category: 'safety',
  },
  {
    id: 'ss-2',
    title: 'Apply 2.4 kHz Notch Filter',
    description:
      'Feedback risk was detected around 2.4 kHz.',
    action:
      'Insert a narrow notch around 2.4 kHz and re-measure.',
    priority: 'high',
    category: 'feedback',
  },
  {
    id: 'ss-3',
    title: 'Investigate HVAC Interference',
    description:
      'The FOH Left noise floor is above target.',
    action:
      'Measure with HVAC off or relocate the microphone.',
    priority: 'medium',
    category: 'level',
  },
  {
    id: 'ss-4',
    title: 'Rebalance Sub Level',
    description:
      'Sub-to-top level is slightly above the target.',
    action:
      'Reduce sub amplifier gain by approximately 1 dB.',
    priority: 'low',
    category: 'level',
  },
];


// ---------------------------------------------------------------------------
// System Health
// ---------------------------------------------------------------------------

export const mockSystemHealth: SystemHealth = {
  apiConnected: false,
  dspEngineOnline: true,
  lastSync: '2026-09-30T07:50:00Z',
  activeChannels: 6,
  sampleRate: 48000,
  latencyMs: 12,
};


// ---------------------------------------------------------------------------
// Visualization Helpers
// ---------------------------------------------------------------------------

function generateWaveform(
  samples = 80,
  amplitude = 0.7,
): number[] {
  const output: number[] = [];

  for (let index = 0; index < samples; index += 1) {
    const time = index / samples;

    const value =
      amplitude *
        Math.sin(time * Math.PI * 8) *
        (0.5 + 0.5 * Math.random()) +
      (Math.random() - 0.5) * 0.15;

    output.push(
      Math.max(-1, Math.min(1, value)),
    );
  }

  return output;
}

function generateSpectrum(
  bins = 32,
): { freq: number; magnitude: number }[] {
  const output: {
    freq: number;
    magnitude: number;
  }[] = [];

  for (let index = 0; index < bins; index += 1) {
    const frequency =
      20 * Math.pow(1000, index / bins);

    const logFrequency =
      Math.log10(frequency);

    let magnitude = 0.65;

    magnitude +=
      0.2 *
      Math.exp(
        -Math.pow(
          (logFrequency - 1.9) / 0.3,
          2,
        ),
      );

    magnitude -=
      0.15 *
      Math.exp(
        -Math.pow(
          (logFrequency - 2.6) / 0.4,
          2,
        ),
      );

    magnitude -=
      0.5 *
      Math.exp(
        -Math.pow(
          (logFrequency - 4.2) / 0.5,
          2,
        ),
      );

    magnitude +=
      (Math.random() - 0.5) * 0.1;

    output.push({
      freq: frequency,
      magnitude: Math.max(
        0.05,
        Math.min(1, magnitude),
      ),
    });
  }

  return output;
}


// These helpers remain available for visualization components
// that explicitly request demo visualization data.
export function generateLiveWaveform(
  samples = 60,
): number[] {
  return generateWaveform(
    samples,
    0.4 + Math.random() * 0.4,
  );
}

export function generateLiveSpectrum(
  bins = 24,
): { freq: number; magnitude: number }[] {
  return generateSpectrum(bins);
}