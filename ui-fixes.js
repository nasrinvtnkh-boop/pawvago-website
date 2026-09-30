/* PawVago production UI + live-road bridge */
(() => {
  const $ = id => document.getElementById(id);

  function bindOnce(el, key, fn) {
    if (!el || el.dataset[key]) return;
    el.dataset[key] = '1';
    el.addEventListener('click', fn);
  }

  function bindControls() {
    bindOnce($('switchAuth'), 'pvBound', () => auth(mode === 'signup' ? 'login' : 'signup'));
    bindOnce($('footerSignup'), 'pvBound', () => auth('signup'));

    const sideButtons = document.querySelectorAll('.side-nav button');
    bindOnce(sideButtons[0], 'pvBound', () => { show('dashboard'); });
    bindOnce(sideButtons[1], 'pvBound', () => { show('dashboard'); setTimeout(() => $('edit')?.click() || $('add')?.click(), 0); });
    bindOnce(sideButtons[2], 'pvBound', () => { show('dashboard'); setTimeout(() => $('editTrip')?.click() || $('trip')?.click(), 0); });
    bindOnce(sideButtons[3], 'pvBound', () => { show('dashboard'); setTimeout(() => document.querySelector('.pv-engine')?.scrollIntoView({behavior:'smooth'}), 0); });
    bindOnce(sideButtons[4], 'pvBound', () => { show('dashboard'); setTimeout(() => [...document.querySelectorAll('.pv-card h3')].find(x => x.textContent.includes('Destination services'))?.scrollIntoView({behavior:'smooth'}), 0); });
    bindOnce(sideButtons[5], 'pvBound', () => alert('PawVago Community is planned for the next product phase.'));
  }

  async function geocode(text) {
    const r = await fetch('/api/geocode?text=' + encodeURIComponent(text));
    if (!r.ok) throw new Error('Geocoding failed');
    const j = await r.json();
    const p = j.results?.find(x => Array.isArray(x.coordinates));
    if (!p) throw new Error('Location not found');
    return p;
  }

  async function getRoadRoute(from, to) {
    const [a, b] = await Promise.all([geocode(from), geocode(to)]);
    const r = await fetch('/api/route', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({start:a.coordinates, end:b.coordinates, profile:'driving-car'})
    });
    if (!r.ok) throw new Error('Routing failed');
    return r.json();
  }

  let routeKey = '';
  async function enhanceRoadCard() {
    if (typeof trip === 'undefined' || !trip?.from || !trip?.to) return;
    const card = [...document.querySelectorAll('.pv-card')].find(c => c.querySelector('h3')?.textContent.trim() === 'Route intelligence');
    if (!card) return;

    const key = `${trip.from}|${trip.to}`;
    if (card.dataset.liveRoute === key || routeKey === key) return;
    routeKey = key;

    let box = card.querySelector('.pv-live-route');
    if (!box) {
      box = document.createElement('div');
      box.className = 'pv-summary pv-live-route';
      box.innerHTML = '<div class="pv-summary-item"><strong>Connecting…</strong><span>Live road routing</span></div>';
      card.appendChild(box);
    }

    try {
      const data = await getRoadRoute(trip.from, trip.to);
      const distanceKm = data.summary?.distance ? Math.round(data.summary.distance / 1000) : null;
      const durationH = data.summary?.duration ? (data.summary.duration / 3600).toFixed(1) : null;
      box.innerHTML = `
        <div class="pv-summary-item"><strong>${distanceKm ?? '—'} km</strong><span>Live road distance</span></div>
        <div class="pv-summary-item"><strong>${durationH ?? '—'} h</strong><span>Estimated driving time</span></div>
        <div class="pv-summary-item"><strong>OpenRouteService</strong><span>Routing connected</span></div>`;
      card.dataset.liveRoute = key;
    } catch (e) {
      console.error('PawVago live route:', e);
      box.innerHTML = '<div class="pv-summary-item"><strong>Stored route</strong><span>Live road data temporarily unavailable</span></div>';
    } finally {
      routeKey = '';
    }
  }

  const observer = new MutationObserver(() => {
    bindControls();
    enhanceRoadCard();
  });

  function start() {
    bindControls();
    enhanceRoadCard();
    observer.observe(document.body, {childList:true, subtree:true});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
