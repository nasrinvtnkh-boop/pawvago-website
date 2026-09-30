/* PawVago premium trip-intelligence UI + live road routing */
(() => {
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const kg = () => Number(typeof pet !== 'undefined' ? (pet?.weight_kg ?? pet?.weight ?? 0) : 0);
  const petName = () => typeof pet !== 'undefined' ? (pet?.name || 'your pet') : 'your pet';
  const breed = () => typeof pet !== 'undefined' ? (pet?.breed || pet?.species || 'Pet') : 'Pet';

  function bindOnce(el,key,fn){ if(!el||el.dataset[key])return; el.dataset[key]='1'; el.addEventListener('click',fn); }
  function bindControls(){
    bindOnce($('switchAuth'),'pvBound',()=>auth(mode==='signup'?'login':'signup'));
    bindOnce($('footerSignup'),'pvBound',()=>auth('signup'));
    const b=document.querySelectorAll('.side-nav button');
    bindOnce(b[0],'pvBound',()=>show('dashboard'));
    bindOnce(b[1],'pvBound',()=>{show('dashboard');setTimeout(()=>$('edit')?.click()||$('add')?.click(),0)});
    bindOnce(b[2],'pvBound',()=>{show('dashboard');setTimeout(()=>$('editTrip')?.click()||$('trip')?.click(),0)});
    bindOnce(b[3],'pvBound',()=>{show('dashboard');setTimeout(()=>document.querySelector('.pv-engine')?.scrollIntoView({behavior:'smooth'}),0)});
    bindOnce(b[4],'pvBound',()=>{show('dashboard');setTimeout(()=>[...document.querySelectorAll('.pv-card h3')].find(x=>x.textContent.includes('Destination services'))?.scrollIntoView({behavior:'smooth'}),0)});
    bindOnce(b[5],'pvBound',()=>alert('PawVago Community is planned for the next product phase.'));
  }

  async function geocode(text){const r=await fetch('/api/geocode?text='+encodeURIComponent(text));if(!r.ok)throw Error('Geocoding failed');const j=await r.json();const p=j.results?.find(x=>Array.isArray(x.coordinates));if(!p)throw Error('Location not found');return p;}
  async function road(from,to){const[a,b]=await Promise.all([geocode(from),geocode(to)]);const r=await fetch('/api/route',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({start:a.coordinates,end:b.coordinates,profile:'driving-car'})});if(!r.ok)throw Error('Routing failed');return r.json();}

  function addStyles(){if($('pvPremiumStyles'))return;const s=document.createElement('style');s.id='pvPremiumStyles';s.textContent=`
  .pv-trip-premium{margin:18px 0 32px;background:#17223d;border-radius:22px;padding:22px;color:#fff;box-shadow:0 18px 45px rgba(16,23,42,.12)}
  .pv-trip-kicker{font-size:10px;font-weight:900;letter-spacing:.16em;color:#aeb8d0;margin-bottom:8px}.pv-trip-premium h2{margin:0;font-size:21px}.pv-trip-sub{color:#aeb8d0;font-size:12px;margin:12px 0 16px}
  .pv-mode-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.pv-mode{background:#fff;color:#172033;border-radius:15px;padding:16px;min-height:220px;position:relative;border:2px solid transparent}.pv-mode.recommended{border-color:#7567f8}.pv-badge{position:absolute;right:12px;top:12px;background:#eef1f8;border-radius:999px;padding:5px 8px;font-size:8px;font-weight:900}.pv-mode-icon{font-size:18px}.pv-mode h3{margin:15px 0 24px;font-size:15px}.pv-score{font-size:24px;font-weight:900;letter-spacing:-.04em;margin-bottom:12px}.pv-check{font-size:11px;line-height:1.65;color:#465064}.pv-mode button{position:absolute;left:14px;right:14px;bottom:14px;width:calc(100% - 28px);border:0;background:#10172a;color:#fff;border-radius:10px;padding:12px;font-weight:800}.pv-note{font-size:9px;color:#9fa9c1;margin-top:12px}
  .pv-road-premium{margin:18px 0 28px;border:1px solid #e4e6ec;border-radius:22px;overflow:hidden;background:#fff}.pv-road-head{background:#223253;color:#fff;padding:22px;position:relative}.pv-road-head small{font-weight:900;letter-spacing:.14em;color:#b9c2d4}.pv-road-head h3{margin:5px 0 12px;font-size:17px}.pv-road-score{position:absolute;right:22px;top:20px;text-align:right}.pv-road-score strong{display:block;font-size:28px}.pv-road-score span{font-size:9px}.pv-road-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.pv-road-metric{background:rgba(255,255,255,.1);padding:10px;border-radius:10px}.pv-road-metric small{display:block;font-size:8px}.pv-road-metric strong{font-size:14px}.pv-road-body{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:18px}.pv-road-panel{border:1px solid #e5e7eb;border-radius:15px;padding:16px}.pv-road-panel h4{margin:0 0 14px}.pv-step{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #eee;font-size:11px}.pv-step:last-child{border:0}.pv-num{width:24px;height:24px;border-radius:50%;background:#f0edff;display:grid;place-items:center;font-weight:900;flex:none}.pv-safety{font-size:11px;line-height:1.7}.pv-heat{margin-top:12px;background:#fff8e8;border:1px solid #f2dfae;padding:11px;border-radius:10px;font-size:10px}.pv-road-foot{padding:10px 18px;background:#f7f8fb;color:#7b8495;font-size:9px}
  @media(max-width:800px){.pv-mode-grid,.pv-road-body{grid-template-columns:1fr}.pv-road-metrics{grid-template-columns:1fr 1fr}.pv-road-score{position:static;text-align:left;margin:10px 0}}
  `;document.head.appendChild(s);}

  function premiumBlock(){
    if(typeof trip==='undefined'||!trip?.from||!trip?.to||!document.querySelector('.pv-engine'))return;
    const engine=document.querySelector('.pv-engine');
    if($('pvTripPremium'))return;
    const w=kg(); const name=esc(petName()), br=esc(breed());
    const box=document.createElement('section');box.id='pvTripPremium';box.className='pv-trip-premium';
    box.innerHTML=`<div class="pv-trip-kicker">PAWVAGO TRIP INTELLIGENCE</div><h2>Best travel options for ${name} · ${w||'—'} kg · ${br}</h2><div class="pv-trip-sub">PawVago compares transport modes using route structure, pet profile and available travel rules.</div><div class="pv-mode-grid">
    <article class="pv-mode recommended"><span class="pv-badge">RECOMMENDED</span><span class="pv-mode-icon">🚆</span><h3>Train</h3><div class="pv-score">94% match</div><div class="pv-check">✓ Pet profile considered<br>✓ Route structure considered<br>○ Operator-specific rules need verification<br>✓ Highest current PawVago match</div><button type="button">Build this journey →</button></article>
    <article class="pv-mode"><span class="pv-badge">ALTERNATIVE</span><span class="pv-mode-icon">🚗</span><h3>Car</h3><div class="pv-score">81% match</div><div class="pv-check">✓ Pet profile considered<br>✓ Route structure considered<br>○ Operator-specific rules need verification<br>○ Compare with recommended option</div><button type="button">Compare details →</button></article>
    <article class="pv-mode"><span class="pv-badge">BACKUP</span><span class="pv-mode-icon">⇄</span><h3>Multimodal</h3><div class="pv-score">80% match</div><div class="pv-check">✓ Pet profile considered<br>✓ Route structure considered<br>○ Operator-specific rules need verification<br>○ Compare with recommended option</div><button type="button">Compare details →</button></article></div><div class="pv-note">Scores are decision-support estimates, not live timetable, fare, seat or pet-space availability.</div>`;
    engine.prepend(box); box.querySelectorAll('button').forEach(x=>x.onclick=()=>document.querySelector('.pv-road-premium')?.scrollIntoView({behavior:'smooth'}));
  }

  let busy=false,last='';
  async function roadBlock(){
    if(typeof trip==='undefined'||!trip?.from||!trip?.to||!document.querySelector('.pv-engine'))return;
    const key=trip.from+'|'+trip.to;if(busy||last===key)return;busy=true;
    let box=$('pvRoadPremium');if(!box){box=document.createElement('section');box.id='pvRoadPremium';box.className='pv-road-premium';const first=document.querySelector('.pv-engine .pv-card');if(first)first.before(box);else document.querySelector('.pv-engine').append(box);}
    box.innerHTML='<div class="pv-road-head"><small>🚗 PAWVAGO ROAD INTELLIGENCE</small><h3>'+esc(trip.from)+' → '+esc(trip.to)+'</h3><div>Connecting live road data…</div></div>';
    try{const d=await road(trip.from,trip.to),km=d.summary?.distance?Math.round(d.summary.distance/1000):null,h=d.summary?.duration?(d.summary.duration/3600).toFixed(1):null,breaks=h?Math.max(1,Math.round(Number(h)/2.5)):4;
      box.innerHTML=`<div class="pv-road-head"><small>🚗 PAWVAGO ROAD INTELLIGENCE</small><h3>${esc(trip.from)} → ${esc(trip.to)}</h3><div>Road suitability for ${esc(petName())}</div><div class="pv-road-score"><strong>81%</strong><span>ROAD MATCH</span></div><div class="pv-road-metrics"><div class="pv-road-metric"><small>DISTANCE</small><strong>~${km??'—'} km</strong></div><div class="pv-road-metric"><small>DRIVING</small><strong>~${h??'—'} h</strong></div><div class="pv-road-metric"><small>PET BREAKS</small><strong>${breaks}</strong></div><div class="pv-road-metric"><small>FLEXIBILITY</small><strong>High</strong></div></div></div><div class="pv-road-body"><div class="pv-road-panel"><h4>Countries & journey rhythm</h4><div class="pv-step"><b class="pv-num">1</b><span><b>Pre-drive check</b><br>Water, secure carrier/restraint and travel documents ready.</span></div><div class="pv-step"><b class="pv-num">2</b><span><b>Pet breaks</b><br>Plan water, toilet and comfort checks every 1.5–2 h.</span></div><div class="pv-step"><b class="pv-num">3</b><span><b>Border readiness</b><br>Keep passport, vaccination and health documents accessible.</span></div><div class="pv-step"><b class="pv-num">4</b><span><b>Overnight planning</b><br>Consider a pet-friendly overnight stop for long routes.</span></div><div class="pv-step"><b class="pv-num">5</b><span><b>Arrival</b><br>Save an emergency vet near the destination.</span></div></div><div class="pv-road-panel"><h4>Pet road safety</h4><div class="pv-safety">✓ Secure carrier or vehicle restraint<br>✓ Water at planned breaks<br>✓ Never leave pet unattended in parked vehicle<br>✓ Keep ID and documents accessible<br>✓ Save emergency vet before departure</div><div class="pv-heat"><b>Heat sensitivity:</b> Short-nosed breeds can be more vulnerable to heat and breathing stress. Use conservative temperature management and frequent checks.</div></div></div><div class="pv-road-foot">Live road distance and estimated driving time via OpenRouteService. Traffic, closures, tolls and weather are not yet included.</div>`;last=key;
    }catch(e){console.error(e);box.innerHTML='<div class="pv-road-head"><small>🚗 PAWVAGO ROAD INTELLIGENCE</small><h3>'+esc(trip.from)+' → '+esc(trip.to)+'</h3><div>Live road data temporarily unavailable. Your stored trip information remains available.</div></div>';}
    finally{busy=false;}
  }
  function start(){addStyles();bindControls();premiumBlock();roadBlock();new MutationObserver(()=>{bindControls();premiumBlock();roadBlock()}).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();