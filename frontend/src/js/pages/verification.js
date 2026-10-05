// =========================================================================
// SoundPilot — Verification Page
// =========================================================================

import * as C from '../components.js';
import { fetchData } from '../data.js';

export async function render(container) {
  container.innerHTML = C.loading('Loading verification data...');

  const verifications = await fetchData('verifications');

  const accepted = verifications.filter((v) => v.status === 'accepted').length;
  const needsAdj = verifications.filter((v) => v.status === 'needs_adjustment').length;
  const rejected = verifications.filter((v) => v.status === 'rejected').length;

  const steps = [
    { icon: 'activity', label: 'Baseline', desc: 'Capture a reference measurement before any changes' },
    { icon: 'edit', label: 'Change', desc: 'Make one controlled adjustment at a time' },
    { icon: 'measurements', label: 'Measure', desc: 'Re-measure after the change' },
    { icon: 'compare', label: 'Compare', desc: 'Before vs. after vs. target' },
    { icon: 'shield', label: 'Verify', desc: 'Accept, adjust, or reject' },
  ];

  container.innerHTML = `
    ${C.pageHeader('Verification', 'Did your change actually work? Compare before and after to find out', C.icon('verification', 20))}

    ${C.demoBanner(true)}

    <!-- Help callout -->
    <div class="help-callout mb-4">
      ${C.icon('help', 20)}
      <div>
        <strong>What is verification?</strong> ${C.infoTooltip('verification')} After you make a change to your sound system (like turning down a monitor or adding an EQ filter), you measure again. This page compares the <strong>before</strong> and <strong>after</strong> values so you can prove the change actually helped. If it did, you <strong>Accept</strong>. If it helped but is not there yet, you <strong>Adjust</strong>. If it made things worse, you <strong>Reject</strong>.
      </div>
    </div>

    <!-- Workflow Stepper -->
    <div class="card mb-4">
      <div class="card-content-pt" style="padding:20px 16px">
        ${C.stepper(steps)}
      </div>
    </div>

    <!-- Summary -->
    <div class="grid grid-3 mb-4">
      <div class="card" style="border-color:rgba(34,197,94,0.3)">
        <div class="card-content-pt flex items-center gap-3" style="padding:16px">
          ${C.icon('checkCircle', 20)}
          <div><p class="mono text-xl font-bold text-success">${accepted}</p><p class="text-xs text-muted">Accepted</p></div>
        </div>
      </div>
      <div class="card" style="border-color:rgba(234,179,8,0.3)">
        <div class="card-content-pt flex items-center gap-3" style="padding:16px">
          ${C.icon('edit', 20)}
          <div><p class="mono text-xl font-bold text-warning">${needsAdj}</p><p class="text-xs text-muted">Needs Adjustment</p></div>
        </div>
      </div>
      <div class="card" style="border-color:rgba(239,68,68,0.3)">
        <div class="card-content-pt flex items-center gap-3" style="padding:16px">
          <div style="border-radius:6px;background:rgba(239,68,68,0.1);padding:6px">${C.icon('minus', 16)}</div>
          <div><p class="mono text-xl font-bold text-error">${rejected}</p><p class="text-xs text-muted">Rejected</p></div>
        </div>
      </div>
    </div>

    <!-- Verification Table -->
    <div class="card mb-4">
      <div class="card-header"><div><span class="card-title">Verification Results</span><p class="text-xs text-muted mt-1">Before vs. After vs. Target for each parameter</p></div></div>
      <div class="card-content space-y-3">
        ${verifications.length === 0 ? C.emptyState('No verifications', 'No verification data for this session.') :
          verifications.map((v) => {
            const improved = Math.abs(v.after - v.target) < Math.abs(v.before - v.target);
            const deltaIcon = v.delta > 0 ? 'trendUp' : v.delta < 0 ? 'trendDown' : 'minus';
            return `<div class="row-grid" style="grid-template-columns:1fr;align-items:start">
              <div>
                <p class="text-sm font-semibold">${v.parameter}</p>
                <p class="text-xs text-muted mt-1">${v.note}</p>
                <div class="flex items-center gap-4 mt-2 text-xs flex-wrap">
                  <span class="text-muted">Before: <span class="mono">${v.before.toFixed(1)} ${v.unit}</span></span>
                  <span class="${improved ? 'text-success' : 'text-error'}">After: <span class="mono font-bold">${v.after.toFixed(1)} ${v.unit}</span></span>
                  <span class="${improved ? 'text-success' : 'text-error'} flex items-center gap-1">${C.icon(deltaIcon, 12)}<span class="mono">${v.delta > 0 ? '+' : ''}${v.delta.toFixed(1)}</span></span>
                  <span class="text-muted">Target: <span class="mono text-primary">${v.target} ${v.unit}</span></span>
                </div>
                <div class="mt-2">${C.statusBadge(v.status)}</div>
              </div>
            </div>`;
          }).join('')}
      </div>
    </div>

    <!-- Status Legend -->
    <div class="card">
      <div class="card-content-pt flex flex-wrap items-center gap-4 text-sm" style="padding:16px">
        <span class="text-xs font-medium text-muted uppercase tracking-wide">Status Legend:</span>
        <div class="flex items-center gap-2"><div class="status-dot success"></div><span><strong>Accepted</strong> — After value is within tolerance of target</span></div>
        <div class="flex items-center gap-2"><div class="status-dot warning"></div><span><strong>Needs Adjustment</strong> — Improved but not yet within tolerance</span></div>
        <div class="flex items-center gap-2"><div class="status-dot error"></div><span><strong>Rejected</strong> — No improvement or adjustment pending</span></div>
      </div>
    </div>
  `;
}
