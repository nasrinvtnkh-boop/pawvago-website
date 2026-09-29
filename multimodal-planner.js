(() => {
  const MODES = [
    { id: 'air', icon: '✈', label: 'Flight', hint: 'Airline & cabin rules' },
    { id: 'rail', icon: '🚆', label: 'Train', hint: 'Rail operator policies' },
    { id: 'road', icon: '🚗', label: 'Car', hint: 'Cross-border road travel' },
    { id: 'sea', icon: '⛴', label: 'Ferry / Ship', hint: 'Ferry & pet cabin rules' },
    { id: 'multimodal', icon: '⇄', label: 'Multimodal', hint: 'Combine multiple transport modes' }
  ];

  function addStyles() {
    if (document.getElementById('pvMultimodalStyles')) return;
    const style = document.createElement('style');
    style.id = 'pvMultimodalStyles';
    style.textContent = `
      .pv-mode-label{display:block;margin:14px 0 8px;font-weight:700}.pv-mode-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:14px}.pv-mode-btn{border:1px solid rgba(15,23,42,.12);background:#fff;border-radius:14px;padding:12px 8px;cursor:pointer;text-align:center;color:#10172A}.pv-mode-btn b{display:block;font-size:1.35rem;margin-bottom:4px}.pv-mode-btn span{display:block;font-size:.78rem;font-weight:800}.pv-mode-btn small{display:block;font-size:.66rem;opacity:.58;margin-top:3px}.pv-mode-btn.active{background:#10172A;color:#fff;border-color:#10172A}.pv-mode-summary{padding:11px 13px;border-radius:12px;background:#f5f7fb;margin:0 0 14px;font-size:.84rem}.pv-segment-builder{display:none;padding:13px;border:1px dashed rgba(15,23,42,.18);border-radius:14px;margin-bottom:14px}.pv-segment-builder.show{display:block}.pv-segment-builder strong{display:block;margin-bottom:7px}.pv-segment-chips{display:flex;gap:6px;flex-wrap:wrap}.pv-segment-chips span{padding:6px 9px;border-radius:999px;background:#eef2f7;font-size:.75rem;font-weight:700}@media(max-width:720px){.pv-mode-grid{grid-template-columns:repeat(2,1fr)}}`;
    document.head.appendChild(style);
  }

  function selectedMode() {
    return localStorage.getItem('pawvago_transport_mode') || 'air';
  }

  function enhanceTripModal() {
    const form = document.getElementById('tripForm');
    if (!form || form.dataset.multimodalReady === '1') return;
    form.dataset.multimodalReady = '1';
    addStyles();

    const dateLabel = document.getElementById('tripDate')?.closest('label');
    if (!dateLabel) return;

    const wrap = document.createElement('div');
    wrap.innerHTML = `<span class="pv-mode-label">How are you travelling?</span><div class="pv-mode-grid" id="pvModeGrid"></div><div class="pv-mode-summary" id="pvModeSummary"></div><div class="pv-segment-builder" id="pvSegmentBuilder"><strong>Multimodal journey</strong><div class="pv-segment-chips"><span>🚆 Rail segment</span><span>✈ Air segment</span><span>🚗 Road segment</span><span>⛴ Sea segment</span></div><small>Add and reorder journey segments in the full PawVago planner.</small></div>`;
    dateLabel.insertAdjacentElement('afterend', wrap);

    const grid = document.getElementById('pvModeGrid');
    const summary = document.getElementById('pvModeSummary');
    const segmentBuilder = document.getElementById('pvSegmentBuilder');

    const render = mode => {
      localStorage.setItem('pawvago_transport_mode', mode);
      grid.innerHTML = MODES.map(m => `<button type="button" class="pv-mode-btn ${m.id === mode ? 'active' : ''}" data-mode="${m.id}"><b>${m.icon}</b><span>${m.label}</span><small>${m.hint}</small></button>`).join('');
      const current = MODES.find(m => m.id === mode) || MODES[0];
      summary.innerHTML = `<strong>${current.icon} ${current.label}</strong> · PawVago will organize operator policies, border requirements, documents and pet-specific restrictions for this journey.`;
      segmentBuilder.classList.toggle('show', mode === 'multimodal');
      grid.querySelectorAll('[data-mode]').forEach(btn => btn.onclick = () => render(btn.dataset.mode));
    };
    render(selectedMode());

    form.addEventListener('submit', () => {
      const mode = selectedMode();
      localStorage.setItem('pawvago_last_trip_mode', mode);
    }, true);
  }

  const observer = new MutationObserver(enhanceTripModal);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', enhanceTripModal);
})();
