(() => {
  const MODES = [
    { id:'air', icon:'✈', label:'Flight', hint:'Fastest for long-distance routes' },
    { id:'rail', icon:'🚆', label:'Train', hint:'Often simpler for European pet travel' },
    { id:'road', icon:'🚗', label:'Car', hint:'Flexible door-to-door travel' },
    { id:'sea', icon:'⛴', label:'Ferry / Ship', hint:'Useful where sea crossings are required' },
    { id:'multimodal', icon:'⇄', label:'Multimodal', hint:'Combine transport modes in one journey' }
  ];

  const cityCountry = {
    nantes:'FR', paris:'FR', lyon:'FR', bordeaux:'FR',
    barcelona:'ES', madrid:'ES',
    budapest:'HU', vienna:'AT', amsterdam:'NL', brussels:'BE',
    berlin:'DE', frankfurt:'DE', munich:'DE', rome:'IT', milan:'IT',
    london:'GB', dublin:'IE', lisbon:'PT', warsaw:'PL', prague:'CZ'
  };

  function addStyles(){
    if(document.getElementById('pvMultimodalStyles')) return;
    const s=document.createElement('style'); s.id='pvMultimodalStyles';
    s.textContent=`.pv-mode-label{display:block;margin:14px 0 8px;font-weight:800}.pv-ai-rec{padding:13px 14px;border-radius:14px;background:#f0efff;border:1px solid #d9d5ff;margin:0 0 12px;font-size:.84rem;line-height:1.45}.pv-ai-rec strong{display:block;margin-bottom:3px}.pv-mode-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:12px}.pv-mode-btn{border:1px solid rgba(15,23,42,.12);background:#fff;border-radius:14px;padding:12px 7px;cursor:pointer;text-align:center;color:#10172A}.pv-mode-btn b{display:block;font-size:1.25rem}.pv-mode-btn span{display:block;font-size:.76rem;font-weight:800}.pv-mode-btn small{display:block;font-size:.62rem;opacity:.6;margin-top:3px}.pv-mode-btn.active{background:#10172A;color:#fff}.pv-mode-btn.recommended{box-shadow:0 0 0 2px #7c6cff}.pv-mode-summary{padding:10px 12px;border-radius:12px;background:#f5f7fb;margin-bottom:12px;font-size:.82rem}.pv-save-row{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:10px}.pv-save-btn{border:1px solid #10172A;background:#fff;color:#10172A;border-radius:12px;padding:12px;font-weight:800;cursor:pointer}.pv-save-note{font-size:.78rem;margin-top:8px;color:#166534}.pv-segment-builder{display:none;padding:12px;border:1px dashed rgba(15,23,42,.18);border-radius:14px;margin-bottom:12px}.pv-segment-builder.show{display:block}.pv-segment-chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px}.pv-segment-chips span{padding:6px 9px;border-radius:999px;background:#eef2f7;font-size:.72rem;font-weight:700}@media(max-width:720px){.pv-mode-grid{grid-template-columns:repeat(2,1fr)}.pv-save-row{grid-template-columns:1fr}}`;
    document.head.appendChild(s);
  }

  function normalize(v){return String(v||'').trim().toLowerCase().split(',')[0].trim()}
  function recommend(){
    const from=normalize(document.getElementById('tripFrom')?.value);
    const to=normalize(document.getElementById('tripTo')?.value);
    if(!from||!to) return {mode:'multimodal',reason:'Enter your origin and destination and PawVago will recommend a travel mode.'};
    const fc=cityCountry[from], tc=cityCountry[to];
    if(fc==='FR'&&tc==='FR') return {mode:'rail',reason:'For this domestic French route, rail is a strong first option to compare for pet travel.'};
    const railPairs=['nantes-paris','paris-brussels','paris-amsterdam','paris-frankfurt','vienna-budapest','budapest-vienna','paris-barcelona'];
    const key=`${from}-${to}`, rev=`${to}-${from}`;
    if(railPairs.includes(key)||railPairs.includes(rev)) return {mode:'rail',reason:'This route has a practical European rail corridor, so PawVago recommends checking train travel first.'};
    if((fc==='GB'||tc==='GB') && fc!==tc) return {mode:'multimodal',reason:'Cross-Channel pet travel can require different operator rules, so PawVago recommends comparing a multimodal route.'};
    if(fc&&tc&&fc!==tc) return {mode:'multimodal',reason:'This is an international journey. PawVago recommends comparing rail, air and road segments before choosing.'};
    return {mode:'road',reason:'Based on the information available, road travel is a useful baseline option to compare.'};
  }

  function enhanceTripModal(){
    const form=document.getElementById('tripForm');
    if(!form||form.dataset.multimodalReady==='1') return;
    form.dataset.multimodalReady='1'; addStyles();
    const dateLabel=document.getElementById('tripDate')?.closest('label'); if(!dateLabel) return;
    const wrap=document.createElement('div');
    wrap.innerHTML=`<span class="pv-mode-label">PawVago travel recommendation</span><div class="pv-ai-rec" id="pvAiRec"></div><div class="pv-mode-grid" id="pvModeGrid"></div><div class="pv-mode-summary" id="pvModeSummary"></div><div class="pv-segment-builder" id="pvSegmentBuilder"><strong>Suggested multimodal journey</strong><div class="pv-segment-chips"><span>🚆 Rail</span><span>✈ Flight</span><span>🚗 Road</span><span>⛴ Ferry</span></div><small>PawVago will compare relevant segments and operator rules for the route.</small></div><div class="pv-save-row"><button type="button" class="pv-save-btn" id="pvSaveTrip">Save trip</button></div><div class="pv-save-note" id="pvSaveNote"></div>`;
    dateLabel.insertAdjacentElement('afterend',wrap);
    const grid=document.getElementById('pvModeGrid'), summary=document.getElementById('pvModeSummary'), recBox=document.getElementById('pvAiRec'), segment=document.getElementById('pvSegmentBuilder');
    let manual=false;
    const render=(mode,reason)=>{
      localStorage.setItem('pawvago_transport_mode',mode);
      grid.innerHTML=MODES.map(m=>`<button type="button" class="pv-mode-btn ${m.id===mode?'active recommended':''}" data-mode="${m.id}"><b>${m.icon}</b><span>${m.label}</span><small>${m.hint}</small></button>`).join('');
      const current=MODES.find(m=>m.id===mode)||MODES[0];
      recBox.innerHTML=`<strong>Recommended: ${current.icon} ${current.label}</strong>${reason}`;
      summary.textContent='You can accept PawVago’s recommendation or choose another mode manually.';
      segment.classList.toggle('show',mode==='multimodal');
      grid.querySelectorAll('[data-mode]').forEach(btn=>btn.onclick=()=>{manual=true;render(btn.dataset.mode,'Manual choice — PawVago will still apply pet, operator and border requirements to this mode.')});
    };
    const refresh=()=>{if(manual)return;const r=recommend();render(r.mode,r.reason)};
    ['tripFrom','tripTo'].forEach(id=>document.getElementById(id)?.addEventListener('input',()=>{manual=false;refresh()}));
    refresh();
    document.getElementById('pvSaveTrip').onclick=()=>{
      const saved={from:document.getElementById('tripFrom')?.value||'',to:document.getElementById('tripTo')?.value||'',date:document.getElementById('tripDate')?.value||'',mode:localStorage.getItem('pawvago_transport_mode')||recommend().mode,savedAt:new Date().toISOString()};
      localStorage.setItem('pawvago_saved_trip',JSON.stringify(saved));
      document.getElementById('pvSaveNote').textContent='✓ Trip saved on this device. Use Analyze my trip to generate the travel plan.';
    };
    form.addEventListener('submit',()=>localStorage.setItem('pawvago_last_trip_mode',localStorage.getItem('pawvago_transport_mode')||recommend().mode),true);
  }
  const observer=new MutationObserver(enhanceTripModal); observer.observe(document.documentElement,{childList:true,subtree:true}); document.addEventListener('DOMContentLoaded',enhanceTripModal);
})();
