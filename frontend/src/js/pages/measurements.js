// =========================================================================
// SoundPilot — Measurements Page
// =========================================================================

import * as C from '../components.js';
import { fetchData, generateWaveform, generateSpectrum } from '../data.js';

let measState = 'idle'; // idle | running | stopped | saved
let elapsed = 0;
let timerRef = null;
let animRef = null;
let selectedPointId = '';
let liveWaveform = generateWaveform(60);
let liveSpectrum = generateSpectrum(28);
let liveMetrics = null;
let savedMeasurements = [];

export async function render(container) {
  container.innerHTML = C.loading('Loading measurement points...');

  const points = await fetchData('points', 'v-001');
  if (points[0]) selectedPointId = points[0].id;

  // Reset state on entry
  measState = 'idle';
  elapsed = 0;
  liveMetrics = null;

  renderPage(container, points);
}

function renderPage(container, points) {
  const selectedPoint = points.find((p) => p.id === selectedPointId);
  const isRunning = measState === 'running';
  const displayMetrics = liveMetrics || { rms: -18.2, peak: -6.4, noise: -52.1, distortion: 0.8, clipping: false, feedback: 0 };
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  container.innerHTML = `
    ${C.pageHeader('Measurements', 'Professional audio measurement workspace — pick a spot, press Start, and watch your sound in real time', C.icon('measurements', 20))}

    ${C.demoBanner(true)}

    <!-- Step-by-step hint for beginners -->
    <div class="help-callout mb-4">
      ${C.icon('help', 20)}
      <div>
        <strong>How to use this page:</strong> First, choose where your microphone is placed (the "Point" dropdown). Then press the green <strong>Start</strong> button to begin measuring. Watch the meters and waveform move in real time. When you are done, press <strong>Stop</strong>, then <strong>Save</strong> to keep the result. ${C.infoTooltip('measurementPoint')}
      </div>
    </div>

    <!-- Controls Bar -->
    <div class="card mb-4">
      <div class="card-content-pt flex flex-col gap-4" style="padding:16px">
        <div class="flex flex-col gap-3" style="flex-direction:row;flex-wrap:wrap;align-items:center">
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium text-muted uppercase tracking-wide">Point</span>
            <div style="position:relative;display:inline-block">
              <button class="select" onclick="SP.measurements.togglePointDropdown()" id="point-select-btn">
                <span>${selectedPoint?.name || 'Select measurement point'}</span>
                ${C.icon('arrowDown', 16)}
              </button>
              <div id="point-dropdown" class="select-dropdown hidden">
                ${points.map((p) => `<div class="select-option ${p.id === selectedPointId ? 'selected' : ''}" onclick="SP.measurements.selectPoint('${p.id}')">${p.name}</div>`).join('')}
              </div>
            </div>
          </div>
          ${selectedPoint ? `<div class="flex items-center gap-3 text-sm"><span class="text-muted">${selectedPoint.location}</span>${C.statusIndicator(selectedPoint.status)}</div>` : ''}
          <div class="flex items-center gap-2" style="margin-left:auto;flex-wrap:wrap">
            <div class="flex items-center gap-2" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:8px 12px">
              ${C.icon('timer', 16)}
              <span class="mono text-sm font-semibold">${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}</span>
            </div>
            <div class="flex items-center gap-2" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:8px 12px">
              <span class="${isRunning ? 'text-success' : measState === 'stopped' ? 'text-warning' : 'text-muted'}" style="${isRunning ? 'animation:pulseRing 2s infinite' : ''}">${C.icon('circleDot', 14)}</span>
              <span class="text-sm font-medium" style="text-transform:capitalize">${measState}</span>
            </div>
            ${measState === 'idle' ? `<button class="btn btn-success" onclick="SP.measurements.start()">${C.icon('play', 16)} Start</button>` : ''}
            ${isRunning ? `<button class="btn btn-danger" onclick="SP.measurements.stop()">${C.icon('stop', 16)} Stop</button>` : ''}
            ${measState === 'stopped' ? `<button class="btn btn-primary" onclick="SP.measurements.save()">${C.icon('save', 16)} Save</button><button class="btn btn-outline" onclick="SP.measurements.reset()">Discard</button>` : ''}
            ${measState === 'saved' ? `<span class="badge badge-success">${C.icon('save', 12)} Saved</span><button class="btn btn-outline" onclick="SP.measurements.reset()">${C.icon('play', 16)} New</button>` : ''}
            <button class="btn btn-outline" disabled="${savedMeasurements.length < 2 ? '' : ''}" ${savedMeasurements.length < 2 ? 'disabled' : ''}>${C.icon('compare', 16)} Compare</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-6 mb-4">
      ${C.metricCard('RMS', displayMetrics.rms.toFixed(1), 'dBFS', isRunning ? 'good' : 'neutral', 'Target: -18 dBFS', 'rms')}
      ${C.metricCard('Peak', displayMetrics.peak.toFixed(1), 'dBFS', isRunning ? (displayMetrics.peak > -3 ? 'critical' : 'good') : 'neutral', 'Target: -6 dBFS', 'peak')}
      ${C.metricCard('Noise', displayMetrics.noise.toFixed(1), 'dBFS', 'neutral', 'Target: -55 dBFS', 'noise')}
      ${C.metricCard('Distortion', displayMetrics.distortion.toFixed(1), '%', displayMetrics.distortion > 1.5 ? 'critical' : displayMetrics.distortion > 1.0 ? 'warning' : 'good', 'Target: <1.0%', 'distortion')}
      ${C.metricCard('Clipping', displayMetrics.clipping ? 'YES' : 'NO', '', displayMetrics.clipping ? 'critical' : 'good', displayMetrics.clipping ? 'Headroom exceeded' : 'No clipping', 'clipping')}
      ${C.metricCard('Feedback', displayMetrics.feedback.toFixed(2), '', displayMetrics.feedback > 0.2 ? 'critical' : 'good', 'Target: 0.0', 'feedback')}
    </div>

    <!-- Visualizations -->
    <div class="grid grid-3 mb-4">
      <div class="card">
        <div class="card-header"><span class="card-title">Level Meters ${C.infoTooltip('dbfs')}</span></div>
        <div class="card-content">
          <div class="flex justify-around gap-4">
            ${C.vuMeter('RMS', displayMetrics.rms, -60, 0, 'dBFS', 200)}
            ${C.vuMeter('Peak', displayMetrics.peak, -60, 0, 'dBFS', 200)}
            ${C.vuMeter('Noise', displayMetrics.noise, -80, -20, 'dBFS', 200)}
          </div>
        </div>
      </div>
      <div class="card col-span-2">
        <div class="card-header">
          <span class="card-title">Waveform ${C.infoTooltip('waveform')}</span>
          ${isRunning ? `<span class="badge badge-success"><span class="pulse-dot"></span>Live Capture</span>` : ''}
        </div>
        <div class="card-content" id="waveform-container">${C.waveformDisplay(liveWaveform, 200, isRunning)}</div>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-header">
        <span class="card-title">Frequency Spectrum (RTA) ${C.infoTooltip('spectrum')}</span>
        ${isRunning ? `<span class="badge badge-success"><span class="pulse-dot"></span>Live</span>` : ''}
      </div>
      <div class="card-content" id="spectrum-container">${C.spectrumDisplay(liveSpectrum, 180, isRunning)}</div>
    </div>

    <!-- Saved Measurements -->
    ${savedMeasurements.length > 0 ? `
    <div class="card mb-4">
      <div class="card-header"><span class="card-title">Saved Measurements (This Session)</span></div>
      <div class="card-content space-y-2">
        ${savedMeasurements.map((m, i) => `<div class="flex items-center justify-between" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:12px">
          <div class="flex items-center gap-4">
            <span class="badge badge-outline mono text-xs">#${savedMeasurements.length - i}</span>
            <span class="text-sm font-medium">${m.point}</span>
            <span class="text-xs text-muted mono">${m.time}</span>
          </div>
          <div class="flex items-center gap-3 text-xs mono">
            <span class="text-success">RMS: ${m.metrics.rms.toFixed(1)}</span>
            <span class="text-warning">Peak: ${m.metrics.peak.toFixed(1)}</span>
            <span class="text-info">THD: ${m.metrics.distortion.toFixed(1)}%</span>
          </div>
        </div>`).join('')}
      </div>
    </div>` : ''}

    <!-- Workflow hint -->
    <div class="card" style="border-style:dashed">
      <div class="card-content-pt flex items-center justify-between flex-wrap gap-2 text-sm text-muted" style="padding:16px">
        <span class="font-medium">Workflow:</span>
        <div class="flex items-center gap-2 text-xs">
          <span class="badge ${measState === 'running' ? 'badge-success' : 'badge-outline'}">${C.icon('play', 12)} Start</span>
          <div class="separator-v"></div>
          <span class="badge ${measState === 'stopped' ? 'badge-warning' : 'badge-outline'}">${C.icon('stop', 12)} Stop</span>
          <div class="separator-v"></div>
          <span class="badge ${measState === 'saved' ? 'badge-success' : 'badge-outline'}">${C.icon('save', 12)} Save</span>
          <div class="separator-v"></div>
          <span class="badge badge-outline">${C.icon('compare', 12)} Compare</span>
        </div>
      </div>
    </div>
  `;

  // Expose handlers
  window.SP.measurements = {
    start: () => {
      measState = 'running';
      elapsed = 0;
      timerRef = setInterval(() => { elapsed++; }, 1000);
      animRef = setInterval(() => {
        liveWaveform = generateWaveform(60);
        liveSpectrum = generateSpectrum(28);
        liveMetrics = {
          rms: -16 - Math.random() * 4,
          peak: -5 - Math.random() * 3,
          noise: -52 - Math.random() * 4,
          distortion: 0.5 + Math.random() * 1.2,
          clipping: Math.random() > 0.92,
          feedback: Math.random() * 0.3,
        };
        updateLive(container, points);
      }, 150);
      renderPage(container, points);
    },
    stop: () => {
      measState = 'stopped';
      if (timerRef) clearInterval(timerRef);
      if (animRef) clearInterval(animRef);
      renderPage(container, points);
    },
    save: () => {
      if (!liveMetrics) return;
      const point = points.find((p) => p.id === selectedPointId);
      savedMeasurements.unshift({ point: point?.name || 'Unknown', metrics: liveMetrics, time: new Date().toLocaleTimeString() });
      measState = 'saved';
      renderPage(container, points);
    },
    reset: () => {
      measState = 'idle';
      elapsed = 0;
      liveMetrics = null;
      if (timerRef) clearInterval(timerRef);
      if (animRef) clearInterval(animRef);
      renderPage(container, points);
    },
    selectPoint: (id) => {
      selectedPointId = id;
      document.getElementById('point-dropdown').classList.add('hidden');
      renderPage(container, points);
    },
    togglePointDropdown: () => {
      document.getElementById('point-dropdown').classList.toggle('hidden');
    },
  };

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    const dd = document.getElementById('point-dropdown');
    const btn = document.getElementById('point-select-btn');
    if (dd && !dd.contains(e.target) && btn && !btn.contains(e.target)) {
      dd.classList.add('hidden');
    }
  }, { once: true });
}

function updateLive(container, points) {
  const wf = document.getElementById('waveform-container');
  const sp = document.getElementById('spectrum-container');
  if (wf) wf.innerHTML = C.waveformDisplay(liveWaveform, 200, true);
  if (sp) sp.innerHTML = C.spectrumDisplay(liveSpectrum, 180, true);
}

// Cleanup on navigation away
export function cleanup() {
  if (timerRef) clearInterval(timerRef);
  if (animRef) clearInterval(animRef);
}
