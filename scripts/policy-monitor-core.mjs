import { createHash } from 'node:crypto';
export const digest = text => createHash('sha256').update(text).digest('hex');
const decode = text => text.replace(/&nbsp;|&#160;/gi,' ').replace(/&times;|&#215;/gi,'×').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'");
export function policyText(raw) {
  let html=String(raw).replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi,' ');
  const main=html.match(/<(main|article)\b[^>]*>([\s\S]*?)<\/\1>/i);
  if(main)html=main[2];
  html=html.replace(/<(nav|header|footer)\b[^>]*>[\s\S]*?<\/\1>/gi,' ');
  return decode(html.replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();
}
export function readable(text) {
  if(text.length<200)return false;
  if(/access denied|verify (?:that )?you are human|checking your browser|enable javascript to continue|just a moment|request (?:has been )?blocked|captcha challenge/i.test(text.slice(0,700)))return false;
  return /\bpet[s]?\b|\bdogs?\b|\bcats?\b|animal|animaux|mascota|hayvan|vaccin|rabies|rage|microchip|importation|importing|transport|tier|haustier/i.test(text);
}
export function signals(text) {
  const values=[...text.matchAll(/\b(\d+(?:[.,]\d+)?)\s*(kg|kilograms?|kilos?|cm|centim(?:eters?|ètres?)|lbs?\.?|pounds?|hours?|heures?|days?|jours?|weeks?|semaines?)\b/gi)].map(m=>m[1].replace(',','.')+' '+m[2].toLowerCase());
  return [...new Set(values)].sort().slice(0,250);
}
export function collectSources(policy) {
  const map=new Map();
  function add(url,owner,reviewedOn,reference){
    if(typeof url!=='string')return;
    try{const u=new URL(url);if(u.protocol!=='https:'||u.username||u.password)return;u.hash='';url=u.href;}catch{return;}
    if(!map.has(url))map.set(url,{id:digest(url).slice(0,20),url,owners:[],reviewed_on:[],references:[]});
    const item=map.get(url);if(!item.owners.includes(owner))item.owners.push(owner);
    if(reviewedOn&&!item.reviewed_on.includes(reviewedOn))item.reviewed_on.push(reviewedOn);
    if(reference)item.references.push(reference);
  }
  for(const a of policy.airlines){
    const reference={id:a.id,name:a.name,cabin_allowed:a.cabin_allowed,cabin_max_kg:a.cabin_max_kg,dimensions_cm:a.dimensions_cm,hold:a.hold,notes:a.notes};
    for(const url of new Set([a.source,a.hold?.source,a.hold?.breed_source,...(a.sources||[])]))add(url,a.id,a.reviewed_on,reference);
  }
  for(const [key,url]of Object.entries(policy.official_sources||{}))add(url,'government:'+key,null,{scope:key,type:'Official destination entry requirements; species, origin and travel history affect applicability.'});
  return [...map.values()].map(s=>({...s,reviewed_on:s.reviewed_on.sort(),review_stamp:JSON.stringify(s.reviewed_on.sort())})).sort((a,b)=>a.url.localeCompare(b.url));
}
export function observe(source,previous,result,now,approval) {
  const prior=previous||{};
  if(result.error)return {...prior,url:source.url,owners:source.owners,status:result.error,checked_at:now,failed:true,review_stamp:prior.review_stamp||source.review_stamp};
  const hash=digest(result.text),values=signals(result.text);
  const approved=approval?.source===source.url&&approval?.hash===hash&&approval?.method==='primary_source_review'&&/^\d{4}-\d{2}-\d{2}$/.test(approval?.reviewed_on||'');
  if(approved)return {...prior,url:source.url,owners:source.owners,review_stamp:source.review_stamp,baseline_hash:hash,baseline_signals:values,baseline_at:now,observed_hash:hash,observed_signals:values,status:'review_acknowledged',checked_at:now,last_readable_at:now,failed:false,pending_review:false,ai_draft_requires_review:false,last_review_acknowledged:approval.reviewed_on};
  const status=!prior.baseline_hash?'baseline_created':hash===prior.baseline_hash?'unchanged':'content_changed';
  return {...prior,url:source.url,owners:source.owners,review_stamp:source.review_stamp,
    baseline_hash:prior.baseline_hash||hash,baseline_at:prior.baseline_at||now,
    baseline_signals:prior.baseline_signals||values,observed_hash:hash,observed_signals:values,
    status,checked_at:now,last_readable_at:now,failed:false,
    review_date_changed:!!prior.review_stamp&&prior.review_stamp!==source.review_stamp,
    pending_review:status==='content_changed'||prior.ai_draft_requires_review===true};
}
export function validateAnalysis(value,text) {
  if(!value||!['possible_policy_change','no_policy_change_detected','uncertain'].includes(value.assessment)||typeof value.summary!=='string'||!Array.isArray(value.changes)||value.changes.length>3)throw Error('Invalid analysis');
  let quoted=0;
  for(const change of value.changes){
    if(!change||!['cabin','hold','cargo','breed','documents','deadline','route','other'].includes(change.category)||!['string'].includes(typeof change.description)||typeof change.evidence!=='string')throw Error('Invalid proposed change');
    const quote=change.evidence.replace(/\s+/g,' ').trim();quoted+=quote.split(/\s+/).filter(Boolean).length;
    if(!quote||!text.toLowerCase().includes(quote.toLowerCase()))throw Error('Evidence not present in retrieved source');
  }
  if(quoted>25||value.summary.length>1800)throw Error('Analysis exceeds evidence limit');
  return {assessment:value.assessment,summary:value.summary,changes:value.changes,requires_review:true};
}
