// =========================================================================
// SoundPilot — Equipment Page
// =========================================================================

import * as C from '../components.js';
import { fetchData } from '../data.js';

let activeFilter = 'all';

export async function render(container) {
  container.innerHTML = C.loading('Loading equipment...');

  const [equipment, signalChain] = await Promise.all([
    fetchData('equipment', 'v-001'),
    fetchData('signalChain', 'v-001'),
  ]);

  renderEquipment(container, equipment, signalChain);
}

function renderEquipment(container, equipment, signalChain) {
  const types = ['all', ...new Set(equipment.map((e) => e.type))];
  const filtered = activeFilter === 'all' ? equipment : equipment.filter((e) => e.type === activeFilter);

  const typeIcons = {
    speaker: 'speaker', subwoofer: 'speaker', mixer: 'sliders', amplifier: 'amp',
    processor: 'cpu', crossover: 'cpu', microphone: 'mic', monitor: 'headphones',
  };

  container.innerHTML = `
    ${C.pageHeader('Equipment', 'All your sound gear in one place — speakers, mixers, amps, and the path your signal travels', C.icon('equipment', 20))}

    ${C.demoBanner(true)}

    <!-- Signal Chain -->
    ${signalChain ? `<div class="card mb-4">
      <div class="card-header"><span class="card-title flex items-center gap-2">${C.icon('zap', 16)} ${signalChain.name} ${C.infoTooltip('signalChain')}</span></div>
      <div class="card-content">${C.signalChainVisual(signalChain.nodes)}</div>
    </div>` : ''}

    <!-- Help callout -->
    <div class="help-callout mb-4">
      ${C.icon('help', 20)}
      <div>
        <strong>What is a signal chain?</strong> ${C.infoTooltip('signalChain')} It is the path sound takes from the microphone to the speakers. Each piece of equipment in the chain can affect the sound. Tap the filter chips below to see specific types of equipment.
      </div>
    </div>

    <!-- Filter Chips -->
    <div class="filter-chips">
      ${types.map((t) => `<button class="filter-chip ${t === activeFilter ? 'active' : ''}" onclick="SP.equipment.filter('${t}')">${t === 'all' ? 'All Equipment' : t.replace('_', ' ')}</button>`).join('')}
    </div>

    <!-- Equipment Grid -->
    <div class="grid grid-3">
      ${filtered.map((eq) => {
        const typeIcon = typeIcons[eq.type] || 'package';
        return `<div class="equipment-card">
          <div class="flex items-start gap-3 mb-3">
            <div class="equipment-icon-box">${C.icon(typeIcon, 20)}</div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between"><h3 class="text-sm font-semibold truncate">${eq.name}</h3>${C.statusIndicator(eq.status)}</div>
              <p class="text-xs text-muted mt-1">${eq.brand} ${eq.model} ${eq.quantity > 1 ? `× ${eq.quantity}` : ''}</p>
            </div>
          </div>
          <div class="equipment-specs">
            ${Object.entries(eq.specs).map(([k, v]) => `<div class="equipment-spec-row"><span class="equipment-spec-key">${k.replace(/([A-Z])/g, ' $1').trim()}</span><span class="equipment-spec-val">${v}</span></div>`).join('')}
          </div>
          ${eq.notes ? `<p class="text-xs text-muted mt-2" style="border-top:1px solid var(--border);padding-top:8px">${eq.notes}</p>` : ''}
        </div>`;
      }).join('')}
    </div>
  `;

  window.SP.equipment = {
    filter: (type) => { activeFilter = type; renderEquipment(container, equipment, signalChain); },
  };
}
