(() => {
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=v=>String(v||'').trim();

  function fixAirlineQuality(root=document){
    $$('*',root).forEach(el=>{
      if(el.children.length) return;
      const t=clean(el.textContent);
      if(/Carrier size:\s*(null|undefined|NaN)\s*[×x]\s*(null|undefined|NaN)\s*[×x]\s*(null|undefined|NaN)/i.test(t)){
        el.textContent='Carrier dimensions: Verify with airline';
      }
      if(/Carrier size:\s*null/i.test(t)) el.textContent='Carrier dimensions: Verify with airline';
    });

    const heading=$$('h1,h2,h3,h4,strong',root).find(x=>/Airlines matching your pet/i.test(x.textContent));
    if(!heading) return;
    const section=heading.closest('section,article,div');
    if(!section) return;
    const text=section.innerText||'';
    const compatible=(text.match(/\bCompatible\b/g)||[]).length;
    const conditional=(text.match(/\bConditional\b/g)||[]).length;
    const incompatible=(text.match(/\bIncompatible\b/g)||[]).length;
    const cards=$$("div",section).filter(x=>x.children.length===0 && /^\s*\d+\s*$/.test(x.textContent));
    const labels=$$('small,span,p,div',section);
    const findMetric=(label)=>labels.find(x=>new RegExp('^\\s*'+label+'\\s*$','i').test(clean(x.textContent)))?.parentElement;
    const cBox=findMetric('Compatible');
    const vBox=findMetric('Needs verification');
    if(cBox){const n=$$('div,strong,b',cBox).find(x=>/^\d+$/.test(clean(x.textContent)));if(n)n.textContent=String(compatible)}
    if(vBox){const n=$$('div,strong,b',vBox).find(x=>/^\d+$/.test(clean(x.textContent)));if(n)n.textContent=String(conditional)}
    let note=$('.pv-air-quality-note',section);
    if(!note){note=document.createElement('div');note.className='pv-air-quality-note';note.style.cssText='margin:10px 0 14px;padding:10px 12px;border-radius:10px;background:#f8fafc;color:#475569;font-size:.78rem';heading.parentElement?.appendChild(note)}
    note.textContent=`Rule status: ${compatible} compatible · ${conditional} conditional${incompatible?` · ${incompatible} incompatible`:''}. Conditional options require airline verification before booking.`;
  }

  function explainCards(root=document){
    $$('.pv-option',root).forEach(card=>{
      if($('.pv-why',card)) return;
      const title=clean($('h4',card)?.textContent);
      const scoreText=clean($('.pv-score',card)?.textContent);
      const score=parseInt(scoreText,10);
      if(!title||!Number.isFinite(score)) return;
      const checks=clean($('.pv-checks',card)?.innerText);
      const factors=[];
      if(/Pet profile considered/i.test(checks)) factors.push(['Pet profile','Included']);
      if(/Route structure considered/i.test(checks)) factors.push(['Route fit','Included']);
      if(/Stored airline rules checked/i.test(checks)) factors.push(['Operator data','Stored rules checked']);
      else if(/Operator-specific rules need verification|Airline rules need verification/i.test(checks)) factors.push(['Operator data','Verification needed']);
      if(/Highest current PawVago match/i.test(checks)) factors.push(['Ranking','Highest current score']);
      const details=document.createElement('details');
      details.className='pv-why';
      details.style.cssText='margin:10px 0 12px;border-top:1px solid #e5e7eb;padding-top:9px;font-size:.73rem';
      details.innerHTML=`<summary style="cursor:pointer;font-weight:800">Why ${score}%?</summary><div style="margin-top:8px;display:grid;gap:5px">${factors.map(([a,b])=>`<div style="display:flex;justify-content:space-between;gap:12px"><span>${a}</span><b>${b}</b></div>`).join('')}<div style="margin-top:4px;color:#64748b">Decision-support score based on PawVago's currently stored route, pet and operator-rule signals. It is not live availability or a guarantee.</div></div>`;
      const btn=$('button',card); if(btn) card.insertBefore(details,btn); else card.appendChild(details);
    });
  }

  function labelRoadData(root=document){
    const road=$('.pv-road',root); if(!road||$('.pv-road-source',road)) return;
    const source=document.createElement('div');source.className='pv-road-source';source.style.cssText='padding:9px 18px;background:#f8fafc;border-top:1px solid #e5e7eb;color:#64748b;font-size:.72rem';
    const hasMissing=/Route API needed/i.test(road.innerText||'');
    source.textContent=hasMissing?'Road data status: route API not connected for this journey; no live distance or driving time is claimed.':'Road data status: PawVago stored MVP route profile. Live traffic, closures and real-time routing are not yet connected.';
    road.appendChild(source);
  }

  function run(){fixAirlineQuality();explainCards();labelRoadData()}
  const obs=new MutationObserver(()=>{clearTimeout(window.__pvDQ);window.__pvDQ=setTimeout(run,80)});
  document.addEventListener('DOMContentLoaded',()=>{run();obs.observe(document.body,{childList:true,subtree:true})});
  if(document.readyState!=='loading'){run();obs.observe(document.body,{childList:true,subtree:true})}
})();
