// =========================================================================
// SoundPilot — Physical Venue Survey
// =========================================================================

import * as C from '../components.js';
import {
  getVenue,
  listVenueDimensionMeasurements,
  listVenues,
  saveVenueDimensionMeasurements,
} from '../data.js';

const DIMENSIONS = ['length', 'width', 'height'];
const state = {
  venue: null,
  venues: [],
  records: [],
  form: { length: '', width: '', height: '' },
  method: 'manual',
  confidence: 'needs_verification',
  source: 'Manual',
  notes: '',
  error: '',
  saving: false,
};

export async function render(container) {
  container.innerHTML = C.loading('Loading physical venue survey...');
  try {
    state.venues = await listVenues();
    const venueID = window.SP.selectedVenueId || state.venues[0]?.id;
    if (!venueID) {
      renderEmpty(container);
      return;
    }
    await loadVenue(container, venueID);
  } catch (error) {
    console.error('Failed to load physical survey:', error);
    container.innerHTML = `<div class="card card-content-pt"><p class="text-error">Could not load the venue survey: ${escapeHTML(error.message)}</p></div>`;
  }
}

async function loadVenue(container, venueID) {
  const [venue, records] = await Promise.all([
    getVenue(venueID),
    listVenueDimensionMeasurements(venueID),
  ]);
  state.venue = venue;
  state.records = records;
  state.form = {
    length: venue.length_meters || '',
    width: venue.width_meters || '',
    height: venue.height_meters || '',
  };
  state.error = '';
  renderPage(container);
}

function renderEmpty(container) {
  container.innerHTML = `
    ${C.pageHeader('Physical Venue Survey', 'Register a venue before measuring its physical space', C.icon('target', 20))}
    <div class="card card-content-pt">
      <p class="text-sm text-muted mb-4">There are no venues to survey yet.</p>
      <button class="btn btn-primary" onclick="SP.nav.go('venue')">Register a venue</button>
    </div>
  `;
}

function calculate() {
  const length = Number(state.form.length);
  const width = Number(state.form.width);
  const height = Number(state.form.height);
  return {
    length,
    width,
    height,
    floorArea: Number.isFinite(length) && Number.isFinite(width) && length > 0 && width > 0
      ? length * width
      : null,
    roomVolume: Number.isFinite(length) && Number.isFinite(width) && Number.isFinite(height)
      && length > 0 && width > 0 && height > 0
      ? length * width * height
      : null,
  };
}

function latestRecord(dimension) {
  return state.records.find((record) => record.dimension === dimension);
}

function dimensionStatus(dimension) {
  const record = latestRecord(dimension);
  if (!record) return '<span class="badge badge-outline">Not measured</span>';
  const label = record.confidence === 'needs_verification'
    ? 'Needs review'
    : record.confidence === 'excellent'
      ? 'Excellent'
      : 'Good';
  return `<span class="badge ${record.confidence === 'needs_verification' ? 'badge-warning' : 'badge-success'}">${label}</span>`;
}

function renderPage(container) {
  const calculated = calculate();
  const measurementRows = state.records.length
    ? state.records.map((record) => `
      <div class="flex items-center justify-between" style="border:1px solid var(--border);border-radius:8px;padding:12px;background:var(--bg-elevated)">
        <div>
          <p class="text-sm font-semibold">${capitalize(record.dimension)}: ${Number(record.value_meters).toFixed(2)} m</p>
          <p class="text-xs text-muted">${escapeHTML(record.method)} · ${escapeHTML(record.source)} · ${escapeHTML(record.confidence.replaceAll('_', ' '))}</p>
          ${record.notes ? `<p class="text-xs text-muted">${escapeHTML(record.notes)}</p>` : ''}
        </div>
        <span class="badge badge-outline">${new Date(record.measured_at).toLocaleString()}</span>
      </div>
    `).join('')
    : '<p class="text-sm text-muted">No physical measurements have been saved for this venue.</p>';

  container.innerHTML = `
    ${C.pageHeader('Physical Venue Survey', 'Measure the physical space before audio analysis', C.icon('target', 20))}

    <div class="card mb-4">
      <div class="card-content flex flex-wrap items-center justify-between gap-3" style="padding:16px">
        <div>
          <p class="text-xs uppercase tracking-wide text-muted">Venue</p>
          <h2 class="text-lg font-semibold">${escapeHTML(state.venue.name)}</h2>
          <p class="text-sm text-muted">${escapeHTML(state.venue.address)} · ${escapeHTML(state.venue.type)} · ${state.venue.measurement_unit}</p>
        </div>
        ${state.venues.length > 1 ? `
          <label class="field">
            <span>Survey venue</span>
            <select onchange="SP.physicalMeasurement.selectVenue(this.value)">
              ${state.venues.map((venue) => `<option value="${escapeHTML(venue.id)}" ${venue.id === state.venue.id ? 'selected' : ''}>${escapeHTML(venue.name)}</option>`).join('')}
            </select>
          </label>
        ` : ''}
      </div>
    </div>

    ${state.error ? `<div class="help-callout mb-4"><strong>Save failed:</strong> ${escapeHTML(state.error)}</div>` : ''}

    <div class="grid grid-3 mb-4">
      ${dimensionCard('Length', calculated.length, 'length')}
      ${dimensionCard('Width', calculated.width, 'width')}
      ${dimensionCard('Height', calculated.height, 'height')}
    </div>

    <div class="grid grid-2 mb-4">
      <div class="card">
        <div class="card-header"><span class="card-title">Venue dimensions</span></div>
        <div class="card-content space-y-4">
          <p class="text-sm text-muted">Enter measured values in metres. AR measurement is not available in this browser yet; use a manual reading or an external meter and record its source.</p>
          <div class="grid grid-2">
            ${DIMENSIONS.map((dimension) => `
              <label class="field">
                <span>${capitalize(dimension)} (m) ${dimensionStatus(dimension)}</span>
                <input type="number" min="0.01" step="0.01" value="${state.form[dimension]}" oninput="SP.physicalMeasurement.updateField('${dimension}', this.value)" />
              </label>
            `).join('')}
            <label class="field">
              <span>Measurement method</span>
              <select onchange="SP.physicalMeasurement.updateMetadata('method', this.value)">
                <option value="manual" ${state.method === 'manual' ? 'selected' : ''}>Manual entry</option>
                <option value="laser" ${state.method === 'laser' ? 'selected' : ''}>External laser meter</option>
              </select>
            </label>
            <label class="field">
              <span>Measurement source</span>
              <input type="text" value="${escapeHTML(state.source)}" oninput="SP.physicalMeasurement.updateMetadata('source', this.value)" required />
            </label>
            <label class="field">
              <span>Confidence</span>
              <select onchange="SP.physicalMeasurement.updateMetadata('confidence', this.value)">
                <option value="excellent" ${state.confidence === 'excellent' ? 'selected' : ''}>Excellent</option>
                <option value="good" ${state.confidence === 'good' ? 'selected' : ''}>Good</option>
                <option value="needs_verification" ${state.confidence === 'needs_verification' ? 'selected' : ''}>Needs verification</option>
              </select>
            </label>
            <label class="field" style="grid-column:1/-1">
              <span>Notes (optional)</span>
              <textarea rows="2" oninput="SP.physicalMeasurement.updateMetadata('notes', this.value)">${escapeHTML(state.notes)}</textarea>
            </label>
          </div>
          <div class="flex gap-2 flex-wrap">
            <button class="btn btn-success" ${state.saving ? 'disabled' : ''} onclick="SP.physicalMeasurement.save()">${state.saving ? 'Saving…' : 'Save raw measurements'}</button>
            <button class="btn btn-outline" onclick="SP.physicalMeasurement.reset()">Clear unsaved values</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">Calculated results</span></div>
        <div class="card-content space-y-3">
          <div style="border:1px solid var(--border);border-radius:8px;padding:12px;background:var(--bg-elevated)">
            <div class="text-xs uppercase tracking-wide text-muted">Floor area (length × width)</div>
            <div class="text-2xl font-bold" id="floor-area">${formatResult(calculated.floorArea)} m²</div>
          </div>
          <div style="border:1px solid var(--border);border-radius:8px;padding:12px;background:var(--bg-elevated)">
            <div class="text-xs uppercase tracking-wide text-muted">Room volume (length × width × height)</div>
            <div class="text-2xl font-bold" id="room-volume">${formatResult(calculated.roomVolume)} m³</div>
          </div>
          <p class="text-xs text-muted">Calculations use the latest saved dimensions. Raw measurement attempts are kept individually.</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">Raw measurement history</span></div>
      <div class="card-content space-y-3">${measurementRows}</div>
    </div>
  `;

  window.SP.physicalMeasurement = {
    updateField(dimension, value) {
      state.form[dimension] = value;
      const current = calculate();
      container.querySelector(`#${dimension}-value`).textContent = Number.isFinite(current[dimension]) && current[dimension] > 0
        ? `${current[dimension].toFixed(2)} m`
        : 'Not measured';
      container.querySelector(`#floor-area`).textContent = `${formatResult(current.floorArea)} m²`;
      container.querySelector(`#room-volume`).textContent = `${formatResult(current.roomVolume)} m³`;
    },
    updateMetadata(field, value) {
      state[field] = value;
    },
    async save() {
      const dimensions = DIMENSIONS
        .filter((dimension) => state.form[dimension] !== '' && state.form[dimension] !== null)
        .map((dimension) => ({
          dimension,
          value_meters: Number(state.form[dimension]),
          method: state.method,
          source: state.source.trim(),
          confidence: state.confidence,
          notes: state.notes.trim(),
        }));
      if (dimensions.length === 0 || dimensions.some((item) => !Number.isFinite(item.value_meters) || item.value_meters <= 0)) {
        state.error = 'Enter at least one positive, valid dimension before saving.';
        renderPage(container);
        return;
      }
      if (!state.source.trim()) {
        state.error = 'Measurement source is required.';
        renderPage(container);
        return;
      }

      state.saving = true;
      state.error = '';
      renderPage(container);
      try {
        await saveVenueDimensionMeasurements(state.venue.id, dimensions);
        await loadVenue(container, state.venue.id);
      } catch (error) {
        console.error('Failed to save venue dimensions:', error);
        state.error = error.message;
      } finally {
        state.saving = false;
        renderPage(container);
      }
    },
    async selectVenue(venueID) {
      window.SP.selectedVenueId = venueID;
      try {
        await loadVenue(container, venueID);
      } catch (error) {
        console.error('Failed to load selected venue:', error);
        state.error = error.message;
        renderPage(container);
      }
    },
    reset() {
      state.form = { length: '', width: '', height: '' };
      state.error = '';
      renderPage(container);
    },
  };
}

function dimensionCard(label, value, key) {
  const dimensionValue = Number.isFinite(value) && value > 0 ? `${value.toFixed(2)} m` : 'Not measured';
  return `<div class="card"><div class="card-content" style="padding:16px"><div class="flex items-center justify-between"><span class="text-xs uppercase tracking-wide text-muted">${label}</span>${dimensionStatus(key)}</div><div class="text-2xl font-bold" id="${key}-value">${dimensionValue}</div></div></div>`;
}

function formatResult(value) {
  return value === null ? '—' : value.toFixed(2);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]);
}
