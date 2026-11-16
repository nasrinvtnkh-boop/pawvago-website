import {readFileSync} from 'node:fs';
const root=new URL('../',import.meta.url),report=JSON.parse(readFileSync(new URL('.policy-monitor/report.json',root),'utf8'));
const token=process.env.GITHUB_TOKEN;if(!token)throw Error('Workflow issue permission unavailable');
const repository='nasrinvtnkh-boop/pawvago-website',title='PawVago policy monitor: review queue';
async function api(path,method='GET',body){const r=await fetch('https://api.github.com'+path,{method,headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','Content-Type':'application/json','X-GitHub-Api-Version':'2022-11-28'},body:body?JSON.stringify(body):undefined});if(!r.ok)throw Error('Issue update HTTP '+r.status);return r.json();}
const found=await api('/search/issues?q='+encodeURIComponent('repo:'+repository+' is:issue is:open "'+title+'" in:title'));
const issue=found.items?.find(i=>i.title===title);
if(!report.summary.changed&&!report.summary.blocked_or_failed&&!report.summary.baselines_created&&!issue){console.log('No review alert required');process.exit(0);}
let body='<!-- pawvago-policy-monitor-v2 -->\n'+readFileSync(new URL('.policy-monitor/report.md',root),'utf8');
if(body.length>55000)body=body.slice(0,54000)+'\n\nSee the complete JSON artifact for remaining sources.\n';
await api('/repos/'+repository+'/issues'+(issue?'/'+issue.number:''),issue?'PATCH':'POST',{title,body});
console.log(issue?'Updated existing monitor review queue':'Created monitor review queue');
