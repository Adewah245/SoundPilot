// =========================================================================
// SoundPilot — Engineering Page
// =========================================================================

import * as C from '../components.js';
import { fetchData } from '../data.js';

export async function render(container) {
  container.innerHTML = C.loading('Loading engineering analysis...');

  const [profiles, results, suggestions] = await Promise.all([
    fetchData('profiles', 'v-001'),
    fetchData('results'),
    fetchData('suggestions'),
  ]);

  const accepted = results.filter((r) => r.status === 'accepted').length;
  const needsAdj = results.filter((r) => r.status === 'needs_adjustment').length;
  const rejected = results.filter((r) => r.status === 'rejected').length;

  const tabsContent = (tabId) => {
    if (tabId === 'results') return resultsTab(results, profiles);
    if (tabId === 'targets') return targetsTab(profiles);
    if (tabId === 'suggestions') return suggestionsTab(suggestions);
    return '';
  };

  container.innerHTML = `
    ${C.pageHeader('Engineering', 'See how your sound measures up against your targets — and get plain-language recommendations on what to fix', C.icon('engineering', 20))}

    ${C.demoBanner(true)}

    <!-- Help callout -->
    <div class="help-callout mb-4">
      ${C.icon('help', 20)}
      <div>
        <strong>What is this page?</strong> This page compares your actual sound measurements against your <strong>target values</strong> ${C.infoTooltip('target')} — the goals you want to hit. Green means you are on target. Yellow means you are close. Red means something needs fixing. The <strong>Smart Suggestions</strong> ${C.infoTooltip('smartSuggestion')} tab tells you exactly what to do, in order of urgency.
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-3 mb-4">
      <div class="card" style="border-color:rgba(34,197,94,0.3)">
        <div class="card-content-pt flex items-center gap-3" style="padding:16px">
          <div style="border-radius:6px;background:rgba(34,197,94,0.1);padding:10px">${C.icon('checkCircle', 20)}</div>
          <div><p class="mono text-2xl font-bold text-success">${accepted}</p><p class="text-xs text-muted">Accepted ${C.infoTooltip('tolerance')}</p></div>
        </div>
      </div>
      <div class="card" style="border-color:rgba(234,179,8,0.3)">
        <div class="card-content-pt flex items-center gap-3" style="padding:16px">
          <div style="border-radius:6px;background:rgba(234,179,8,0.1);padding:10px">${C.icon('alert', 20)}</div>
          <div><p class="mono text-2xl font-bold text-warning">${needsAdj}</p><p class="text-xs text-muted">Needs Adjustment</p></div>
        </div>
      </div>
      <div class="card" style="border-color:rgba(239,68,68,0.3)">
        <div class="card-content-pt flex items-center gap-3" style="padding:16px">
          <div style="border-radius:6px;background:rgba(239,68,68,0.1);padding:10px">${C.icon('x', 20)}</div>
          <div><p class="mono text-2xl font-bold text-error">${rejected}</p><p class="text-xs text-muted">Rejected</p></div>
        </div>
      </div>
    </div>

    ${C.tabsRender('eng', [
      { id: 'results', label: 'Analysis Results' },
      { id: 'targets', label: 'Target Profile' },
      { id: 'suggestions', label: 'Smart Suggestions' },
    ], 'results', tabsContent)}
  `;
}

function resultsTab(results, profiles) {
  if (results.length === 0) return C.emptyState('No results', 'No engineering results for this session.');

  return `<div class="card">
    <div class="card-header"><span class="card-title flex items-center gap-2">${C.icon('target', 16)} Parameter Analysis — ${profiles[0]?.name || 'Standard Profile'}</span></div>
    <div class="card-content space-y-3">
      ${results.map((r) => {
        const deviation = Math.abs(r.actual - r.target);
        const withinTol = deviation <= r.tolerance;
        return `<div class="row-grid" style="grid-template-columns:1fr;align-items:start">
          <div>
            <p class="text-sm font-semibold">${r.parameter}</p>
            <div class="flex items-center gap-4 mt-1 text-xs">
              <span class="text-muted">Target: <span class="mono">${r.target} ${r.unit}</span></span>
              <span class="${withinTol ? 'text-success' : 'text-error'}">Actual: <span class="mono font-bold">${r.actual.toFixed(1)} ${r.unit}</span></span>
              <span class="text-muted">Tolerance: <span class="mono">±${r.tolerance}</span></span>
            </div>
            <p class="text-xs text-muted mt-2">${r.finding}</p>
            ${r.recommendation !== 'No action required.' ? `<p class="text-xs text-primary mt-1 flex items-start gap-1">${C.icon('wrench', 12)} ${r.recommendation}</p>` : ''}
            <div class="mt-2">${C.statusBadge(r.status)}</div>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function targetsTab(profiles) {
  return profiles.map((profile) => `<div class="card mb-4">
    <div class="card-header"><div><span class="card-title">${profile.name}</span><p class="text-xs text-muted mt-1">${profile.description}</p></div></div>
    <div class="card-content">
      <div class="grid grid-3" style="gap:12px">
        ${profile.targets.map((t) => `<div style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:12px">
          <div class="flex items-center justify-between"><span class="text-sm font-medium">${t.parameter}</span>${C.icon('target', 14)}</div>
          <div class="mt-2 flex items-baseline gap-1"><span class="mono text-lg font-bold text-primary">${t.target}</span><span class="text-xs text-muted">${t.unit}</span><span class="text-xs text-muted" style="margin-left:8px">±${t.tolerance}</span></div>
        </div>`).join('')}
      </div>
    </div>
  </div>`).join('');
}

function suggestionsTab(suggestions) {
  if (suggestions.length === 0) return C.emptyState('No suggestions needed', 'All measurements are within target parameters.', C.icon('checkCircle', 24));

  return `<div class="card">
    <div class="card-header"><div><span class="card-title flex items-center gap-2">${C.icon('bulb', 16)} Smart Suggestions</span><p class="text-xs text-muted mt-1">Plain-language recommendations based on your current measurement data, sorted by urgency.</p></div></div>
    <div class="card-content space-y-3">
      ${suggestions.map((sug) => `<div style="border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);padding:16px">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h4 class="text-sm font-semibold">${sug.title}</h4>
              <span class="badge ${sug.priority === 'high' ? 'badge-error' : sug.priority === 'medium' ? 'badge-warning' : 'badge-info'}" style="font-size:10px">${sug.priority} priority</span>
              <span class="badge badge-outline" style="font-size:10px;text-transform:capitalize">${sug.category}</span>
            </div>
            <p class="text-xs text-muted">${sug.description}</p>
            <div class="mt-2 flex items-center gap-2" style="background:rgba(34,197,94,0.05);border:1px solid rgba(34,197,94,0.2);border-radius:4px;padding:8px 12px">
              ${C.icon('arrowRight', 14)}<span class="text-sm text-primary font-medium">${sug.action}</span>
            </div>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>`;
}
