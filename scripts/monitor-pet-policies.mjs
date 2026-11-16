/* Scheduled source observation. Never updates pet-policy facts or reviewed_on. */
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { collectSources, policyText, readable, observe } from './policy-monitor-core.mjs';
const root=new URL('../',import.meta.url),load=p=>JSON.parse(readFileSync(new URL(p,root),'utf8'));
const policy=load('data/pet-policy-snapshot.json'),sources=collectSources(policy);
const approvals=load('data/policy-source-approvals.json').sources||{};
const directory=new URL('.policy-monitor/',root);mkdirSync(directory,{recursive:true});
let state={version:2,sources:{}};try{state=load('.policy-monitor/state.json');if(state.version!==2)state={version:2,sources:{}};}catch{}
const now=new Date().toISOString(),texts=new Map();
async function retrieve(source){
  try{
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),18000);
    try{
      let url=source.url,response;
      for(let n=0;n<5;n++){
        response=await fetch(url,{redirect:'manual',signal:controller.signal,headers:{'User-Agent':'PawVagoPolicyMonitor/2.0 (+https://www.pawvago.com)','Accept':'text/html,application/pdf,text/plain'}});
        if(response.status>=300&&response.status<400&&response.headers.get('location')){
          const next=new URL(response.headers.get('location'),url);
          // Do not turn trusted URLs into unrestricted network access through redirects.
          const first=new URL(source.url),family=h=>h.replace(/^wwws?\./,'');
          if(next.protocol!=='https:'||family(next.hostname)!==family(first.hostname))return{error:'cross_origin_redirect_requires_review'};
          url=next.href;continue;
        }break;
      }
      if(!response.ok)return{error:'http_'+response.status};
      const contentType=response.headers.get('content-type')||'';
      const reader=response.body.getReader(),chunks=[];let total=0;
      while(true){const{done,value}=await reader.read();if(done)break;total+=value.length;if(total>6000000){await reader.cancel();return{error:'source_too_large'};}chunks.push(Buffer.from(value));}
      const buffer=Buffer.concat(chunks);let raw;
      if(contentType.includes('pdf')||buffer.subarray(0,4).toString()==='%PDF'){
        const temp=mkdtempSync(join(tmpdir(),'pawvago-source-'));
        try{const path=join(temp,'source.pdf');writeFileSync(path,buffer);const parsed=spawnSync('pdftotext',['-layout',path,'-'],{encoding:'utf8',timeout:15000,maxBuffer:8000000});if(parsed.status!==0)return{error:'pdf_text_extraction_failed'};raw=parsed.stdout;}finally{rmSync(temp,{recursive:true,force:true});}
      }else if(/text\/|html|json/i.test(contentType))raw=buffer.toString('utf8');
      else return{error:'unsupported_content_type'};
      const text=policyText(raw);if(!readable(text))return{error:'unreadable_or_blocked_page'};
      texts.set(source.id,text);return{text};
    }finally{clearTimeout(timer);}
  }catch(error){return{error:error.name==='AbortError'?'fetch_timeout':'fetch_failed'};}
}
let position=0;
await Promise.all(Array.from({length:4},async()=>{while(position<sources.length){const source=sources[position++],result=await retrieve(source);state.sources[source.id]=observe(source,state.sources[source.id],result,now,approvals[source.id]);console.log(source.owners.join(',')+': '+state.sources[source.id].status);}}));
// Only explicitly authorized main-branch workflows can access the analysis endpoint.
async function workflowToken(){
  const url=process.env.ACTIONS_ID_TOKEN_REQUEST_URL,token=process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
  if(!url||!token)return null;
  const u=new URL(url);u.searchParams.set('audience','pawvago-policy-monitor');
  const r=await fetch(u,{headers:{Authorization:'Bearer '+token},signal:AbortSignal.timeout(10000)});if(!r.ok)return null;return(await r.json()).value||null;
}
const candidates=sources.filter(s=>state.sources[s.id].pending_review&&!state.sources[s.id].failed&&state.sources[s.id].analysis_hash!==state.sources[s.id].observed_hash);
const probe=!state.api_verified_at&&!candidates.length?sources.find(s=>texts.has(s.id)&&s.owners.includes('OS')):null;
if(probe)candidates.push(probe); // One initial authenticated end-to-end API check.
let analysisStatus='not_needed',analyzed=0;
const maxAnalyses=3;
if(candidates.length){
  const token=await workflowToken();analysisStatus=token?'enabled':'workflow_identity_unavailable';
  if(token){for(const source of candidates.slice(0,maxAnalyses)){
    const item=state.sources[source.id],full=texts.get(source.id);
    // Bound input and cost. Preserve beginning and ending rather than silently passing a whole giant tariff.
    const text=full.length>19000?full.slice(0,15000)+' [Source excerpt truncated; review full original] '+full.slice(-3500):full;
    const reference=source.references.slice(0,1).map(r=>({id:r.id,name:r.name,cabin_allowed:r.cabin_allowed,cabin_max_kg:r.cabin_max_kg,dimensions_cm:r.dimensions_cm,hold:r.hold,notes:r.notes?.slice(0,1000),scope:r.scope}));
    try{
      const r=await fetch('https://www.pawvago.com/api/policy-monitor-analysis',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({url:source.url,text,reference}),signal:AbortSignal.timeout(60000)});
      if(!r.ok){item.analysis_error='analysis_http_'+r.status;continue;}
      const analysis=await r.json();if(analysis.requires_review!==true||analysis.source!==source.url)throw Error('Invalid analysis response');
      item.analysis=analysis;item.analysis_hash=item.observed_hash;delete item.analysis_error;state.api_verified_at=now;analyzed++;
      if(analysis.assessment==='possible_policy_change'){item.ai_draft_requires_review=true;item.pending_review=true;}
    }catch{item.analysis_error='analysis_failed';}
  }}
}
if(candidates.length&&analysisStatus==='enabled')analysisStatus=analyzed===Math.min(candidates.length,maxAnalyses)?'connected':analyzed?'partial_failure':'analysis_unavailable';
const observations=sources.map(s=>({id:s.id,url:s.url,owners:s.owners,reviewed_on:s.reviewed_on,...state.sources[s.id]}));
const missing=policy.airlines.filter(a=>!a.source).map(a=>({id:a.id,name:a.name,region:a.region}));
const report={version:2,checked_at:now,run_url:process.env.GITHUB_RUN_ID?'https://github.com/nasrinvtnkh-boop/pawvago-website/actions/runs/'+process.env.GITHUB_RUN_ID:null,
  scope:'Recorded official sources only. A successful page fetch or unchanged hash is not a rule re-verification. Unmapped airlines are not monitored.',
  coverage:{airlines_total:policy.airlines.length,airlines_with_sources:policy.airlines.length-missing.length,airlines_missing_sources:missing.length,official_source_urls:sources.length},
  summary:{readable:observations.filter(s=>!s.failed).length,blocked_or_failed:observations.filter(s=>s.failed).length,changed:observations.filter(s=>s.pending_review).length,baselines_created:observations.filter(s=>s.status==='baseline_created').length},
  api_analysis:{status:analysisStatus,last_successful_api_check:state.api_verified_at||null,requests_completed:analyzed,maximum_per_run:maxAnalyses,remaining_changed_sources:candidates.length-analyzed},sources:observations,unmapped_airlines:missing};
state.last_run_at=now;state.sources=Object.fromEntries(observations.map(s=>[s.id,state.sources[s.id]]));
writeFileSync(new URL('.policy-monitor/state.json',root),JSON.stringify(state,null,2)+'\n');
writeFileSync(new URL('.policy-monitor/report.json',root),JSON.stringify(report,null,2)+'\n');
const escape=s=>String(s).replace(/[<>|`]/g,' ').replace(/\r?\n/g,' ');
const rows=observations.filter(s=>s.failed||s.pending_review);
let markdown=`# PawVago official-source monitor\n\nChecked: ${now}\n\n${report.scope}\n\n- Official URLs: ${sources.length}\n- Readable: ${report.summary.readable}\n- Blocked/failed: ${report.summary.blocked_or_failed}\n- Changed since baseline: ${report.summary.changed}\n- Airlines without mapped sources: ${missing.length} / ${policy.airlines.length}\n- Grounded API drafts completed: ${analyzed} (maximum ${maxAnalyses} per run)\n\n`;
markdown+='Legal/pet-travel facts and reviewed_on dates were not changed. First observations establish a baseline only. Changed pages stay pending until reviewed; matching keywords do not clear them.\n\n';
if(report.run_url)markdown+=`[Full workflow run and downloadable JSON report](${report.run_url})\n\n`;
markdown+='| Sources | Status | Official URL |\n| --- | --- | --- |\n';
for(const s of rows)markdown+=`| ${escape(s.owners.join(', '))} | ${s.failed?s.status:'Content changed — review required'} | ${s.url} |\n`;
for(const s of rows.filter(s=>s.analysis).slice(0,10)){markdown+=`\n### ${escape(s.owners.join(', '))}: advisory API draft\n\n${escape(s.analysis.summary)}\n\n`;for(const c of s.analysis.changes)markdown+=`- ${escape(c.category)}: ${escape(c.description)}\n`;}
writeFileSync(new URL('.policy-monitor/report.md',root),markdown);
if(process.env.GITHUB_STEP_SUMMARY)writeFileSync(process.env.GITHUB_STEP_SUMMARY,markdown);
console.log(JSON.stringify({coverage:report.coverage,summary:report.summary,api:report.api_analysis}));
