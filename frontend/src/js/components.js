// =========================================================================
// SoundPilot — Shared UI Components (plain JS)
// =========================================================================

import { getGlossary } from './glossary.js';

// --- SVG icon set (Lucide-style paths) ---
export const ICONS = {
  dashboard: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>',
  venue: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>',
  measurements: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  engineering: '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>',
  verification: '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>',
  equipment: '<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05"/><path d="M12 22.08V12"/>',
  sessions: '<path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/><path d="M12 6v6l4 2"/>',
  ai: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/>',
  settings: '<path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  gauge: '<path d="M12 14l4-4"/><path d="M3.34 19a10 10 0 1117.32 0"/>',
  alert: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
  trendUp: '<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
  trendDown: '<path d="M23 18l-9.5-9.5-5 5L1 6"/><path d="M17 18h6v-6"/>',
  zap: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
  audioWave: '<path d="M2 12h2l3-9 4 18 3-12 2 6h4"/>',
  bulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M2 12a7 7 0 1114 0c0 3-2 5-3 6H5c-1-1-3-3-3-6z"/>',
  check: '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>',
  checkCircle: '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>',
  radio: '<path d="M4.9 19.07C8.8 15.16 15.2 15.16 19.1 19.07"/><circle cx="12" cy="13" r="2"/><path d="M9.2 5.6C12.4 2.4 17.5 2.4 20.7 5.6M5.3 9.4C6.8 7.9 8.4 6.8 10.2 6"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  play: '<polygon points="5 3 19 12 5 21 5 3"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  save: '<path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
  compare: '<path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M21 3l-7 7"/><path d="M3 3l7 7"/><path d="M16 21h5v-5"/><path d="M8 21H3v-5"/><path d="M21 21l-7-7"/><path d="M3 21l7-7"/>',
  timer: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  circleDot: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>',
  arrowRight: '<path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>',
  arrowDown: '<path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/>',
  mic: '<path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><path d="M12 19v4M8 23h8"/>',
  speaker: '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>',
  cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>',
  amp: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
  layers: '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  bot: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/>',
  server: '<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/>',
  sliders: '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>',
  bell: '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>',
  users: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>',
  map: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>',
  crosshair: '<circle cx="12" cy="12" r="10"/><path d="M22 12h-4M6 12H2M12 6V2M12 22v-4"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  minus: '<path d="M5 12h14"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>',
  user: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  package: '<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05"/><path d="M12 22.08V12"/>',
  volume: '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>',
  headphones: '<path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/>',
  calendar: '<path d="M8 2v4M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/>',
  sparkles: '<path d="M12 3l1.9 5.8a2 2 0 001.3 1.3L21 12l-5.8 1.9a2 2 0 00-1.3 1.3L12 21l-1.9-5.8a2 2 0 00-1.3-1.3L3 12l5.8-1.9a2 2 0 001.3-1.3L12 3z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  edit: '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  rotate: '<path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16"/><path d="M3 21v-5h5"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>',
  database: '<path d="M12 2C6.5 2 2 3.8 2 6s4.5 4 10 4 10-1.8 10-4-4.5-4-10-4z"/><path d="M2 12c0 2.2 4.5 4 10 4s10-1.8 10-4"/><path d="M2 18c0 2.2 4.5 4 10 4s10-1.8 10-4"/>',
  wifi: '<path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0125 20M11 6.5a10.94 10.94 0 018.82 5.5M12 20H5a3 3 0 01-3-3V8a3 3 0 013-3h2"/>',
  wifiOff: '<path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0125 20M11 6.5a10.94 10.94 0 018.82 5.5M12 20H5a3 3 0 01-3-3V8a3 3 0 013-3h2"/>',
};

export function icon(name, size = 18) {
  const path = ICONS[name] || '';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

// --- Info tooltip ---
export function infoTooltip(glossaryKey) {
  const term = getGlossary(glossaryKey);
  if (!term) return '';
  const escaped = term.plain.replace(/"/g, '&quot;');
  return `<span class="info-tooltip" data-tooltip="${escaped}" data-analogy="${(term.analogy || '').replace(/"/g, '&quot;')}" onclick="SP.components.showTooltip(event)">${icon('help', 14)}</span>`;
}

// --- Status indicator ---
export function statusIndicator(status, label) {
  const map = {
    optimal: { color: 'success', label: 'Optimal', pulse: false },
    warning: { color: 'warning', label: 'Warning', pulse: false },
    critical: { color: 'error', label: 'Critical', pulse: true },
    idle: { color: 'neutral', label: 'Idle', pulse: false },
    active: { color: 'success', label: 'Active', pulse: true },
    standby: { color: 'success', label: 'Standby', pulse: false },
    fault: { color: 'error', label: 'Fault', pulse: true },
    offline: { color: 'neutral', label: 'Offline', pulse: false },
    running: { color: 'success', label: 'Running', pulse: true },
    stopped: { color: 'neutral', label: 'Stopped', pulse: false },
    saved: { color: 'success', label: 'Saved', pulse: false },
    failed: { color: 'error', label: 'Failed', pulse: true },
    completed: { color: 'success', label: 'Completed', pulse: false },
    archived: { color: 'neutral', label: 'Archived', pulse: false },
  };
  const cfg = map[status] || { color: 'neutral', label: status, pulse: false };
  return `<span class="status-indicator text-${cfg.color}"><span class="status-dot ${cfg.color}${cfg.pulse ? ' pulse' : ''}"></span>${label || cfg.label}</span>`;
}

// --- Status badge ---
export function statusBadge(status) {
  const map = {
    accepted: { cls: 'badge-success', label: 'Accepted' },
    needs_adjustment: { cls: 'badge-warning', label: 'Needs Adjustment' },
    rejected: { cls: 'badge-error', label: 'Rejected' },
  };
  const cfg = map[status] || { cls: 'badge-neutral', label: status };
  return `<span class="badge ${cfg.cls}">${cfg.label}</span>`;
}

// --- Alert badge ---
export function alertBadge(severity) {
  const map = {
    info: { cls: 'badge-info', label: 'Info' },
    warning: { cls: 'badge-warning', label: 'Warning' },
    critical: { cls: 'badge-error', label: 'Critical' },
  };
  const cfg = map[severity] || map.info;
  return `<span class="badge ${cfg.cls}">${cfg.label}</span>`;
}

// --- Metric card ---
export function metricCard(label, value, unit, status, subtext, helpKey) {
  const colorMap = { good: 'success', warning: 'warning', critical: 'error', neutral: '' };
  const borderMap = { good: 'border-success', warning: 'border-warning', critical: 'border-error', neutral: '' };
  const color = colorMap[status] || '';
  const border = borderMap[status] || '';
  return `<div class="metric-card ${border}">
    <div class="metric-card-header">
      <span class="metric-card-label">${label}${helpKey ? infoTooltip(helpKey) : ''}</span>
    </div>
    <div><span class="metric-card-value ${color}">${value}</span>${unit ? `<span class="metric-card-unit">${unit}</span>` : ''}</div>
    ${subtext ? `<p class="metric-card-subtext">${subtext}</p>` : ''}
  </div>`;
}

// --- VU Meter ---
export function vuMeter(label, value, min, max, unit, height) {
  height = height || 180;
  const range = max - min;
  const clamped = Math.max(min, Math.min(max, value));
  const fillPercent = ((clamped - min) / range) * 100;
  const greenEnd = ((-12 - min) / range) * 100;
  const amberEnd = ((-3 - min) / range) * 100;

  return `<div class="vu-meter">
    <div class="vu-meter-header">
      <span class="vu-meter-label">${label}</span>
      <span><span class="vu-meter-value">${value.toFixed(1)}</span><span class="vu-meter-unit">${unit}</span></span>
    </div>
    <div class="vu-meter-body">
      <div class="vu-meter-scale">
        <span>0</span><span>-12</span><span>-24</span><span>-36</span><span>-48</span>
      </div>
      <div class="vu-meter-bar" style="height:${height}px">
        <div class="vu-meter-fill" style="height:${fillPercent}%; background: linear-gradient(to top, hsl(142,69%,45%) 0%, hsl(142,69%,45%) ${greenEnd}%, hsl(38,92%,50%) ${greenEnd}%, hsl(38,92%,50%) ${amberEnd}%, hsl(0,72%,51%) ${amberEnd}%, hsl(0,72%,51%) 100%);"></div>
        <div class="vu-meter-ticks">
          <div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div>
        </div>
      </div>
    </div>
  </div>`;
}

// --- Waveform display ---
export function waveformDisplay(data, height, isLive) {
  height = height || 160;
  const samples = data || [];
  const width = 100;
  const center = height / 2;
  const step = width / Math.max(1, samples.length - 1);

  let path = '';
  samples.forEach((v, i) => {
    const x = i * step;
    const y = center - v * (center * 0.85);
    path += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)} `;
  });
  const areaPath = `${path}L${width},${center} L0,${center} Z`;

  return `<div class="waveform-display" style="height:${height}px">
    <div class="waveform-grid"></div>
    <div class="waveform-center-line"></div>
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="width:100%;height:100%">
      <defs><linearGradient id="wf-grad-${Math.random()}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(142,69%,45%)" stop-opacity="0.4"/><stop offset="50%" stop-color="hsl(142,69%,45%)" stop-opacity="0.1"/><stop offset="100%" stop-color="hsl(142,69%,45%)" stop-opacity="0.4"/></linearGradient></defs>
      <path d="${areaPath}" fill="hsl(142,69%,45%)" fill-opacity="0.15"/>
      <path d="${path}" fill="none" stroke="hsl(142,69%,45%)" stroke-width="0.6" vector-effect="non-scaling-stroke"/>
    </svg>
    ${isLive ? '<div class="waveform-live-badge"><span class="pulse-dot"></span>LIVE</div>' : ''}
  </div>`;
}

// --- Spectrum display ---
export function spectrumDisplay(data, height, isLive) {
  height = height || 140;
  const bins = data || [];
  const freqLabels = ['31', '63', '125', '250', '500', '1k', '2k', '4k', '8k', '16k'];
  const labelStep = Math.ceil(bins.length / freqLabels.length);

  let bars = '';
  bins.forEach((bin) => {
    const h = Math.max(2, bin.magnitude * (height - 16));
    let color = 'var(--success)';
    if (bin.magnitude > 0.75) color = 'var(--error)';
    else if (bin.magnitude > 0.55) color = 'var(--warning)';
    bars += `<div class="spectrum-bar" style="height:${h}px;background:${color};opacity:0.8"></div>`;
  });

  let labels = '';
  freqLabels.forEach((f) => {
    labels += `<div class="spectrum-label">${f}</div>`;
  });

  return `<div class="spectrum-display" style="height:${height + 20}px">
    <div class="spectrum-bars" style="height:${height}px">${bars}</div>
    <div class="spectrum-labels">${labels}</div>
    ${isLive ? '<div class="waveform-live-badge"><span class="pulse-dot"></span>LIVE</div>' : ''}
  </div>`;
}

// --- Loading ---
export function loading(label) {
  return `<div class="loading"><div class="loading-spinner"></div><p class="loading-label">${label || 'Loading...'}</p></div>`;
}

// --- Empty state ---
export function emptyState(title, description, iconHtml) {
  return `<div class="empty-state">
    ${iconHtml ? `<div class="empty-state-icon">${iconHtml}</div>` : ''}
    <h3>${title}</h3>
    ${description ? `<p>${description}</p>` : ''}
  </div>`;
}

// --- Page header ---
export function pageHeader(title, description, iconHtml, actionsHtml) {
  return `<div class="page-header">
    <div class="page-header-left">
      ${iconHtml ? `<div class="page-header-icon">${iconHtml}</div>` : ''}
      <div><h1>${title}</h1>${description ? `<p>${description}</p>` : ''}</div>
    </div>
    ${actionsHtml ? `<div class="page-header-actions">${actionsHtml}</div>` : ''}
  </div>`;
}

// --- Demo banner ---
export function demoBanner(isDemo, message) {
  if (!isDemo) return '';
  return `<div class="demo-banner">${icon('database', 14)}<span>${message || 'Demo data - connect the Go API via VITE_API_BASE_URL to show live measurements.'}</span></div>`;
}

// --- Tooltip handler (called from onclick) ---
let tooltipEl = null;

export function showTooltip(event) {
  event.stopPropagation();
  const el = event.currentTarget;
  const text = el.getAttribute('data-tooltip');
  const analogy = el.getAttribute('data-analogy');
  if (!text) return;

  // Remove existing tooltip
  hideTooltip();

  tooltipEl = document.createElement('div');
  tooltipEl.className = 'tooltip-popup';
  tooltipEl.innerHTML = text + (analogy ? `<div class="tooltip-analogy">${analogy}</div>` : '');
  document.body.appendChild(tooltipEl);

  const rect = el.getBoundingClientRect();
  const tipRect = tooltipEl.getBoundingClientRect();
  let left = rect.left + rect.width / 2 - tipRect.width / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - tipRect.width - 8));
  let top = rect.top - tipRect.height - 8;
  if (top < 8) top = rect.bottom + 8;

  tooltipEl.style.left = left + 'px';
  tooltipEl.style.top = top + 'px';
  tooltipEl.classList.add('visible');

  // Close on click anywhere
  setTimeout(() => {
    document.addEventListener('click', hideTooltip, { once: true });
  }, 10);
}

export function hideTooltip() {
  if (tooltipEl) {
    tooltipEl.remove();
    tooltipEl = null;
  }
}

// --- Getting Started Guide ---
export function gettingStartedGuide(onNavigate) {
  const steps = [
    { icon: 'activity', title: '1. Take a Measurement', desc: 'Go to the Measurements page, pick where your microphone is, and press Start. SoundPilot will listen to your sound system and show you the results.', action: 'Go to Measurements', page: 'measurements' },
    { icon: 'bulb', title: '2. Understand the Results', desc: 'Look at the dashboard - it shows whether your sound is too loud, too quiet, distorted, or at risk of feedback. Green means good, yellow means watch out, red means fix it.', action: 'View Dashboard', page: 'dashboard' },
    { icon: 'sliders', title: '3. Make One Change', desc: 'Based on the Smart Suggestions, make one adjustment at a time - like turning down a monitor or cutting a frequency. Small, controlled steps are the key.', action: 'See Suggestions', page: 'engineering' },
    { icon: 'check', title: '4. Measure Again & Verify', desc: 'After your change, measure again. The Verification page compares before and after to confirm your change actually helped. Accept if it did, adjust if it did not.', action: 'Go to Verification', page: 'verification' },
  ];

  return `<div class="getting-started">
    <div class="getting-started-header">
      <span class="getting-started-title">${icon('help', 16)} New to SoundPilot? Here is how it works</span>
      <button class="icon-btn" onclick="this.closest('.getting-started').remove()" aria-label="Dismiss">${icon('x', 16)}</button>
    </div>
    <div class="getting-started-grid">
      ${steps.map((s) => `<div class="getting-started-step">
        <div class="getting-started-step-icon">${icon(s.icon, 18)}</div>
        <h4>${s.title}</h4>
        <p>${s.desc}</p>
        <button class="getting-started-step-link" onclick="SP.nav.go('${s.page}')">${s.action} ${icon('arrowRight', 12)}</button>
      </div>`).join('')}
    </div>
    <div class="getting-started-footer">${icon('book', 14)}<span>The whole process is: <strong>Measure, then Understand, then Adjust, then Verify.</strong> Repeat until everything is green.</span></div>
  </div>`;
}

// --- Workflow stepper ---
export function stepper(steps) {
  return `<div class="stepper">
    ${steps.map((s, i) => {
      const arrow = i < steps.length - 1 ? `<div class="stepper-arrow"><div class="stepper-line"></div>${icon('arrowRight', 14)}</div>` : '';
      return `<div class="stepper-step"><div class="stepper-circle">${icon(s.icon, 20)}</div><div><p class="stepper-label">${s.label}</p><p class="stepper-desc">${s.desc}</p></div></div>${arrow}`;
    }).join('')}
  </div>`;
}

// --- Signal chain visual ---
export function signalChainVisual(nodes) {
  const sorted = [...nodes].sort((a, b) => a.order - b.order);
  const typeColors = {
    microphone: 'var(--info)',
    mixer: 'var(--primary)',
    processor: '#a855f7',
    amplifier: 'var(--warning)',
    speaker: 'var(--success)',
    subwoofer: 'var(--success)',
    crossover: 'var(--info)',
    monitor: 'var(--info)',
  };
  return `<div class="signal-chain">
    ${sorted.map((node, i) => {
      const color = typeColors[node.type] || 'var(--primary)';
      const arrow = i < sorted.length - 1 ? `<div class="signal-chain-arrow"><div class="signal-chain-arrow-line"></div>${icon('arrowRight', 16)}</div>` : '';
      return `<div class="signal-chain-node" style="border-color:${color}33;background:${color}0d;color:${color}">
        ${icon(node.type, 24)}
        <div style="text-align:center"><p class="sc-label" style="color:var(--fg)">${node.label}</p><p class="sc-type">${node.type}</p></div>
      </div>${arrow}`;
    }).join('')}
  </div>`;
}

// --- Tabs ---
export function tabsRender(tabId, tabs, activeTab, renderContentFn) {
  return `<div class="tabs-list" data-tab-group="${tabId}">
    ${tabs.map((t) => `<button class="tab-trigger ${t.id === activeTab ? 'active' : ''}" onclick="SP.components.switchTab('${tabId}','${t.id}')">${t.label}</button>`).join('')}
  </div>
  ${tabs.map((t) => `<div class="tab-content ${t.id === activeTab ? 'active' : ''}" data-tab-content="${tabId}-${t.id}">${renderContentFn(t.id)}</div>`).join('')}
  </div>`;
}

export function switchTab(tabGroup, tabId) {
  // Update triggers
  document.querySelectorAll(`[data-tab-group="${tabGroup}"] .tab-trigger`).forEach((btn) => {
    btn.classList.toggle('active', btn.textContent.trim() === tabId || btn.getAttribute('onclick')?.includes(`'${tabId}'`));
  });
  // Update content
  document.querySelectorAll(`[data-tab-content^="${tabGroup}-"]`).forEach((content) => {
    content.classList.toggle('active', content.getAttribute('data-tab-content') === `${tabGroup}-${tabId}`);
  });
}
