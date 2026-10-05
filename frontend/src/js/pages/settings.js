// =========================================================================
// SoundPilot — Settings Page
// =========================================================================

import * as C from '../components.js';
import { fetchData } from '../data.js';

export async function render(container) {
  container.innerHTML = C.loading('Loading settings...');

  const health = await fetchData('health');

  container.innerHTML = `
    ${C.pageHeader('Settings', 'Configure SoundPilot — API connection, display preferences, and system information', C.icon('settings', 20))}

    ${C.demoBanner(true)}

    <div class="grid grid-2">
      <!-- API Connection -->
      <div class="card">
        <div class="card-header"><span class="card-title flex items-center gap-2">${C.icon('server', 16)} API Connection</span></div>
        <div class="card-content space-y-3">
          <div class="flex items-center justify-between" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:12px">
            <div><p class="text-sm font-medium">Status</p><p class="text-xs text-muted mt-1">${health.apiConnected ? 'Connected to Go API' : 'Not connected — using demo data'}</p></div>
            ${health.apiConnected ? '<span class="badge badge-success"><span class="pulse-dot"></span>Connected</span>' : '<span class="badge badge-warning">Demo Mode</span>'}
          </div>
          <div>
            <label class="label">API Base URL</label>
            <input class="input" type="text" placeholder="http://localhost:8080/api/v1" value="" id="api-url-input" />
            <p class="text-xs text-muted mt-1">Set VITE_API_BASE_URL in your .env file to connect to the Go backend.</p>
          </div>
          <div>
            <label class="label">DSP Engine</label>
            <div class="flex items-center justify-between" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:12px">
              <div><p class="text-sm font-medium">DSP Engine Status</p><p class="text-xs text-muted mt-1">${health.dspEngineOnline ? 'Online and processing' : 'Offline'}</p></div>
              ${C.statusIndicator(health.dspEngineOnline ? 'active' : 'offline')}
            </div>
          </div>
        </div>
      </div>

      <!-- System Info -->
      <div class="card">
        <div class="card-header"><span class="card-title flex items-center gap-2">${C.icon('cpu', 16)} System Information</span></div>
        <div class="card-content space-y-2">
          <div class="flex items-center justify-between text-sm" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:10px 12px"><span class="text-muted">Active Channels</span><span class="mono font-semibold">${health.activeChannels}</span></div>
          <div class="flex items-center justify-between text-sm" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:10px 12px"><span class="text-muted">Sample Rate</span><span class="mono font-semibold">${(health.sampleRate / 1000).toFixed(0)} kHz</span></div>
          <div class="flex items-center justify-between text-sm" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:10px 12px"><span class="text-muted">Latency</span><span class="mono font-semibold">${health.latencyMs} ms</span></div>
          <div class="flex items-center justify-between text-sm" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:10px 12px"><span class="text-muted">Last Sync</span><span class="mono text-xs">${new Date(health.lastSync).toLocaleString()}</span></div>
          <div class="flex items-center justify-between text-sm" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:10px 12px"><span class="text-muted">Version</span><span class="mono font-semibold">SoundPilot v1.0.0</span></div>
        </div>
      </div>

      <!-- Display Preferences -->
      <div class="card">
        <div class="card-header"><span class="card-title flex items-center gap-2">${C.icon('sliders', 16)} Display Preferences</span></div>
        <div class="card-content space-y-3">
          <div class="flex items-center justify-between" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:12px">
            <div><p class="text-sm font-medium">Show tooltips</p><p class="text-xs text-muted mt-1">Display plain-language explanations on technical terms</p></div>
            <div class="switch on" onclick="this.classList.toggle('on')"><div class="switch-thumb"></div></div>
          </div>
          <div class="flex items-center justify-between" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:12px">
            <div><p class="text-sm font-medium">Show getting started guide</p><p class="text-xs text-muted mt-1">Display the beginner guide on the dashboard</p></div>
            <div class="switch on" onclick="this.classList.toggle('on')"><div class="switch-thumb"></div></div>
          </div>
          <div class="flex items-center justify-between" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:12px">
            <div><p class="text-sm font-medium">Compact mode</p><p class="text-xs text-muted mt-1">Reduce padding and spacing for more content per screen</p></div>
            <div class="switch" onclick="this.classList.toggle('on')"><div class="switch-thumb"></div></div>
          </div>
          <div class="flex items-center justify-between" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:12px">
            <div><p class="text-sm font-medium">Auto-refresh measurements</p><p class="text-xs text-muted mt-1">Update dashboard data every 5 seconds</p></div>
            <div class="switch on" onclick="this.classList.toggle('on')"><div class="switch-thumb"></div></div>
          </div>
        </div>
      </div>

      <!-- About -->
      <div class="card">
        <div class="card-header"><span class="card-title flex items-center gap-2">${C.icon('book', 16)} About SoundPilot</span></div>
        <div class="card-content">
          <p class="text-sm text-muted">SoundPilot is a professional audio measurement and sound-system analysis tool designed for churches, auditoriums, and event centres.</p>
          <hr class="separator"/>
          <p class="text-xs text-muted">The workflow is simple: <strong style="color:var(--fg)">Measure, Understand, Adjust, Verify.</strong> Repeat until your sound system meets your targets. SoundPilot guides you through each step with plain-language explanations — no sound engineering degree required.</p>
          <hr class="separator"/>
          <div class="flex items-center gap-4 text-xs text-muted">
            <span class="flex items-center gap-1">${C.icon('shield', 12)} Built for safety</span>
            <span class="flex items-center gap-1">${C.icon('users', 12)} Beginner-friendly</span>
            <span class="flex items-center gap-1">${C.icon('sparkles', 12)} AI-assisted</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
