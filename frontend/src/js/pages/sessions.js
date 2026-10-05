// =========================================================================
// SoundPilot — Sessions Page
// =========================================================================

import * as C from '../components.js';
import { fetchData } from '../data.js';

export async function render(container) {
  container.innerHTML = C.loading('Loading sessions...');

  const sessions = await fetchData('sessions');

  const active = sessions.filter((s) => s.status === 'active');
  const completed = sessions.filter((s) => s.status === 'completed');
  const archived = sessions.filter((s) => s.status === 'archived');

  container.innerHTML = `
    ${C.pageHeader('Sessions', 'Your measurement session history — each session groups together all measurements taken during one work period', C.icon('sessions', 20))}

    ${C.demoBanner(true)}

    <!-- Help callout -->
    <div class="help-callout mb-4">
      ${C.icon('help', 20)}
      <div>
        <strong>What is a session?</strong> ${C.infoTooltip('session')} A session is a period of work — like a rehearsal, a service, or a tuning session. All the measurements you take during that time are saved together. This makes it easy to look back and see what you did and what the results were.
      </div>
    </div>

    <!-- Active Sessions -->
    ${active.length > 0 ? `<h2 class="text-sm font-semibold text-muted uppercase tracking-wide mb-3 flex items-center gap-2">${C.icon('activity', 16)} Active Now</h2>
    <div class="grid grid-2 mb-4">
      ${active.map((s) => sessionCard(s)).join('')}
    </div>` : ''}

    <!-- Completed Sessions -->
    ${completed.length > 0 ? `<h2 class="text-sm font-semibold text-muted uppercase tracking-wide mb-3 flex items-center gap-2">${C.icon('checkCircle', 16)} Completed</h2>
    <div class="grid grid-2 mb-4">
      ${completed.map((s) => sessionCard(s)).join('')}
    </div>` : ''}

    <!-- Archived Sessions -->
    ${archived.length > 0 ? `<h2 class="text-sm font-semibold text-muted uppercase tracking-wide mb-3 flex items-center gap-2">${C.icon('book', 16)} Archived</h2>
    <div class="grid grid-2 mb-4">
      ${archived.map((s) => sessionCard(s)).join('')}
    </div>` : ''}

    ${sessions.length === 0 ? C.emptyState('No sessions yet', 'Start a measurement session from the Measurements page.') : ''}
  `;
}

function sessionCard(s) {
  const duration = s.endedAt ? Math.round((new Date(s.endedAt) - new Date(s.startedAt)) / 60000) : null;
  return `<div class="card card-clickable" onclick="SP.nav.go('measurements')">
    <div class="card-content-pt" style="padding:16px">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-semibold">${s.name}</h3>
        ${C.statusIndicator(s.status)}
      </div>
      <p class="text-xs text-muted mb-3">${s.notes || ''}</p>
      <div class="flex items-center gap-4 text-xs text-muted flex-wrap">
        <span class="flex items-center gap-1">${C.icon('user', 12)} ${s.engineerName}</span>
        <span class="flex items-center gap-1">${C.icon('calendar', 12)} ${new Date(s.startedAt).toLocaleDateString()}</span>
        <span class="flex items-center gap-1">${C.icon('activity', 12)} ${s.measurementCount} measurements</span>
        ${duration ? `<span class="flex items-center gap-1">${C.icon('clock', 12)} ${duration} min</span>` : ''}
      </div>
    </div>
  </div>`;
}
