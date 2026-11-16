import test from 'node:test';
import assert from 'node:assert/strict';
import {generateKeyPairSync,sign} from 'node:crypto';
import {collectSources,policyText,readable,observe,validateAnalysis} from '../scripts/policy-monitor-core.mjs';
import {verifyWorkflow} from '../api/policy-monitor-analysis.mjs';
const source={url:'https://example.com/pets',owners:['XX'],review_stamp:'2026-11-16'};
test('observations never update verified dates, preserve baseline and pending changes',()=>{
 const first=observe(source,null,{text:'pets 8 kg'},'2026-11-16');assert.equal(first.status,'baseline_created');assert.equal(first.reviewed_on,undefined);
 const changed=observe(source,first,{text:'pets 9 kg'},'2026-11-17');assert.equal(changed.status,'content_changed');assert.equal(changed.pending_review,true);assert.equal(changed.baseline_hash,first.baseline_hash);
 const failed=observe(source,changed,{error:'http_403'},'2026-11-18');assert.equal(failed.last_readable_at,'2026-11-17');assert.equal(failed.observed_hash,changed.observed_hash);assert.equal(failed.pending_review,true);
 const again=observe(source,failed,{text:'pets 9 kg'},'2026-11-19');assert.equal(again.pending_review,true);
});
test('deduplicates sources and rejects non-HTTPS references',()=>{
 const sources=collectSources({airlines:[{id:'X',source:'https://example.com/pets',hold:{source:'https://example.com/pets'},sources:['http://bad','file:///etc/passwd']}],official_sources:{same:'https://example.com/pets'}});
 assert.equal(sources.length,1);assert.deepEqual(sources[0].owners,['X','government:same']);
});
test('does not treat JS walls or page shells as readable policies',()=>{
 assert.equal(readable('Please enable JavaScript to continue '+ 'pet '.repeat(100)),false);assert.equal(readable('Menu '.repeat(200)),false);
 assert.equal(policyText('<nav>random</nav><main>Pets <b>8 kg</b><script>evil()</script></main>'),'Pets 8 kg');
});
test('AI evidence must occur in source, fit the word cap, and never autoapprove',()=>{
 const draft={assessment:'possible_policy_change',summary:'Check new cabin limit.',changes:[{category:'cabin',description:'Weight changed',evidence:'maximum 9 kg'}]};
 assert.equal(validateAnalysis(draft,'Pets have a maximum 9 kg combined limit.').requires_review,true);
 assert.throws(()=>validateAnalysis(draft,'Only 8 kg is allowed.'));
 assert.throws(()=>validateAnalysis({...draft,changes:[{...draft.changes[0],evidence:'a '.repeat(26).trim()}]},'a '.repeat(30)));
});
const pair=generateKeyPairSync('rsa',{modulusLength:2048});const jwk=pair.publicKey.export({format:'jwk'});jwk.kid='test-key';
const now=1794830000,claims={iss:'https://token.actions.githubusercontent.com',aud:'pawvago-policy-monitor',repository_id:'1385384417',repository_owner_id:'326442264',repository:'nasrinvtnkh-boop/pawvago-website',ref:'refs/heads/main',workflow_ref:'nasrinvtnkh-boop/pawvago-website/.github/workflows/policy-monitor.yml@refs/heads/main',event_name:'schedule',iat:now,exp:now+300};
const token=extra=>{const a=Buffer.from(JSON.stringify({alg:'RS256',kid:jwk.kid})).toString('base64url'),b=Buffer.from(JSON.stringify({...claims,...extra})).toString('base64url');return a+'.'+b+'.'+sign('RSA-SHA256',Buffer.from(a+'.'+b),pair.privateKey).toString('base64url');};
const fetcher=async()=>({ok:true,json:async()=>({keys:[jwk]})});
test('private analysis accepts only signed main-branch monitor identities',async()=>{
 assert.equal((await verifyWorkflow(token({}),fetcher,now)).repository_id,'1385384417');
 for(const bad of [{repository_id:'fork'},{ref:'refs/heads/feature'},{event_name:'pull_request'},{aud:'other'},{exp:now-1},{workflow_ref:'other.yml'}])await assert.rejects(verifyWorkflow(token(bad),fetcher,now));
 const malformed=token({}).split('.');malformed[2]=Buffer.alloc(256).toString('base64url');await assert.rejects(verifyWorkflow(malformed.join('.'),fetcher,now));
});
test('only an explicit review of the exact URL/hash can clear pending changes',()=>{
 const a=observe(source,null,{text:'pets 8 kg'},'2026-11-16'),b=observe(source,a,{text:'pets 9 kg'},'2026-11-17');
 const valid={source:source.url,hash:b.observed_hash,method:'primary_source_review',reviewed_on:'2026-11-18'};
 assert.equal(observe(source,b,{text:'pets 9 kg'},'2026-11-18',{...valid,hash:'wrong'}).pending_review,true);
 assert.equal(observe(source,b,{text:'pets 9 kg'},'2026-11-18',valid).pending_review,false);
 assert.equal(observe(source,b,{text:'pets 10 kg'},'2026-11-18',valid).pending_review,true);
});
test('public requests cannot invoke paid analysis and authenticated output stays advisory',async()=>{
 const {default:handler}=await import('../api/policy-monitor-analysis.mjs');
 const fakeResponse=()=>({code:200,headers:{},setHeader(k,v){this.headers[k]=v},status(c){this.code=c;return this},json(body){this.body=body;return this}});
 let response=fakeResponse();await handler({method:'POST',headers:{},body:{}},response);assert.equal(response.code,401);
 const key=process.env.OPENAI_API_KEY,original=globalThis.fetch;process.env.OPENAI_API_KEY='test-only-not-a-real-key';
 const current=Math.floor(Date.now()/1000),trusted=token({iat:current,exp:current+300});let calls=0;
 globalThis.fetch=async(url,options)=>{
  if(url.includes('jwks'))return fetcher();
  assert.equal(url,'https://api.openai.com/v1/chat/completions');calls++;
  const input=JSON.parse(options.body);assert.equal(input.response_format.json_schema.strict,true);assert.ok(!input.tools);
  return{ok:true,json:async()=>({choices:[{message:{content:JSON.stringify({assessment:'no_policy_change_detected',summary:'No explicit difference found in supplied excerpt.',changes:[]})}}]})};
 };
 try{
  response=fakeResponse();await handler({method:'POST',headers:{authorization:'Bearer '+trusted},body:{url:'https://www.vueling.com/en/vueling-services/prepare-your-trip/pets-on-board',text:'Pets in cabin 10 kg. '.repeat(25),reference:{id:'VY'}}},response);
  assert.equal(response.code,200);assert.equal(response.body.requires_review,true);assert.equal(calls,1);
 }finally{globalThis.fetch=original;if(key===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=key;}
});
