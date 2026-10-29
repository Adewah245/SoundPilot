// =========================================================================
// SoundPilot — Measurements Page
//
// Real end-to-end measurement workflow:
//   1. Load venues from the API.
//   2. Load zones for the selected venue, then measurement points per zone.
//   3. Ensure a real session exists (load from API or create one).
//   4. Submit a POST /measurements request with real IDs.
//   5. Display the actual server response including frequency data.
//
// No random generated values are used as real measurement results.
// The backend saves the measurement; the frontend never presents a result
// as saved until the server confirms it.
// =========================================================================

import * as C from '../components.js';
import {
  listVenues,
  listZones,
  listMeasurementPoints,
  listSessions,
  createSession,
  submitMeasurement,
} from '../data.js';

// ---------------------------------------------------------------------------
// Module state — reset on every render() call.
// ---------------------------------------------------------------------------

/** @type {'idle'|'loading'|'capturing'|'done'|'error'} */
let measState = 'idle';
let venues = [];
let selectedVenueId = '';
let zones = [];
let measurementPoints = [];
let selectedPointId = '';
let sessionId = '';
let sessionName = '';
let lastResult = null;   // domain.Measurement returned by the server
let lastError = '';
let savedMeasurements = []; // list of confirmed server-saved results (this page lifetime)
let isSubmitting = false;   // guard against duplicate submissions

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export async function render(container) {
  // Reset module state so re-navigating to the page starts fresh.
  measState = 'loading';
  venues = [];
  selectedVenueId = '';
  zones = [];
  measurementPoints = [];
  selectedPointId = '';
  sessionId = '';
  sessionName = '';
  lastResult = null;
  lastError = '';
  isSubmitting = false;

  container.innerHTML = C.loading('Loading venues…');

  try {
    venues = await listVenues();
  } catch (err) {
    container.innerHTML = errorPage(
      'Could not load venues',
      `The API is unreachable or returned an error: ${err.message}`,
      'Check that the SoundPilot backend is running and try refreshing the page.',
    );
    return;
  }

  if (!Array.isArray(venues) || venues.length === 0) {
    container.innerHTML = emptyPage(
      'No venues found',
      'Create a venue before taking measurements.',
    );
    return;
  }

  selectedVenueId = venues[0].id;

  await loadVenueData(container);
}

// ---------------------------------------------------------------------------
// Load zones + points + session for the selected venue.
// ---------------------------------------------------------------------------

async function loadVenueData(container) {
  container.innerHTML = C.loading('Loading measurement points…');

  try {
    // Load zones for the selected venue.
    zones = await listZones(selectedVenueId);
    if (!Array.isArray(zones)) zones = [];

    // Load all measurement points for every zone (backend lists by zone_id).
    const pointLists = await Promise.all(
      zones.map((z) => listMeasurementPoints(z.id).catch(() => [])),
    );
    measurementPoints = pointLists.flat();

    // Load an existing active session or create one.
    let sessions = [];
    try {
      sessions = await listSessions(selectedVenueId);
      if (!Array.isArray(sessions)) sessions = [];
    } catch (_) {
      sessions = [];
    }

    const activeSession = sessions.find((s) => s.status === 'active');
    if (activeSession) {
      sessionId = activeSession.id;
      sessionName = activeSession.name || activeSession.id;
    } else {
      // Create a new session for this venue so the user can start immediately.
      const newSession = await createSession(
        selectedVenueId,
        `Measurement Session ${new Date().toLocaleString()}`,
      );
      sessionId = newSession.id;
      sessionName = newSession.name || newSession.id;
    }
  } catch (err) {
    container.innerHTML = errorPage(
      'Could not load measurement data',
      err.message,
      'Ensure the backend is running and the database is reachable.',
    );
    return;
  }

  if (measurementPoints.length > 0 && !selectedPointId) {
    selectedPointId = measurementPoints[0].id;
  }

  measState = 'idle';
  renderPage(container);
}

// ---------------------------------------------------------------------------
// Main render loop
// ---------------------------------------------------------------------------

function renderPage(container) {
  const selectedPoint = measurementPoints.find((p) => p.id === selectedPointId);
  const selectedVenue = venues.find((v) => v.id === selectedVenueId);

  // Find the zone for the selected point so we can pass zone_id correctly.
  const selectedZone = selectedPoint
    ? zones.find((z) => z.id === selectedPoint.zone_id || z.id === selectedPoint.zoneId)
    : null;

  const isCapturing = measState === 'capturing';

  container.innerHTML = `
    ${C.pageHeader(
      'Measurements',
      'Real audio measurement workspace — select a point and capture audio through the DSP engine',
      C.icon('measurements', 20),
    )}

    <!-- Session info banner -->
    <div class="help-callout mb-4">
      ${C.icon('help', 20)}
      <div>
        <strong>Session:</strong> ${escHtml(sessionName)}
        &nbsp;|&nbsp;
        <strong>Venue:</strong> ${escHtml(selectedVenue?.name ?? selectedVenueId)}
        &nbsp;|&nbsp; Select a measurement point below, then press <strong>Start Measurement</strong>.
        The backend captures audio via the DSP engine and saves the result automatically.
      </div>
    </div>

    <!-- Controls bar -->
    <div class="card mb-4">
      <div class="card-content-pt flex flex-col gap-4" style="padding:16px">
        <div class="flex flex-col gap-3" style="flex-direction:row;flex-wrap:wrap;align-items:center">

          <!-- Venue selector -->
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium text-muted uppercase tracking-wide">Venue</span>
            <div style="position:relative;display:inline-block">
              <button class="select" onclick="SP.measurements.toggleVenueDropdown()" id="venue-select-btn">
                <span>${escHtml(selectedVenue?.name ?? 'Select venue')}</span>
                ${C.icon('arrowDown', 16)}
              </button>
              <div id="venue-dropdown" class="select-dropdown hidden">
                ${venues.map((v) => `<div class="select-option ${v.id === selectedVenueId ? 'selected' : ''}" onclick="SP.measurements.selectVenue('${v.id}')">${escHtml(v.name)}</div>`).join('')}
              </div>
            </div>
          </div>

          <!-- Measurement point selector -->
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium text-muted uppercase tracking-wide">Point</span>
            <div style="position:relative;display:inline-block">
              ${measurementPoints.length > 0 ? `
                <button class="select" onclick="SP.measurements.togglePointDropdown()" id="point-select-btn">
                  <span>${escHtml(selectedPoint?.name ?? 'Select measurement point')}</span>
                  ${C.icon('arrowDown', 16)}
                </button>
                <div id="point-dropdown" class="select-dropdown hidden">
                  ${measurementPoints.map((p) => `<div class="select-option ${p.id === selectedPointId ? 'selected' : ''}" onclick="SP.measurements.selectPoint('${p.id}')">${escHtml(p.name)}</div>`).join('')}
                </div>
              ` : `<span class="text-sm text-muted">No measurement points in this venue</span>`}
            </div>
          </div>

          ${selectedPoint ? `<div class="flex items-center gap-3 text-sm"><span class="text-muted">${escHtml(selectedPoint.location ?? '')}</span></div>` : ''}

          <!-- Action buttons -->
          <div class="flex items-center gap-2" style="margin-left:auto;flex-wrap:wrap">
            <!-- Status indicator -->
            <div class="flex items-center gap-2" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:8px 12px">
              <span class="${isCapturing ? 'text-success' : measState === 'done' ? 'text-success' : measState === 'error' ? 'text-danger' : 'text-muted'}" style="${isCapturing ? 'animation:pulseRing 2s infinite' : ''}">
                ${C.icon('circleDot', 14)}
              </span>
              <span class="text-sm font-medium" style="text-transform:capitalize">
                ${stateLabel(measState)}
              </span>
            </div>

            ${measState === 'idle' || measState === 'done' || measState === 'error' ? `
              <button class="btn btn-success" onclick="SP.measurements.start()" ${!selectedPoint || !sessionId ? 'disabled' : ''}>
                ${C.icon('play', 16)} Start Measurement
              </button>
            ` : ''}

            ${isCapturing ? `
              <button class="btn btn-outline" disabled>
                ${C.icon('circleDot', 16)} Capturing…
              </button>
            ` : ''}

            ${savedMeasurements.length >= 2 ? `
              <button class="btn btn-outline" disabled>${C.icon('compare', 16)} Compare</button>
            ` : `
              <button class="btn btn-outline" disabled>${C.icon('compare', 16)} Compare</button>
            `}
          </div>
        </div>

        ${!selectedPoint && measurementPoints.length > 0 ? `
          <div class="text-sm text-warning">⚠ Select a measurement point to begin.</div>
        ` : ''}
        ${!selectedPoint && measurementPoints.length === 0 ? `
          <div class="text-sm text-warning">⚠ No measurement points found for this venue. Add measurement points in the venue settings.</div>
        ` : ''}
      </div>
    </div>

    ${isCapturing ? capturingPanel() : ''}

    ${lastError && measState === 'error' ? errorPanel(lastError) : ''}

    ${lastResult && measState === 'done' ? resultPanel(lastResult) : ''}

    ${savedMeasurements.length > 0 ? savedPanel(savedMeasurements) : ''}

    <!-- Workflow hint -->
    <div class="card" style="border-style:dashed">
      <div class="card-content-pt flex items-center justify-between flex-wrap gap-2 text-sm text-muted" style="padding:16px">
        <span class="font-medium">Workflow:</span>
        <div class="flex items-center gap-2 text-xs">
          <span class="badge ${measState === 'capturing' ? 'badge-success' : 'badge-outline'}">${C.icon('play', 12)} Capture</span>
          <div class="separator-v"></div>
          <span class="badge ${measState === 'done' ? 'badge-success' : 'badge-outline'}">${C.icon('save', 12)} Auto-saved</span>
          <div class="separator-v"></div>
          <span class="badge badge-outline">${C.icon('compare', 12)} Compare</span>
        </div>
      </div>
    </div>
  `;

  // Expose handlers on the global SP namespace.
  window.SP = window.SP || {};
  window.SP.measurements = {
    start: () => startMeasurement(container, selectedPoint, selectedZone),
    selectPoint: (id) => {
      selectedPointId = id;
      document.getElementById('point-dropdown')?.classList.add('hidden');
      renderPage(container);
    },
    togglePointDropdown: () => {
      document.getElementById('point-dropdown')?.classList.toggle('hidden');
    },
    selectVenue: async (id) => {
      if (id === selectedVenueId) return;
      selectedVenueId = id;
      selectedPointId = '';
      sessionId = '';
      sessionName = '';
      lastResult = null;
      lastError = '';
      measState = 'idle';
      document.getElementById('venue-dropdown')?.classList.add('hidden');
      await loadVenueData(container);
    },
    toggleVenueDropdown: () => {
      document.getElementById('venue-dropdown')?.classList.toggle('hidden');
    },
  };

  // Close dropdowns on outside click.
  document.addEventListener('click', (e) => {
    ['point-dropdown', 'venue-dropdown'].forEach((id) => {
      const dd = document.getElementById(id);
      const btn = document.getElementById(id.replace('dropdown', 'select-btn'));
      if (dd && !dd.contains(e.target) && btn && !btn.contains(e.target)) {
        dd.classList.add('hidden');
      }
    });
  }, { once: true });
}

// ---------------------------------------------------------------------------
// Measurement submission
// ---------------------------------------------------------------------------

async function startMeasurement(container, point, zone) {
  if (isSubmitting) return; // Prevent duplicate submissions.
  if (!point) {
    lastError = 'No measurement point selected.';
    measState = 'error';
    renderPage(container);
    return;
  }
  if (!sessionId) {
    lastError = 'No active session. Reload the page to create one.';
    measState = 'error';
    renderPage(container);
    return;
  }

  // Resolve zone_id: prefer field from point, then from zone lookup.
  const zoneId = point.zone_id || point.zoneId || zone?.id || '';
  if (!zoneId) {
    lastError = `Cannot determine zone for measurement point "${point.name}". Check the data integrity.`;
    measState = 'error';
    renderPage(container);
    return;
  }

  isSubmitting = true;
  measState = 'capturing';
  lastResult = null;
  lastError = '';
  renderPage(container);

  try {
    const result = await submitMeasurement({
      sessionId,
      venueId: selectedVenueId,
      zoneId,
      measurementPointId: point.id,
      audioSource: 'microphone',
      audioDevice: -1,  // -1 = system default input device
      durationSeconds: 5,
      sampleRate: 44100,
      channels: 1,
    });

    lastResult = result;
    measState = 'done';

    // Record in the session-scoped saved list (server already persisted it).
    savedMeasurements.unshift({
      id: result.id,
      pointName: point.name,
      time: new Date().toLocaleTimeString(),
      result,
    });
  } catch (err) {
    lastError = err.message || 'Measurement failed. See browser console for details.';
    measState = 'error';
  } finally {
    isSubmitting = false;
  }

  renderPage(container);
}

// ---------------------------------------------------------------------------
// Partial HTML renderers
// ---------------------------------------------------------------------------

function capturingPanel() {
  return `
    <div class="card mb-4" style="border-color:var(--color-success)">
      <div class="card-content" style="padding:24px;text-align:center">
        <div style="font-size:2rem;margin-bottom:8px">🎙</div>
        <div class="font-semibold text-success">Capturing audio…</div>
        <div class="text-sm text-muted mt-2">
          The DSP engine is recording 5 seconds of audio through the default input device.
          Please wait — this cannot be cancelled mid-capture.
        </div>
      </div>
    </div>
  `;
}

function errorPanel(message) {
  return `
    <div class="card mb-4" style="border-color:var(--color-danger,#e74c3c)">
      <div class="card-header"><span class="card-title text-danger">⚠ Measurement Failed</span></div>
      <div class="card-content">
        <p class="text-sm" style="margin-bottom:12px">${escHtml(message)}</p>
        <p class="text-xs text-muted">
          Common causes: no microphone connected, DSP dependencies missing,
          invalid session or point ID, database unavailable.
        </p>
      </div>
    </div>
  `;
}

function resultPanel(m) {
  // m is the domain.Measurement object from the server.
  // noise_level is in dBFS; distortion_level is estimated THD%.
  const noiseDbfs = typeof m.noise_level === 'number' ? m.noise_level : null;
  const distPct = typeof m.distortion_level === 'number' ? m.distortion_level : null;
  const rmsDb = typeof m.rms_decibels === 'number' ? m.rms_decibels : null;
  const peakDb = typeof m.peak_decibels === 'number' ? m.peak_decibels : null;
  const clipping = !!m.clipping_detected;
  const feedback = !!m.feedback_detected;

  const freqData = Array.isArray(m.frequency_data) ? m.frequency_data : [];

  return `
    <div class="card mb-4" style="border-color:var(--color-success)">
      <div class="card-header">
        <span class="card-title">
          ${C.icon('save', 16)} Measurement Result
          <span class="badge badge-success" style="margin-left:8px">Saved to database</span>
        </span>
        <span class="text-xs text-muted mono">${escHtml(m.id ?? '')}</span>
      </div>
      <div class="card-content">

        <!-- Metrics Grid -->
        <div class="grid grid-6 mb-4">
          ${metricCard('RMS', rmsDb !== null ? rmsDb.toFixed(1) : '—', 'dBFS',
            rmsDb !== null ? (rmsDb > -3 ? 'critical' : rmsDb > -20 ? 'good' : 'neutral') : 'neutral',
            'Measured signal level')}
          ${metricCard('Peak', peakDb !== null ? peakDb.toFixed(1) : '—', 'dBFS',
            peakDb !== null ? (peakDb > -3 ? 'critical' : 'good') : 'neutral',
            'Measured peak level')}
          ${metricCard('Noise', noiseDbfs !== null ? noiseDbfs.toFixed(1) : '—', 'dBFS',
            'neutral',
            'Estimated noise floor (dBFS)')}
          ${metricCard('Est. THD', distPct !== null ? distPct.toFixed(1) : '—', '%',
            distPct !== null ? (distPct > 5 ? 'critical' : distPct > 2 ? 'warning' : 'good') : 'neutral',
            'Estimated THD (coarse harmonic approximation)')}
          ${metricCard('Clipping', clipping ? 'YES' : 'NO', '',
            clipping ? 'critical' : 'good',
            clipping ? 'Digital clipping detected (≥3 samples at ≥99% FS)' : 'No clipping detected')}
          ${metricCard('Feedback', feedback ? 'YES' : 'NO', '',
            feedback ? 'critical' : 'good',
            feedback ? 'Narrow dominant peak detected (potential feedback)' : 'No feedback peak detected')}
        </div>

        <!-- Measurement metadata -->
        <div class="flex flex-wrap gap-4 text-xs text-muted mono mb-4">
          <span>Duration: ${m.duration_seconds ?? '—'} s</span>
          <span>Sample rate: ${m.sample_rate ?? '—'} Hz</span>
          <span>Channels: ${m.channels ?? '—'}</span>
          <span>Source: ${escHtml(m.source ?? '—')}</span>
          <span>Captured: ${m.created_at ? new Date(m.created_at).toLocaleString() : '—'}</span>
        </div>

        <!-- Frequency spectrum -->
        ${freqData.length > 0 ? frequencySpectrumPanel(freqData) : `
          <div class="text-sm text-muted">No frequency data returned.</div>
        `}

        <!-- Noise-unit note -->
        <div class="text-xs text-muted mt-3" style="border-top:1px solid var(--border);padding-top:8px">
          <strong>Units:</strong>
          RMS and Peak are in dBFS (0 dBFS = digital full scale).
          Noise floor is the estimated quietest-window RMS in dBFS.
          THD is a coarse harmonic-energy estimate — label "Est. THD" reflects that this has not been validated against a calibrated reference.
        </div>
      </div>
    </div>
  `;
}

function frequencySpectrumPanel(freqData) {
  // Build a minimal bar chart from actual DSP frequency data.
  // freqData: [{frequency_hz, level_db}, ...]
  // We display up to 40 bins; skip DC (freq=0).
  const bins = freqData.filter((b) => b.frequency_hz > 0).slice(0, 40);
  if (bins.length === 0) return '<div class="text-sm text-muted">No frequency bins available.</div>';

  const minDb = Math.min(...bins.map((b) => b.level_db));
  const maxDb = Math.max(...bins.map((b) => b.level_db));
  const range = maxDb - minDb || 1;

  const barWidth = Math.floor(800 / bins.length);
  const bars = bins
    .map((b) => {
      const heightPct = Math.max(2, ((b.level_db - minDb) / range) * 100);
      const freq = b.frequency_hz < 1000
        ? `${Math.round(b.frequency_hz)}Hz`
        : `${(b.frequency_hz / 1000).toFixed(1)}k`;
      return `<div title="${freq}: ${b.level_db.toFixed(1)} dB" style="display:inline-block;width:${barWidth}px;height:${heightPct.toFixed(0)}%;background:var(--color-primary,#3498db);margin:0 1px;vertical-align:bottom;min-height:2px"></div>`;
    })
    .join('');

  return `
    <div class="card-header" style="padding:0;margin-bottom:8px">
      <span class="card-title">Frequency Spectrum (DSP output)</span>
      <span class="text-xs text-muted">${bins.length} bins · ${formatFreq(bins[0].frequency_hz)}–${formatFreq(bins[bins.length - 1].frequency_hz)}</span>
    </div>
    <div style="height:180px;overflow:hidden;display:flex;align-items:flex-end;background:var(--bg-elevated);border-radius:4px;padding:8px">
      ${bars}
    </div>
    <div class="flex justify-between text-xs text-muted mono mt-1">
      <span>${formatFreq(bins[0].frequency_hz)}</span>
      <span>Frequency</span>
      <span>${formatFreq(bins[bins.length - 1].frequency_hz)}</span>
    </div>
  `;
}

function savedPanel(list) {
  return `
    <div class="card mb-4">
      <div class="card-header"><span class="card-title">Saved This Session (${list.length})</span></div>
      <div class="card-content space-y-2">
        ${list.map((m, i) => `
          <div class="flex items-center justify-between" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:12px">
            <div class="flex items-center gap-4">
              <span class="badge badge-outline mono text-xs">#${list.length - i}</span>
              <span class="text-sm font-medium">${escHtml(m.pointName)}</span>
              <span class="text-xs text-muted mono">${escHtml(m.time)}</span>
            </div>
            <div class="flex items-center gap-3 text-xs mono">
              <span class="text-success">RMS: ${m.result.rms_decibels?.toFixed(1) ?? '—'} dBFS</span>
              <span class="text-warning">Peak: ${m.result.peak_decibels?.toFixed(1) ?? '—'} dBFS</span>
              <span class="text-info">Est. THD: ${m.result.distortion_level?.toFixed(1) ?? '—'}%</span>
              <span class="${m.result.clipping_detected ? 'text-danger' : 'text-muted'}">
                ${m.result.clipping_detected ? '⚠ Clipping' : 'No clip'}
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function metricCard(label, value, unit, status, tooltip) {
  const colorClass = {
    good: 'text-success',
    warning: 'text-warning',
    critical: 'text-danger',
    neutral: 'text-muted',
  }[status] || 'text-muted';

  return `
    <div class="card" style="padding:16px;text-align:center">
      <div class="text-xs text-muted uppercase tracking-wide mb-1">${escHtml(label)}</div>
      <div class="font-semibold ${colorClass}" style="font-size:1.4rem">${escHtml(String(value))}${unit ? `<span class="text-xs text-muted ml-1">${escHtml(unit)}</span>` : ''}</div>
      ${tooltip ? `<div class="text-xs text-muted mt-1">${escHtml(tooltip)}</div>` : ''}
    </div>
  `;
}

function stateLabel(state) {
  return { idle: 'Ready', loading: 'Loading…', capturing: 'Capturing', done: 'Complete', error: 'Error' }[state] ?? state;
}

function formatFreq(hz) {
  return hz >= 1000 ? `${(hz / 1000).toFixed(1)}kHz` : `${Math.round(hz)}Hz`;
}

/** Minimal HTML-escape for untrusted strings rendered into innerHTML. */
function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function errorPage(title, detail, advice) {
  return `
    <div class="card" style="border-color:var(--color-danger,#e74c3c);padding:24px;text-align:center">
      <div style="font-size:2rem;margin-bottom:8px">⚠</div>
      <div class="font-semibold" style="margin-bottom:8px">${escHtml(title)}</div>
      <div class="text-sm text-muted" style="margin-bottom:8px">${escHtml(detail)}</div>
      <div class="text-xs text-muted">${escHtml(advice)}</div>
    </div>
  `;
}

function emptyPage(title, advice) {
  return `
    <div class="card" style="padding:24px;text-align:center">
      <div style="font-size:2rem;margin-bottom:8px">🏛</div>
      <div class="font-semibold" style="margin-bottom:8px">${escHtml(title)}</div>
      <div class="text-sm text-muted">${escHtml(advice)}</div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Cleanup — called by the SPA router when navigating away.
// ---------------------------------------------------------------------------

export function cleanup() {
  isSubmitting = false;
}
