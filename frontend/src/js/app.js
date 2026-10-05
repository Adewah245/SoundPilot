// =========================================================================
// SoundPilot — App Shell: Navigation, Sidebar, Routing
// =========================================================================

import * as C from './components.js';
import { fetchData, ALERTS } from './data.js';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', desc: 'System overview' },
  { id: 'venue', label: 'Venue', icon: 'venue', desc: 'Zones & measurement points' },
  { id: 'physical-measurement', label: 'Physical Measurement', icon: 'target', desc: 'Dimensions, area & volume' },
  { id: 'measurements', label: 'Measurements', icon: 'measurements', desc: 'Live measurement workspace' },
  { id: 'engineering', label: 'Engineering', icon: 'engineering', desc: 'Analysis & smart suggestions' },
  { id: 'verification', label: 'Verification', icon: 'verification', desc: 'Before / after comparison' },
  { id: 'equipment', label: 'Equipment', icon: 'equipment', desc: 'Gear & signal chain' },
  { id: 'sessions', label: 'Sessions', icon: 'sessions', desc: 'Measurement session history' },
  { id: 'ai-assistant', label: 'AI Assistant', icon: 'ai', desc: 'SoundPilot engineering assistant' },
  { id: 'settings', label: 'Settings', icon: 'settings', desc: 'Configuration & API' },
];

let currentPage = 'dashboard';
let appContext = { venue: null, session: null, alertCount: 0, isDemo: true, apiConnected: false };

// --- Render sidebar nav menu ---
function renderNav() {
  const menu = document.getElementById('nav-menu');
  menu.innerHTML = NAV_ITEMS.map((item) => {
    const active = currentPage === item.id;
    return `<button class="nav-item ${active ? 'active' : ''}" onclick="SP.nav.go('${item.id}')">
      <span class="nav-item-icon">${C.icon(item.icon, 18)}</span>
      <span class="nav-item-content"><span class="nav-item-label">${item.label}</span><span class="nav-item-desc">${item.desc}</span></span>
      ${active ? '<span class="nav-item-dot"></span>' : ''}
    </button>`;
  }).join('');
}

// --- Navigate to page ---
function go(pageId) {
  currentPage = pageId;
  renderNav();
  updateTopbar();
  closeMobile();

  const content = document.getElementById('page-content');
  content.innerHTML = C.loading('Loading...');

  // Import page module and render
  import(`./pages/${pageId}.js`)
    .then((mod) => {
      content.innerHTML = '';
      content.classList.remove('fade-in');
      void content.offsetWidth; // force reflow
      content.classList.add('fade-in');
      mod.render(content);
    })
    .catch((err) => {
      console.error('Failed to load page:', pageId, err);
      content.innerHTML = `<div class="card card-content-pt"><p>Failed to load page. Please try again.</p></div>`;
    });
}

// --- Update topbar context ---
function updateTopbar() {
  const ctx = document.getElementById('topbar-context');
  let html = '';
  if (appContext.venue) {
    html += `<span class="ctx-label">Venue:</span> <strong>${appContext.venue}</strong>`;
  }
  if (appContext.venue && appContext.session) {
    html += `<span class="ctx-sep">·</span>`;
  }
  if (appContext.session) {
    html += `<span class="ctx-label">Session:</span> <strong>${appContext.session}</strong>`;
  }
  ctx.innerHTML = html;

  // API status badge
  const apiBadge = document.getElementById('api-status-badge');
  if (appContext.isDemo) {
    apiBadge.className = 'badge badge-warning';
    apiBadge.innerHTML = `${C.icon('wifiOff', 12)} Demo Mode`;
  } else {
    apiBadge.className = 'badge badge-success';
    apiBadge.innerHTML = `${C.icon('wifi', 12)} API Connected`;
  }

  // DSP badge
  const dspBadge = document.getElementById('dsp-badge');
  if (appContext.apiConnected) {
    dspBadge.style.display = 'inline-flex';
  } else {
    dspBadge.style.display = 'none';
  }

  // Alert count
  const alertEl = document.getElementById('alert-count');
  if (appContext.alertCount > 0) {
    alertEl.textContent = appContext.alertCount;
    alertEl.classList.add('visible');
  } else {
    alertEl.classList.remove('visible');
  }
}

// --- Mobile nav ---
function openMobile() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('nav-overlay').classList.add('open');
}
function closeMobile() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('nav-overlay').classList.remove('open');
}

// --- Init ---
async function init() {
  // Load context data
  const [health, venue, sessions, alerts] = await Promise.all([
    fetchData('health'),
    fetchData('venue', 'v-001'),
    fetchData('sessions', 'v-001'),
    fetchData('alerts', 'v-001'),
  ]);

  appContext.isDemo = !health.apiConnected;
  appContext.apiConnected = health.apiConnected && health.dspEngineOnline;
  appContext.venue = venue?.name;
  const activeSession = sessions.find((s) => s.status === 'active');
  appContext.session = activeSession?.name;
  appContext.alertCount = alerts.filter((a) => !a.acknowledged).length;

  renderNav();
  updateTopbar();
  go('dashboard');
}

// --- Expose to global scope for onclick handlers ---
window.SP = window.SP || {};
window.SP.nav = { go, openMobile, closeMobile };
window.SP.components = { showTooltip: C.showTooltip, switchTab: C.switchTab };

// Start the app
init();
