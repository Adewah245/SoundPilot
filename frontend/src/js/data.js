// =========================================================================
// SoundPilot — Mock Data
// Demo data for frontend development. When the Go API is available,
// the app will switch to live data. Clearly labeled as demo.
// =========================================================================
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

export const VENUES = [
  {
    id: 'v-001',
    name: 'Main Auditorium',
    type: 'church',
    address: '123 Faith Avenue, Springfield',
    capacity: 1200,
    description: 'Primary worship auditorium with a full-range PA system and dedicated mixing position at FOH.',
  },
  {
    id: 'v-002',
    name: 'Chapel Hall',
    type: 'church',
    address: '123 Faith Avenue, Springfield',
    capacity: 250,
    description: 'Intimate chapel space with a compact PA and dual monitor wedges.',
  },
];

export const ZONES = [
  { id: 'z-001', venueId: 'v-001', name: 'Front', description: 'Front-of-house seating area, rows 1-8', order: 1, pointIds: ['mp-001', 'mp-002'] },
  { id: 'z-002', venueId: 'v-001', name: 'Middle', description: 'Centre seating, rows 9-18', order: 2, pointIds: ['mp-003'] },
  { id: 'z-003', venueId: 'v-001', name: 'Rear', description: 'Balcony and back-of-house area', order: 3, pointIds: ['mp-004'] },
  { id: 'z-004', venueId: 'v-001', name: 'Altar', description: 'Platform / altar area', order: 4, pointIds: ['mp-005'] },
  { id: 'z-005', venueId: 'v-001', name: 'Stage', description: 'Performance stage monitor position', order: 5, pointIds: ['mp-006'] },
  { id: 'z-006', venueId: 'v-001', name: 'Monitors', description: 'Dedicated monitor mixing zone', order: 6, pointIds: ['mp-007'] },
  { id: 'z-007', venueId: 'v-002', name: 'Main Floor', description: 'Single-floor seating area', order: 1, pointIds: ['mp-008'] },
];

export const MEASUREMENT_POINTS = [
  { id: 'mp-001', zoneId: 'z-001', name: 'FOH Center', location: 'Row 3, Center aisle', status: 'optimal' },
  { id: 'mp-002', zoneId: 'z-001', name: 'FOH Left', location: 'Row 5, Left aisle', status: 'warning' },
  { id: 'mp-003', zoneId: 'z-002', name: 'Mid Center', location: 'Row 14, Center aisle', status: 'optimal' },
  { id: 'mp-004', zoneId: 'z-003', name: 'Balcony Rear', location: 'Balcony row 2, center', status: 'warning' },
  { id: 'mp-005', zoneId: 'z-004', name: 'Altar Center', location: 'Platform center', status: 'optimal' },
  { id: 'mp-006', zoneId: 'z-005', name: 'Stage Monitor', location: 'Downstage center', status: 'critical' },
  { id: 'mp-007', zoneId: 'z-006', name: 'Monitor World', location: 'Monitor mixing position', status: 'idle' },
  { id: 'mp-008', zoneId: 'z-007', name: 'Chapel Center', location: 'Row 5, center', status: 'idle' },
];

export const EQUIPMENT = [
  { id: 'eq-001', venueId: 'v-001', name: 'Main L/R', type: 'speaker', brand: 'Spirit', model: 'PX-215', quantity: 3, status: 'active', specs: { power: '800W RMS', freqRange: '50Hz-18kHz', impedance: '8ohm' }, notes: 'Left, center, right main hangs' },
  { id: 'eq-002', venueId: 'v-001', name: 'Sub Array', type: 'subwoofer', brand: 'Tovaste', model: 'TVX-18B', quantity: 2, status: 'active', specs: { power: '1000W RMS', freqRange: '35Hz-150Hz', impedance: '8ohm' }, notes: 'Ground-stacked centre sub' },
  { id: 'eq-003', venueId: 'v-001', name: 'FOH Mixer', type: 'mixer', brand: 'Delta-F', model: 'LX7-24', quantity: 1, status: 'active', specs: { channels: '24 input', outputs: '8 mix', type: 'Digital' }, notes: 'Primary FOH console' },
  { id: 'eq-004', venueId: 'v-001', name: 'Main Amp', type: 'amplifier', brand: 'Infinity', model: 'GS-7000', quantity: 1, status: 'active', specs: { power: '2x3500W', channels: '2', impedance: '4/8ohm' }, notes: 'Powers main L/R tops' },
  { id: 'eq-005', venueId: 'v-001', name: 'Sub Amp', type: 'amplifier', brand: 'Infinity', model: 'GS-7000', quantity: 1, status: 'active', specs: { power: '2x3500W', channels: '2', impedance: '4/8ohm' }, notes: 'Bridged mode for subs' },
  { id: 'eq-006', venueId: 'v-001', name: 'System Processor', type: 'processor', brand: 'Spirit', model: 'SP-260', quantity: 1, status: 'active', specs: { inputs: '2', outputs: '6', dsp: '96kHz' }, notes: 'Crossover, limiting, EQ' },
  { id: 'eq-007', venueId: 'v-001', name: 'Crossover', type: 'crossover', brand: 'Spirit', model: 'CX-24', quantity: 1, status: 'standby', specs: { bands: '2-way', slope: '24dB/oct' }, notes: 'Backup crossover unit' },
  { id: 'eq-mic-01', venueId: 'v-001', name: 'Measurement Mic 1', type: 'microphone', brand: 'Earthworks', model: 'M30', quantity: 1, status: 'active', specs: { pattern: 'Omni', freqRange: '9Hz-30kHz' }, notes: 'Calibrated RTA mic' },
  { id: 'eq-mic-02', venueId: 'v-001', name: 'Measurement Mic 2', type: 'microphone', brand: 'Earthworks', model: 'M30', quantity: 1, status: 'active', specs: { pattern: 'Omni', freqRange: '9Hz-30kHz' }, notes: 'Calibrated RTA mic' },
  { id: 'eq-008', venueId: 'v-001', name: 'Stage Wedges', type: 'monitor', brand: 'JBL', model: '12AM', quantity: 4, status: 'active', specs: { power: '500W RMS', angle: '45deg wedge' }, notes: 'Four floor wedge monitors' },
  { id: 'eq-009', venueId: 'v-002', name: 'Chapel PA', type: 'speaker', brand: 'QSC', model: 'K12.2', quantity: 2, status: 'active', specs: { power: '2000W peak', freqRange: '50Hz-20kHz' }, notes: 'Powered speakers on stands' },
  { id: 'eq-010', venueId: 'v-002', name: 'Chapel Mixer', type: 'mixer', brand: 'Yamaha', model: 'TF-1', quantity: 1, status: 'active', specs: { channels: '24', type: 'Digital' }, notes: 'Chapel FOH console' },
];

export const SIGNAL_CHAIN = [
  { id: 'sc-001', venueId: 'v-001', name: 'Main PA Signal Chain', nodes: [
    { id: 'scn-1', equipmentId: 'eq-mic-01', label: 'Microphone', type: 'microphone', order: 1 },
    { id: 'scn-2', equipmentId: 'eq-003', label: 'Mixer', type: 'mixer', order: 2 },
    { id: 'scn-3', equipmentId: 'eq-006', label: 'Processor', type: 'processor', order: 3 },
    { id: 'scn-4', equipmentId: 'eq-004', label: 'Amplifier', type: 'amplifier', order: 4 },
    { id: 'scn-5', equipmentId: 'eq-001', label: 'Speaker', type: 'speaker', order: 5 },
  ]},
];

export const SESSIONS = [
  { id: 's-001', venueId: 'v-001', name: 'Sunday Service - System Tuning', status: 'active', engineerName: 'Daniel Okafor', startedAt: '2026-09-30T07:00:00Z', endedAt: null, measurementCount: 12, notes: 'Pre-service system check and tuning' },
  { id: 's-002', venueId: 'v-001', name: 'Wednesday Rehearsal', status: 'completed', engineerName: 'Daniel Okafor', startedAt: '2026-09-25T18:00:00Z', endedAt: '2026-09-25T21:30:00Z', measurementCount: 8, notes: 'Band rehearsal - monitor adjustments' },
  { id: 's-003', venueId: 'v-001', name: 'Subwoofer Alignment', status: 'completed', engineerName: 'Sarah Lin', startedAt: '2026-09-20T10:00:00Z', endedAt: '2026-09-20T14:00:00Z', measurementCount: 15, notes: 'Sub-to-top crossover alignment' },
  { id: 's-004', venueId: 'v-002', name: 'Chapel PA Setup', status: 'completed', engineerName: 'Sarah Lin', startedAt: '2026-09-15T09:00:00Z', endedAt: '2026-09-15T12:00:00Z', measurementCount: 5, notes: 'Initial setup and gain structure' },
  { id: 's-005', venueId: 'v-001', name: 'Feedback Hunt - Stage', status: 'archived', engineerName: 'Daniel Okafor', startedAt: '2026-09-10T16:00:00Z', endedAt: '2026-09-10T18:00:00Z', measurementCount: 6, notes: 'Tracking ring at 2.4kHz' },
];

export const LATEST_MEASUREMENT = {
  id: 'm-1001',
  pointId: 'mp-001',
  timestamp: '2026-09-30T07:15:00Z',
  metrics: { rms: -18.2, peak: -6.4, noise: -52.1, distortion: 0.8, clipping: false, feedback: 0 },
  waveform: generateWaveform(80, 0.7),
  spectrum: generateSpectrum(28),
};

export const ENGINEERING_PROFILES = [
  {
    id: 'ep-001', venueId: 'v-001', name: 'Standard Worship Profile',
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

export const ENGINEERING_RESULTS = [
  { id: 'er-1', parameter: 'RMS Level', target: -18, actual: -18.2, tolerance: 3, unit: 'dBFS', status: 'accepted', finding: 'Within tolerance. Consistent across front zone.', recommendation: 'No action required.' },
  { id: 'er-2', parameter: 'Peak Level', target: -6, actual: -6.4, tolerance: 3, unit: 'dBFS', status: 'accepted', finding: 'Peaks controlled. No clipping detected in front or middle zones.', recommendation: 'No action required.' },
  { id: 'er-3', parameter: 'Noise Floor', target: -55, actual: -48.5, tolerance: 5, unit: 'dBFS', status: 'needs_adjustment', finding: 'Noise floor elevated in front-left position. Likely HVAC interference.', recommendation: 'Investigate air handling unit near measurement position. Consider relocating mic or scheduling measurement during HVAC-off windows.' },
  { id: 'er-4', parameter: 'THD+N', target: 1.0, actual: 3.4, tolerance: 0.5, unit: '%', status: 'rejected', finding: 'Distortion exceeds tolerance at stage monitor position. Clipping detected on measurement.', recommendation: 'Reduce monitor send level by 3 dB. Check amplifier gain structure and limiter thresholds. Re-measure after adjustment.' },
  { id: 'er-5', parameter: 'Feedback Margin', target: 0, actual: 0.8, tolerance: 0.2, unit: 'ratio', status: 'rejected', finding: 'Feedback risk detected at 2.4 kHz on stage monitor path.', recommendation: 'Apply 2.4 kHz notch filter (-3 dB, Q=5) on monitor EQ. Reduce stage monitor level by 2 dB. Re-measure.' },
  { id: 'er-6', parameter: 'Sub-to-Top Level', target: 3, actual: 4.2, tolerance: 2, unit: 'dB', status: 'accepted', finding: 'Sub level slightly high but within tolerance.', recommendation: 'Optional: reduce sub amp by 1 dB for flatter response.' },
];

export const VERIFICATIONS = [
  { id: 'ver-1', pointId: 'mp-001', parameter: 'RMS Level', before: -19.0, after: -18.2, target: -18, unit: 'dBFS', status: 'accepted', delta: 0.8, note: 'Adjusted FOH master trim +0.8 dB.' },
  { id: 'ver-2', pointId: 'mp-001', parameter: 'Noise Floor', before: -53.0, after: -52.1, target: -55, unit: 'dBFS', status: 'needs_adjustment', delta: 0.9, note: 'Slight improvement but still above target. HVAC identified as source.' },
  { id: 'ver-3', pointId: 'mp-006', parameter: 'THD+N', before: 3.5, after: 3.4, target: 1.0, unit: '%', status: 'rejected', delta: -0.1, note: 'Monitor level not yet reduced. Pending adjustment.' },
  { id: 'ver-4', pointId: 'mp-006', parameter: 'Feedback Margin', before: 0.85, after: 0.8, target: 0, unit: 'ratio', status: 'rejected', delta: -0.05, note: 'Notch filter not yet applied. Pending adjustment.' },
  { id: 'ver-5', pointId: 'mp-003', parameter: 'RMS Level', before: -21.0, after: -19.5, target: -18, unit: 'dBFS', status: 'accepted', delta: 1.5, note: 'Mid-zone level brought closer to target during rehearsal.' },
];

export const ALERTS = [
  { id: 'a-001', venueId: 'v-001', severity: 'critical', title: 'Clipping on Stage Monitor', message: 'THD+N at 3.4% exceeds 1.5% threshold on stage monitor measurement point.', source: 'Measurement Engine', acknowledged: false, createdAt: '2026-09-30T07:46:00Z' },
  { id: 'a-002', venueId: 'v-001', severity: 'critical', title: 'Feedback Risk at 2.4 kHz', message: 'Feedback margin ratio 0.8 detected on stage monitor path.', source: 'DSP Engine', acknowledged: false, createdAt: '2026-09-30T07:47:00Z' },
  { id: 'a-003', venueId: 'v-001', severity: 'warning', title: 'Elevated Noise Floor - FOH Left', message: 'Noise floor at -48.5 dBFS exceeds -55 dBFS target. Possible HVAC interference.', source: 'Measurement Engine', acknowledged: false, createdAt: '2026-09-30T07:23:00Z' },
  { id: 'a-004', venueId: 'v-001', severity: 'info', title: 'Sub-to-top alignment updated', message: 'Sub crossover delay set to 4.2 ms based on last alignment session.', source: 'Engineering', acknowledged: true, createdAt: '2026-09-20T14:00:00Z' },
];

export const SMART_SUGGESTIONS = [
  { id: 'ss-1', title: 'Reduce Stage Monitor Level', description: 'THD+N on the stage monitor path is at 3.4% (target 1.0%). Clipping is active. Reducing the monitor send by 3 dB should bring peaks below the limiter threshold.', action: 'Lower monitor send by 3 dB, then re-measure', priority: 'high', category: 'safety' },
  { id: 'ss-2', title: 'Apply 2.4 kHz Notch Filter', description: 'Feedback margin ratio of 0.8 was detected at 2.4 kHz on the stage monitor path. A narrow notch filter will reduce the ring risk without affecting vocal clarity.', action: 'Insert -3 dB notch at 2.4 kHz (Q=5) on monitor EQ', priority: 'high', category: 'feedback' },
  { id: 'ss-3', title: 'Investigate HVAC Interference', description: 'Noise floor at FOH Left is -48.5 dBFS, 3.5 dB above target. The pattern is consistent with HVAC airflow noise near the measurement position.', action: 'Schedule a measurement with HVAC off, or relocate mic 1m from vent', priority: 'medium', category: 'level' },
  { id: 'ss-4', title: 'Rebalance Sub Level', description: 'Sub-to-top level difference is 4.2 dB (target 3 dB). A 1 dB reduction on the sub amp will flatten the low-frequency response.', action: 'Reduce sub amplifier gain by 1 dB', priority: 'low', category: 'level' },
];

export const SYSTEM_HEALTH = {
  apiConnected: false,
  dspEngineOnline: true,
  lastSync: '2026-09-30T07:50:00Z',
  activeChannels: 6,
  sampleRate: 48000,
  latencyMs: 12,
};

// --- Generators ---
export function generateWaveform(samples = 80, amplitude = 0.7) {
  const out = [];
  for (let i = 0; i < samples; i++) {
    const t = i / samples;
    const val = amplitude * Math.sin(t * Math.PI * 8) * (0.5 + 0.5 * Math.random()) + (Math.random() - 0.5) * 0.15;
    out.push(Math.max(-1, Math.min(1, val)));
  }
  return out;
}

export function generateSpectrum(bins = 28) {
  const out = [];
  for (let i = 0; i < bins; i++) {
    const freq = 20 * Math.pow(1000, i / bins);
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

// --- API simulation (async with delay) ---
async function requestJSON(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function withFallback(value, fallback) {
  return value === undefined || value === null ? fallback : value;
}

export async function fetchData(endpoint, ...args) {
  const fallback = {
    venues: VENUES,
    venue: VENUES.find((v) => v.id === args[0]) ?? null,
    zones: ZONES.filter((z) => z.venueId === args[0]),
    points: (() => {
      const zoneIds = ZONES.filter((z) => z.venueId === args[0]).map((z) => z.id);
      return MEASUREMENT_POINTS.filter((p) => zoneIds.includes(p.zoneId));
    })(),
    latest: LATEST_MEASUREMENT,
    equipment: EQUIPMENT.filter((e) => e.venueId === args[0]),
    signalChain: SIGNAL_CHAIN.find((sc) => sc.venueId === args[0]) ?? SIGNAL_CHAIN[0] ?? null,
    sessions: args[0] ? SESSIONS.filter((s) => s.venueId === args[0]) : SESSIONS,
    profiles: ENGINEERING_PROFILES.filter((p) => p.venueId === args[0]),
    results: ENGINEERING_RESULTS,
    verifications: VERIFICATIONS,
    alerts: args[0] ? ALERTS.filter((a) => a.venueId === args[0]) : ALERTS,
    suggestions: SMART_SUGGESTIONS,
    health: SYSTEM_HEALTH,
  }[endpoint] ?? null;

  try {
    switch (endpoint) {
      case 'health': {
        const result = await requestJSON('/health');
        return { ...SYSTEM_HEALTH, ...result };
      }
      case 'venues':
        return await requestJSON('/venues');
      case 'venue': {
        const list = await requestJSON('/venues');
        return list.find((v) => v.id === args[0]) ?? null;
      }
      case 'zones': {
        const list = await requestJSON(`/zones?venue_id=${encodeURIComponent(args[0] ?? '')}`);
        return Array.isArray(list) ? list : [];
      }
      case 'points': {
        const zoneId = args[0];
        const list = await requestJSON(`/measurement-points?zone_id=${encodeURIComponent(zoneId ?? '')}`);
        return Array.isArray(list) ? list : [];
      }
      case 'sessions': {
        if (!args[0]) return [];
        const list = await requestJSON(`/sessions?venue_id=${encodeURIComponent(args[0])}`);
        return Array.isArray(list) ? list : [];
      }
      case 'equipment': {
        const list = await requestJSON('/equipment');
        if (!Array.isArray(list)) return [];
        if (args[0]) {
          const filtered = list.filter((item) => item.venueId === args[0] || item.venue_id === args[0]);
          return filtered.length > 0 ? filtered : list;
        }
        return list;
      }
      case 'signalChain': {
        const list = await requestJSON('/signal-chains');
        if (!Array.isArray(list)) return null;
        const selected = list.find((item) => item.venueId === args[0] || item.venue_id === args[0]);
        return selected ?? list[0] ?? null;
      }
      case 'latest':
        return null;
      case 'profiles':
        return [];
      case 'results':
        return [];
      case 'verifications':
        return [];
      case 'alerts':
        return [];
      case 'suggestions':
        return [];
      default:
        return null;
    }
  } catch (error) {
    console.warn(`SoundPilot API fetch failed for ${endpoint}:`, error);
    return withFallback(fallback, null);
  }
}
