// =========================================================================
// SoundPilot — Dashboard Page
// =========================================================================

import * as C from '../components.js';
import { fetchData, generateWaveform, generateSpectrum } from '../data.js';

export async function render(container) {
  container.innerHTML = C.loading('Loading system overview...');

  const [venue, zones, sessions, measurement, suggestions, alerts, health] = await Promise.all([
    fetchData('venue', 'v-001'),
    fetchData('zones', 'v-001'),
    fetchData('sessions', 'v-001'),
    fetchData('latest'),
    fetchData('suggestions'),
    fetchData('alerts', 'v-001'),
    fetchData('health'),
  ]);

  const session = sessions.find((s) => s.status === 'active') || sessions[0] || null;
  const unackAlerts = alerts.filter((a) => !a.acknowledged);
  const metrics = measurement?.metrics;
  const totalPoints = zones.reduce((sum, z) => sum + z.pointIds.length, 0);

  function metricStatus(value, target, tolerance) {
    if (Math.abs(value - target) <= tolerance) return 'good';
    if (Math.abs(value - target) <= tolerance * 1.5) return 'warning';
    return 'critical';
  }

  container.innerHTML = `
    ${C.pageHeader('Dashboard', 'Real-time system overview and measurement status', C.icon('dashboard', 20),
      `<button class="btn btn-primary btn-sm" onclick="SP.nav.go('measurements')">${C.icon('activity', 16)} New Measurement</button>`)}

    ${C.demoBanner(true)}

    ${C.gettingStartedGuide()}

    <!-- System Health -->
    <div class="card mb-4">
      <div class="card-content-pt flex flex-wrap items-center gap-4" style="padding:12px 16px">
        <div class="flex items-center gap-2">
          <span class="${health.dspEngineOnline ? 'text-success' : 'text-error'}">${C.icon('radio', 16)}</span>
          <span class="text-sm font-medium">DSP Engine</span>
          ${C.statusIndicator(health.dspEngineOnline ? 'active' : 'fault')}
        </div>
        <div class="separator-v"></div>
        <div class="flex items-center gap-2 text-sm"><span class="text-muted">Channels:</span><span class="mono font-semibold">${health.activeChannels}</span></div>
        <div class="separator-v"></div>
        <div class="flex items-center gap-2 text-sm"><span class="text-muted">Sample Rate:</span><span class="mono font-semibold">${(health.sampleRate / 1000).toFixed(0)} kHz</span></div>
        <div class="separator-v"></div>
        <div class="flex items-center gap-2 text-sm"><span class="text-muted">Latency:</span><span class="mono font-semibold">${health.latencyMs} ms</span></div>
        <div class="separator-v"></div>
        <div class="flex items-center gap-2 text-sm"><span class="text-muted">Last Sync:</span><span class="mono text-xs">${new Date(health.lastSync).toLocaleTimeString()}</span></div>
      </div>
    </div>

    <!-- Venue + Session + Health -->
    <div class="grid grid-3 mb-4">
      <div class="card">
        <div class="card-header"><span class="card-title-muted">Current Venue</span></div>
        <div class="card-content">
          ${venue ? `<div><div class="flex items-center justify-between"><h3 class="text-lg font-bold">${venue.name}</h3><span class="badge badge-outline" style="text-transform:capitalize">${venue.type}</span></div><p class="text-sm text-muted mt-1">${venue.description}</p><div class="flex items-center gap-4 text-xs text-muted mt-2"><span>Capacity: ${venue.capacity.toLocaleString()}</span><span>Zones: ${zones.length}</span></div></div>` : C.emptyState('No venue selected')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title-muted">Current Session</span></div>
        <div class="card-content">
          ${session ? `<div><div class="flex items-center justify-between"><h3 class="text-lg font-bold">${session.name}</h3>${C.statusIndicator(session.status)}</div><p class="text-sm text-muted mt-1">Engineer: ${session.engineerName}</p><div class="flex items-center gap-4 text-xs text-muted mt-2"><span>${session.measurementCount} measurements</span><span>Started: ${new Date(session.startedAt).toLocaleDateString()}</span></div></div>` : C.emptyState('No active session')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title-muted">System Health</span></div>
        <div class="card-content">
          <div class="grid grid-2" style="gap:8px">
            <div class="card-content-pt" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:12px">
              <div class="flex items-center gap-2 mb-1">${C.icon('checkCircle', 14)}<span class="text-xs text-muted">Zones</span></div>
              <p class="mono text-xl font-bold">${zones.length}</p>
            </div>
            <div class="card-content-pt" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:12px">
              <div class="flex items-center gap-2 mb-1">${C.icon('activity', 14)}<span class="text-xs text-muted">Measurements</span></div>
              <p class="mono text-xl font-bold">${session?.measurementCount || 0}</p>
            </div>
            <div class="card-content-pt" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:12px">
              <div class="flex items-center gap-2 mb-1">${C.icon('alert', 14)}<span class="text-xs text-muted">Alerts</span></div>
              <p class="mono text-xl font-bold text-warning">${unackAlerts.length}</p>
            </div>
            <div class="card-content-pt" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:12px">
              <div class="flex items-center gap-2 mb-1">${C.icon('gauge', 14)}<span class="text-xs text-muted">Points</span></div>
              <p class="mono text-xl font-bold">${totalPoints}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Core Metrics -->
    <h2 class="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Current Measurement</h2>
    <div class="grid grid-6 mb-4">
      ${C.metricCard('RMS', metrics?.rms.toFixed(1) ?? '--', 'dBFS', metrics ? metricStatus(metrics.rms, -18, 3) : 'neutral', metrics ? 'Target: -18 dBFS' : 'No data', 'rms')}
      ${C.metricCard('Peak', metrics?.peak.toFixed(1) ?? '--', 'dBFS', metrics ? metricStatus(metrics.peak, -6, 3) : 'neutral', metrics ? 'Target: -6 dBFS' : 'No data', 'peak')}
      ${C.metricCard('Noise', metrics?.noise.toFixed(1) ?? '--', 'dBFS', metrics ? metricStatus(metrics.noise, -55, 5) : 'neutral', metrics ? 'Target: -55 dBFS' : 'No data', 'noise')}
      ${C.metricCard('Distortion', metrics ? metrics.distortion.toFixed(1) : '--', '%', metrics ? metricStatus(metrics.distortion, 1.0, 0.5) : 'neutral', metrics ? 'Target: <1.0%' : 'No data', 'distortion')}
      ${C.metricCard('Clipping', metrics?.clipping ? 'YES' : 'NO', '', metrics?.clipping ? 'critical' : 'good', metrics?.clipping ? 'Headroom exceeded' : 'No clipping', 'clipping')}
      ${C.metricCard('Feedback', metrics ? metrics.feedback.toFixed(2) : '--', '', metrics ? metricStatus(metrics.feedback, 0, 0.2) : 'neutral', metrics ? 'Target: 0.0' : 'No data', 'feedback')}
    </div>

    <!-- Meters + Waveform -->
    <div class="grid grid-3 mb-4">
      <div class="card">
        <div class="card-header"><span class="card-title">Level Meters</span></div>
        <div class="card-content">
          <div class="flex justify-around gap-4">
            ${C.vuMeter('RMS', metrics?.rms ?? -60, -60, 0, 'dBFS', 180)}
            ${C.vuMeter('Peak', metrics?.peak ?? -60, -60, 0, 'dBFS', 180)}
            ${C.vuMeter('Noise', metrics?.noise ?? -60, -80, -20, 'dBFS', 180)}
          </div>
        </div>
      </div>
      <div class="card col-span-2">
        <div class="card-header"><span class="card-title">Waveform</span><span class="badge badge-outline mono text-xs">${measurement ? new Date(measurement.timestamp).toLocaleTimeString() : '--'}</span></div>
        <div class="card-content">${C.waveformDisplay(measurement?.waveform, 180)}</div>
      </div>
    </div>

    <!-- Spectrum -->
    <div class="card mb-4">
      <div class="card-header"><span class="card-title">Frequency Spectrum</span><button class="btn btn-ghost btn-sm" onclick="SP.nav.go('measurements')">Open workspace ${C.icon('arrowRight', 12)}</button></div>
      <div class="card-content">${C.spectrumDisplay(measurement?.spectrum, 160)}</div>
    </div>

    <!-- Alerts + Suggestions -->
    <div class="grid grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">Active Alerts</span>${unackAlerts.length > 0 ? `<span class="badge badge-warning">${unackAlerts.length} unacknowledged</span>` : ''}</div>
        <div class="card-content space-y-3">
          ${unackAlerts.length === 0 ? C.emptyState('No active alerts', 'All systems within acceptable parameters.', C.icon('checkCircle', 24)) :
            unackAlerts.map((a) => `<div class="flex items-start gap-3" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:12px">
              <div>${C.alertBadge(a.severity)}</div>
              <div class="flex-1 min-w-0"><p class="text-sm font-semibold">${a.title}</p><p class="text-xs text-muted mt-1">${a.message}</p><p class="text-xs text-muted mono mt-1">${a.source} · ${new Date(a.createdAt).toLocaleTimeString()}</p></div>
            </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title flex items-center gap-2">${C.icon('bulb', 16)} Smart Suggestions</span><button class="btn btn-ghost btn-sm" onclick="SP.nav.go('engineering')">View all ${C.icon('arrowRight', 12)}</button></div>
        <div class="card-content space-y-3">
          ${suggestions.length === 0 ? C.emptyState('No suggestions', 'Measurements are within target parameters.') :
            suggestions.slice(0, 3).map((s) => `<div style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:12px">
              <div class="flex items-start justify-between gap-2"><p class="text-sm font-semibold">${s.title}</p><span class="badge ${s.priority === 'high' ? 'badge-error' : s.priority === 'medium' ? 'badge-warning' : 'badge-info'}" style="font-size:10px">${s.priority}</span></div>
              <p class="text-xs text-muted mt-1">${s.description}</p>
              <p class="text-xs text-primary mt-2 font-medium">→ ${s.action}</p>
            </div>`).join('')}
        </div>
      </div>
    </div>
  `;
}
