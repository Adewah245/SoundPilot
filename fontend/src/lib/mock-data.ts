// Mock data for SoundPilot frontend development.
// Clearly labeled as demo data. When the Go API is available,
// the API service layer will switch to live data automatically.

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
      'Primary worship auditorium with a full-range PA system and dedicated mixing position at FOH.',
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
      'Intimate chapel space with a compact PA and dual monitor wedges.',
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
  { id: 'eq-001', venueId: 'v-001', name: 'Main L/R', type: 'speaker', brand: 'Spirit', model: 'PX-215', quantity: 3, status: 'active', specs: { power: '800W RMS', freqRange: '50Hz–18kHz', impedance: '8Ω' }, notes: 'Left, center, right main hangs' },
  { id: 'eq-002', venueId: 'v-001', name: 'Sub Array', type: 'subwoofer', brand: 'Tovaste', model: 'TVX-18B', quantity: 2, status: 'active', specs: { power: '1000W RMS', freqRange: '35Hz–150Hz', impedance: '8Ω' }, notes: 'Ground-stacked centre sub' },
  { id: 'eq-003', venueId: 'v-001', name: 'FOH Mixer', type: 'mixer', brand: 'Delta-F', model: 'LX7-24', quantity: 1, status: 'active', specs: { channels: '24 input', outputs: '8 mix', type: 'Digital' }, notes: 'Primary FOH console' },
  { id: 'eq-004', venueId: 'v-001', name: 'Main Amp', type: 'amplifier', brand: 'Infinity', model: 'GS-7000', quantity: 1, status: 'active', specs: { power: '2×3500W', channels: '2', impedance: '4Ω/8Ω' }, notes: 'Powers main L/R tops' },
  { id: 'eq-005', venueId: 'v-001', name: 'Sub Amp', type: 'amplifier', brand: 'Infinity', model: 'GS-7000', quantity: 1, status: 'active', specs: { power: '2×3500W', channels: '2', impedance: '4Ω/8Ω' }, notes: 'Bridged mode for subs' },
  { id: 'eq-006', venueId: 'v-001', name: 'System Processor', type: 'processor', brand: 'Spirit', model: 'SP-260', quantity: 1, status: 'active', specs: { inputs: '2', outputs: '6', dsp: '96kHz' }, notes: 'Crossover, limiting, EQ' },
  { id: 'eq-007', venueId: 'v-001', name: 'Crossover', type: 'crossover', brand: 'Spirit', model: 'CX-24', quantity: 1, status: 'standby', specs: { bands: '2-way', slope: '24dB/oct' }, notes: 'Backup crossover unit' },
  { id: 'eq-mic-01', venueId: 'v-001', name: 'Measurement Mic 1', type: 'microphone', brand: 'Earthworks', model: 'M30', quantity: 1, status: 'active', specs: { pattern: 'Omni', freqRange: '9Hz–30kHz' }, notes: 'Calibrated RTA mic' },
  { id: 'eq-mic-02', venueId: 'v-001', name: 'Measurement Mic 2', type: 'microphone', brand: 'Earthworks', model: 'M30', quantity: 1, status: 'active', specs: { pattern: 'Omni', freqRange: '9Hz–30kHz' }, notes: 'Calibrated RTA mic' },
  { id: 'eq-mic-03', venueId: 'v-001', name: 'Stage Mic', type: 'microphone', brand: 'sE Electronics', model: 'RF-PRO', quantity: 1, status: 'active', specs: { pattern: 'Cardioid', freqRange: '20Hz–20kHz' }, notes: 'Stage measurement' },
  { id: 'eq-008', venueId: 'v-001', name: 'Stage Wedges', type: 'monitor', brand: 'JBL', model: '12AM', quantity: 4, status: 'active', specs: { power: '500W RMS', angle: '45° wedge' }, notes: 'Four floor wedge monitors' },
  { id: 'eq-009', venueId: 'v-002', name: 'Chapel PA', type: 'speaker', brand: 'QSC', model: 'K12.2', quantity: 2, status: 'active', specs: { power: '2000W peak', freqRange: '50Hz–20kHz' }, notes: 'Powered speakers on stands' },
  { id: 'eq-010', venueId: 'v-002', name: 'Chapel Mixer', type: 'mixer', brand: 'Yamaha', model: 'TF-1', quantity: 1, status: 'active', specs: { channels: '24', type: 'Digital' }, notes: 'Chapel FOH console' },
];

export const mockSignalChain: SignalChain[] = [
  {
    id: 'sc-001',
    venueId: 'v-001',
    name: 'Main PA Signal Chain',
    nodes: [
      { id: 'scn-1', equipmentId: 'eq-mic-01', label: 'Microphone', type: 'microphone', order: 1 },
      { id: 'scn-2', equipmentId: 'eq-003', label: 'Mixer', type: 'mixer', order: 2 },
      { id: 'scn-3', equipmentId: 'eq-006', label: 'Processor', type: 'processor', order: 3 },
      { id: 'scn-4', equipmentId: 'eq-004', label: 'Amplifier', type: 'amplifier', order: 4 },
      { id: 'scn-5', equipmentId: 'eq-001', label: 'Speaker', type: 'speaker', order: 5 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

export const mockSessions: Session[] = [
  { id: 's-001', venueId: 'v-001', name: 'Sunday Service — System Tuning', status: 'active', engineerName: 'Daniel Okafor', startedAt: '2026-09-30T07:00:00Z', endedAt: null, measurementCount: 12, notes: 'Pre-service system check and tuning' },
  { id: 's-002', venueId: 'v-001', name: 'Wednesday Rehearsal', status: 'completed', engineerName: 'Daniel Okafor', startedAt: '2026-09-25T18:00:00Z', endedAt: '2026-09-25T21:30:00Z', measurementCount: 8, notes: 'Band rehearsal — monitor adjustments' },
  { id: 's-003', venueId: 'v-001', name: 'Subwoofer Alignment', status: 'completed', engineerName: 'Sarah Lin', startedAt: '2026-09-20T10:00:00Z', endedAt: '2026-09-20T14:00:00Z', measurementCount: 15, notes: 'Sub-to-top crossover alignment' },
  { id: 's-004', venueId: 'v-002', name: 'Chapel PA Setup', status: 'completed', engineerName: 'Sarah Lin', startedAt: '2026-09-15T09:00:00Z', endedAt: '2026-09-15T12:00:00Z', measurementCount: 5, notes: 'Initial setup and gain structure' },
  { id: 's-005', venueId: 'v-001', name: 'Feedback Hunt — Stage', status: 'archived', engineerName: 'Daniel Okafor', startedAt: '2026-09-10T16:00:00Z', endedAt: '2026-09-10T18:00:00Z', measurementCount: 6, notes: 'Tracking ring at 2.4kHz' },
];

// ---------------------------------------------------------------------------
// Measurements
// ---------------------------------------------------------------------------

function generateWaveform(samples = 80, amplitude = 0.7): number[] {
  const out: number[] = [];
  for (let i = 0; i < samples; i++) {
    const t = i / samples;
    const val =
      amplitude * Math.sin(t * Math.PI * 8) * (0.5 + 0.5 * Math.random()) +
      (Math.random() - 0.5) * 0.15;
    out.push(Math.max(-1, Math.min(1, val)));
  }
  return out;
}

function generateSpectrum(bins = 32): { freq: number; magnitude: number }[] {
  const out: { freq: number; magnitude: number }[] = [];
  for (let i = 0; i < bins; i++) {
    const freq = 20 * Math.pow(1000, i / bins);
    // Simulate a typical full-range speaker response: dip in low-mids, bump around 80Hz, rolloff above 12k
    const logFreq = Math.log10(freq);
    let mag = 0.65;
    mag += 0.2 * Math.exp(-Math.pow((logFreq - 1.9) / 0.3, 2));
    mag -= 0.15 * Math.exp(-Math.pow((logFreq - 2.6) / 0.4, 2));
    mag -= 0.5 * Math.exp(-Math.pow((logFreq - 4.2) / 0.5, 2));
    mag += (Math.random() - 0.5) * 0.1;
    out.push({ freq, magnitude: Math.max(0.05, Math.min(1, mag)) });
  }
  return out;
}

export const mockMeasurements: Measurement[] = [
  {
    id: 'm-1001', sessionId: 's-001', measurementPointId: 'mp-001', status: 'saved',
    timestamp: '2026-09-30T07:15:00Z', durationSec: 30,
    metrics: { rms: -18.2, peak: -6.4, noise: -52.1, distortion: 0.8, clipping: false, feedback: 0 },
    waveform: generateWaveform(80, 0.7), spectrum: generateSpectrum(32),
  },
  {
    id: 'm-1002', sessionId: 's-001', measurementPointId: 'mp-002', status: 'saved',
    timestamp: '2026-09-30T07:22:00Z', durationSec: 30,
    metrics: { rms: -20.1, peak: -8.2, noise: -48.5, distortion: 1.2, clipping: false, feedback: 0.2 },
    waveform: generateWaveform(80, 0.6), spectrum: generateSpectrum(32),
  },
  {
    id: 'm-1003', sessionId: 's-001', measurementPointId: 'mp-003', status: 'saved',
    timestamp: '2026-09-30T07:30:00Z', durationSec: 30,
    metrics: { rms: -19.5, peak: -7.1, noise: -54.2, distortion: 0.6, clipping: false, feedback: 0 },
    waveform: generateWaveform(80, 0.68), spectrum: generateSpectrum(32),
  },
  {
    id: 'm-1006', sessionId: 's-001', measurementPointId: 'mp-006', status: 'saved',
    timestamp: '2026-09-30T07:45:00Z', durationSec: 30,
    metrics: { rms: -12.3, peak: -2.1, noise: -41.0, distortion: 3.4, clipping: true, feedback: 0.8 },
    waveform: generateWaveform(80, 0.95), spectrum: generateSpectrum(32),
  },
];

export const latestMeasurement = mockMeasurements[0];

// ---------------------------------------------------------------------------
// Engineering
// ---------------------------------------------------------------------------

export const mockEngineeringProfiles: EngineeringProfile[] = [
  {
    id: 'ep-001',
    venueId: 'v-001',
    name: 'Standard Worship Profile',
    description: 'Target parameters for speech intelligibility and music clarity at 95 dB SPL',
    targets: [
      { id: 'et-1', parameter: 'RMS Level', target: -18, tolerance: 3, unit: 'dBFS' },
      { id: 'et-2', parameter: 'Peak Level', target: -6, tolerance: 3, unit: 'dBFS' },
      { id: 'et-3', parameter: 'Noise Floor', target: -55, tolerance: 5, unit: 'dBFS' },
      { id: 'et-4', parameter: 'THD+N', target: 1.0, tolerance: 0.5, unit: '%' },
      { id: 'et-5', parameter: 'Feedback Margin', target: 0, tolerance: 0.2, unit: 'ratio' },
      { id: 'et-6', parameter: 'Sub-to-Top Level', target: 3, tolerance: 2, unit: 'dB' },
    ],
  },
];

export const mockEngineeringResults: EngineeringResult[] = [
  { id: 'er-1', sessionId: 's-001', profileId: 'ep-001', parameter: 'RMS Level', target: -18, actual: -18.2, tolerance: 3, unit: 'dBFS', status: 'accepted', finding: 'Within tolerance. Consistent across front zone.', recommendation: 'No action required.' },
  { id: 'er-2', sessionId: 's-001', profileId: 'ep-001', parameter: 'Peak Level', target: -6, actual: -6.4, tolerance: 3, unit: 'dBFS', status: 'accepted', finding: 'Peaks controlled. No clipping detected in front or middle zones.', recommendation: 'No action required.' },
  { id: 'er-3', sessionId: 's-001', profileId: 'ep-001', parameter: 'Noise Floor', target: -55, actual: -48.5, tolerance: 5, unit: 'dBFS', status: 'needs_adjustment', finding: 'Noise floor elevated in front-left position. Likely HVAC interference.', recommendation: 'Investigate air handling unit near measurement position. Consider relocating mic or scheduling measurement during HVAC-off windows.' },
  { id: 'er-4', sessionId: 's-001', profileId: 'ep-001', parameter: 'THD+N', target: 1.0, actual: 3.4, tolerance: 0.5, unit: '%', status: 'rejected', finding: 'Distortion exceeds tolerance at stage monitor position. Clipping detected on measurement.', recommendation: 'Reduce monitor send level by 3 dB. Check amplifier gain structure and limiter thresholds. Re-measure after adjustment.' },
  { id: 'er-5', sessionId: 's-001', profileId: 'ep-001', parameter: 'Feedback Margin', target: 0, actual: 0.8, tolerance: 0.2, unit: 'ratio', status: 'rejected', finding: 'Feedback risk detected at 2.4 kHz on stage monitor path.', recommendation: 'Apply 2.4 kHz notch filter (-3 dB, Q=5) on monitor EQ. Reduce stage monitor level by 2 dB. Re-measure.' },
  { id: 'er-6', sessionId: 's-001', profileId: 'ep-001', parameter: 'Sub-to-Top Level', target: 3, actual: 4.2, tolerance: 2, unit: 'dB', status: 'accepted', finding: 'Sub level slightly high but within tolerance.', recommendation: 'Optional: reduce sub amp by 1 dB for flatter response.' },
];

// ---------------------------------------------------------------------------
// Baselines & Verifications
// ---------------------------------------------------------------------------

export const mockBaselines: Baseline[] = [
  { id: 'b-001', venueId: 'v-001', measurementPointId: 'mp-001', metrics: { rms: -19.0, peak: -7.0, noise: -53.0, distortion: 0.9, clipping: false, feedback: 0 }, capturedAt: '2026-09-28T08:00:00Z', label: 'Pre-tuning baseline' },
  { id: 'b-002', venueId: 'v-001', measurementPointId: 'mp-006', metrics: { rms: -12.0, peak: -2.0, noise: -40.0, distortion: 3.5, clipping: true, feedback: 0.85 }, capturedAt: '2026-09-28T08:15:00Z', label: 'Stage monitor — before EQ' },
];

export const mockVerifications: Verification[] = [
  { id: 'ver-1', sessionId: 's-001', measurementPointId: 'mp-001', baselineId: 'b-001', parameter: 'RMS Level', before: -19.0, after: -18.2, target: -18, unit: 'dBFS', status: 'accepted', delta: 0.8, note: 'Adjusted FOH master trim +0.8 dB.', verifiedAt: '2026-09-30T07:45:00Z' },
  { id: 'ver-2', sessionId: 's-001', measurementPointId: 'mp-001', baselineId: 'b-001', parameter: 'Noise Floor', before: -53.0, after: -52.1, target: -55, unit: 'dBFS', status: 'needs_adjustment', delta: 0.9, note: 'Slight improvement but still above target. HVAC identified as source.', verifiedAt: '2026-09-30T07:46:00Z' },
  { id: 'ver-3', sessionId: 's-001', measurementPointId: 'mp-006', baselineId: 'b-002', parameter: 'THD+N', before: 3.5, after: 3.4, target: 1.0, unit: '%', status: 'rejected', delta: -0.1, note: 'Monitor level not yet reduced. Pending adjustment.', verifiedAt: '2026-09-30T07:47:00Z' },
  { id: 'ver-4', sessionId: 's-001', measurementPointId: 'mp-006', baselineId: 'b-002', parameter: 'Feedback Margin', before: 0.85, after: 0.8, target: 0, unit: 'ratio', status: 'rejected', delta: -0.05, note: 'Notch filter not yet applied. Pending adjustment.', verifiedAt: '2026-09-30T07:48:00Z' },
  { id: 'ver-5', sessionId: 's-002', measurementPointId: 'mp-003', baselineId: 'b-001', parameter: 'RMS Level', before: -21.0, after: -19.5, target: -18, unit: 'dBFS', status: 'accepted', delta: 1.5, note: 'Mid-zone level brought closer to target during rehearsal.', verifiedAt: '2026-09-25T20:00:00Z' },
];

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------

export const mockAlerts: Alert[] = [
  { id: 'a-001', venueId: 'v-001', sessionId: 's-001', severity: 'critical', title: 'Clipping on Stage Monitor', message: 'THD+N at 3.4% exceeds 1.5% threshold on stage monitor measurement point.', source: 'Measurement Engine', acknowledged: false, createdAt: '2026-09-30T07:46:00Z' },
  { id: 'a-002', venueId: 'v-001', sessionId: 's-001', severity: 'critical', title: 'Feedback Risk at 2.4 kHz', message: 'Feedback margin ratio 0.8 detected on stage monitor path.', source: 'DSP Engine', acknowledged: false, createdAt: '2026-09-30T07:47:00Z' },
  { id: 'a-003', venueId: 'v-001', sessionId: 's-001', severity: 'warning', title: 'Elevated Noise Floor — FOH Left', message: 'Noise floor at -48.5 dBFS exceeds -55 dBFS target. Possible HVAC interference.', source: 'Measurement Engine', acknowledged: false, createdAt: '2026-09-30T07:23:00Z' },
  { id: 'a-004', venueId: 'v-001', sessionId: null, severity: 'info', title: 'Sub-to-top alignment updated', message: 'Sub crossover delay set to 4.2 ms based on last alignment session.', source: 'Engineering', acknowledged: true, createdAt: '2026-09-20T14:00:00Z' },
];

// ---------------------------------------------------------------------------
// Smart Suggestions
// ---------------------------------------------------------------------------

export const mockSmartSuggestions: SmartSuggestion[] = [
  { id: 'ss-1', title: 'Reduce Stage Monitor Level', description: 'THD+N on the stage monitor path is at 3.4% (target 1.0%). Clipping is active. Reducing the monitor send by 3 dB should bring peaks below the limiter threshold.', action: 'Lower monitor send by 3 dB, then re-measure', priority: 'high', category: 'safety' },
  { id: 'ss-2', title: 'Apply 2.4 kHz Notch Filter', description: 'Feedback margin ratio of 0.8 was detected at 2.4 kHz on the stage monitor path. A narrow notch filter will reduce the ring risk without affecting vocal clarity.', action: 'Insert -3 dB notch at 2.4 kHz (Q=5) on monitor EQ', priority: 'high', category: 'feedback' },
  { id: 'ss-3', title: 'Investigate HVAC Interference', description: 'Noise floor at FOH Left is -48.5 dBFS, 3.5 dB above target. The pattern is consistent with HVAC airflow noise near the measurement position.', action: 'Schedule a measurement with HVAC off, or relocate mic 1m from vent', priority: 'medium', category: 'level' },
  { id: 'ss-4', title: 'Rebalance Sub Level', description: 'Sub-to-top level difference is 4.2 dB (target 3 dB). A 1 dB reduction on the sub amp will flatten the low-frequency response.', action: 'Reduce sub amplifier gain by 1 dB', priority: 'low', category: 'level' },
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

// Helper: generate a live-looking waveform for visualizations
export function generateLiveWaveform(samples = 60): number[] {
  return generateWaveform(samples, 0.4 + Math.random() * 0.4);
}

export function generateLiveSpectrum(bins = 24): { freq: number; magnitude: number }[] {
  return generateSpectrum(bins);
}
