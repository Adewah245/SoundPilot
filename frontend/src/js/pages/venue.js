// =========================================================================
// SoundPilot — Venue Page
// =========================================================================

import * as C from '../components.js';
import { createVenue, fetchData, listVenues } from '../data.js';

let selectedVenueId = '';

export async function render(container) {
  container.innerHTML = C.loading('Loading venues...');

  try {
    const venues = await listVenues();
    selectedVenueId = window.SP.selectedVenueId || selectedVenueId || venues[0]?.id || '';
    window.SP.selectedVenueId = selectedVenueId;
    await renderVenueData(container, venues, selectedVenueId);
  } catch (error) {
    console.error('Failed to load venues:', error);
    container.innerHTML = `<div class="card card-content-pt"><p class="text-error">Could not load venues: ${error.message}</p></div>`;
  }
}

async function renderVenueData(container, venues, venueId) {
  const [zones, points] = await Promise.all([
    fetchData('zones', venueId),
    fetchData('points', venueId),
  ]);
  const venue = venues.find((v) => v.id === venueId);

  container.innerHTML = `
    ${C.pageHeader('Venue', 'Venue structure: zones and measurement points', C.icon('venue', 20))}

  <div class="card mb-4">
    <div class="card-header"><span class="card-title flex items-center gap-2">${C.icon('plus', 16)} Register New Venue</span></div>
    <div class="card-content">
      <form onsubmit="event.preventDefault(); SP.venue.create(this);" class="grid grid-2" style="gap:12px">
        <label class="field">
          <span>Venue Name</span>
          <input name="name" type="text" placeholder="Venue name" required />
        </label>
        <label class="field">
          <span>Venue Type</span>
          <select name="type">
            <option value="Church">Church</option>
            <option value="Auditorium">Auditorium</option>
            <option value="Event Centre">Event Centre</option>
            <option value="Conference Hall">Conference Hall</option>
            <option value="School Hall">School Hall</option>
            <option value="Theatre">Theatre</option>
            <option value="Outdoor">Outdoor</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label class="field" style="grid-column: 1 / -1;">
          <span>Location / Address</span>
          <input name="address" type="text" placeholder="Location / address" required />
        </label>
        <label class="field">
          <span>Measurement Unit</span>
          <select name="measurement_unit">
            <option value="m">Metres (m)</option>
          </select>
        </label>
        <label class="field" style="grid-column: 1 / -1;">
          <span>Description</span>
          <textarea name="description" rows="3" placeholder="Primary worship auditorium with full-range PA..."></textarea>
        </label>
        <div style="grid-column: 1 / -1; display:flex; justify-content:flex-start;">
          <button type="submit" class="btn btn-primary">Create Venue & Start Survey</button>
        </div>
      </form>
    </div>
  </div>

  <div class="grid grid-2" style="grid-template-columns:1fr">
  <style>@media(min-width:1024px){.venue-grid{display:grid;grid-template-columns:1fr 2fr;gap:16px}}</style>
  <div class="venue-grid" style="gap:16px">
    <!-- Venue list -->
    <div class="card">
      <div class="card-header"><span class="card-title flex items-center gap-2">${C.icon('map', 16)} Venues</span></div>
      <div class="card-content space-y-2">
        ${venues.map((v) => {
          const active = v.id === selectedVenueId;
          const venueType = v.type || 'venue';
          return `<button onclick="SP.venue.select('${v.id}')" style="width:100%;text-align:left;border:1px solid ${active ? 'rgba(34,197,94,0.3)' : 'var(--border)'};border-radius:6px;padding:12px;background:${active ? 'rgba(34,197,94,0.05)' : 'var(--bg-elevated)'};transition:all 0.2s;cursor:pointer">
            <div class="flex items-center justify-between"><span class="text-sm font-semibold">${v.name}</span>${active ? C.icon('arrowRight', 16) : ''}</div>
            <div class="flex items-center gap-3 mt-1 text-xs text-muted"><span class="flex items-center gap-1">${C.icon('users', 12)} ${v.capacity?.toLocaleString ? v.capacity.toLocaleString() : '—'}</span><span style="text-transform:capitalize">${venueType}</span></div>
          </button>`;
        }).join('')}
      </div>
    </div>

    <!-- Venue detail + zones -->
    <div class="space-y">
        <div class="card">
          <div class="card-header">
            <div class="flex items-center justify-between"><span class="card-title text-lg">${venue?.name || 'Select a venue'}</span><span class="badge badge-outline" style="text-transform:capitalize">${venue?.venue_type || venue?.type || 'venue'}</span></div>
          </div>
          <div class="card-content">
            <p class="text-sm text-muted">${venue?.description || 'No description available.'}</p>
            <hr class="separator"/>
            <div class="flex flex-wrap gap-4 text-sm">
              <div class="flex items-center gap-2">${C.icon('map', 14)}<span class="text-muted">Address:</span><span>${venue?.address || 'Not set'}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted">Unit:</span><span>${venue?.measurement_unit || 'm'}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted">Dimensions:</span><span>${venue?.length_meters || '—'} × ${venue?.width_meters || '—'} × ${venue?.height_meters || '—'} ${venue?.measurement_unit || 'm'}</span></div>
              <div class="flex items-center gap-2">${C.icon('users', 14)}<span class="text-muted">Capacity:</span><span>${venue?.capacity?.toLocaleString ? venue.capacity.toLocaleString() : 'Not set'}</span></div>
              <div class="flex items-center gap-2">${C.icon('layers', 14)}<span class="text-muted">Zones:</span><span>${zones.length}</span></div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title flex items-center gap-2">${C.icon('layers', 16)} Zones</span></div>
          <div class="card-content space-y-2">
            ${zones.length === 0 ? C.emptyState('No zones', 'This venue has no zones configured.') :
              zones.map((zone) => {
                const zonePoints = points.filter((p) => p.zoneId === zone.id);
                const stats = { optimal: 0, warning: 0, critical: 0, idle: 0 };
                zonePoints.forEach((p) => { if (stats[p.status] !== undefined) stats[p.status]++; });
                return `<div style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);overflow:hidden" id="zone-${zone.id}">
                  <button onclick="SP.venue.toggleZone('${zone.id}')" style="width:100%;flex:1;flex items:center;justify-content:space-between;padding:12px;text-align:left;cursor:pointer;background:none;border:none;color:inherit">
                    <div class="flex items-center gap-3">
                      <div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:6px;background:rgba(34,197,94,0.1);color:var(--primary);font-family:var(--font-mono);font-size:12px;font-weight:700">${zone.order}</div>
                      <div><p class="text-sm font-semibold">${zone.name}</p><p class="text-xs text-muted">${zone.description}</p></div>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="hidden-mobile flex items-center gap-2 text-xs">
                        ${stats.optimal > 0 ? '<span class="flex items-center gap-1 text-success"><span class="status-dot success"></span>' + stats.optimal + '</span>' : ''}
                        ${stats.warning > 0 ? '<span class="flex items-center gap-1 text-warning"><span class="status-dot warning"></span>' + stats.warning + '</span>' : ''}
                        ${stats.critical > 0 ? '<span class="flex items-center gap-1 text-error"><span class="status-dot error"></span>' + stats.critical + '</span>' : ''}
                        ${stats.idle > 0 ? '<span class="flex items-center gap-1 text-muted"><span class="status-dot neutral"></span>' + stats.idle + '</span>' : ''}
                      </div>
                      <span id="zone-arrow-${zone.id}" style="transition:transform 0.2s">${C.icon('arrowRight', 16)}</span>
                    </div>
                  </button>
                  <div id="zone-points-${zone.id}" class="hidden" style="border-top:1px solid var(--border);padding:12px;background:rgba(22,26,32,0.5)">
                    <p class="text-xs font-medium text-muted uppercase tracking-wide mb-3">Measurement Points</p>
                    <div class="space-y-2">
                      ${zonePoints.length === 0 ? '<p class="text-xs text-muted">No measurement points in this zone.</p>' :
                        zonePoints.map((point) => `<div class="flex items-center justify-between" style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:10px">
                          <div class="flex items-center gap-3">${C.icon('crosshair', 14)}<div><p class="text-sm font-medium">${point.name}</p><p class="text-xs text-muted">${point.location}</p></div></div>
                          ${C.statusIndicator(point.status)}
                        </div>`).join('')}
                    </div>
                  </div>
                </div>`;
              }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Store venues for re-render
  window.SP.venue = {
    select: (id) => {
      selectedVenueId = id;
      window.SP.selectedVenueId = id;
      renderVenueData(container, venues, id);
    },
    create: async (form) => {
      const payload = {
        name: form.elements.namedItem('name').value.trim(),
        type: form.elements.namedItem('type').value,
        address: form.elements.namedItem('address').value.trim(),
        measurement_unit: form.elements.namedItem('measurement_unit').value,
        description: form.elements.namedItem('description').value.trim(),
      };
      if (!payload.name || !payload.type || !payload.address) {
        alert('Venue name, type, and address are required.');
        return;
      }

      try {
        const created = await createVenue(payload);
        selectedVenueId = created.id;
        window.SP.selectedVenueId = created.id;
        window.SP.nav.go('physical-measurement');
      } catch (error) {
        console.error('Failed to create venue:', error);
        alert(error.message || 'Could not create venue.');
      }
    },
    toggleZone: (zoneId) => {
      const el = document.getElementById(`zone-points-${zoneId}`);
      const arrow = document.getElementById(`zone-arrow-${zoneId}`);
      if (el.classList.contains('hidden')) {
        el.classList.remove('hidden');
        arrow.style.transform = 'rotate(90deg)';
      } else {
        el.classList.add('hidden');
        arrow.style.transform = '';
      }
    },
  };
}
