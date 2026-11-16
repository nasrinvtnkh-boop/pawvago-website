const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),data=JSON.parse(fs.readFileSync(path.join(root,'data/pet-policy-snapshot.json'),'utf8'));
const context={window:{},Intl};vm.runInNewContext(fs.readFileSync(path.join(root,'airline-matcher.js'),'utf8'),context);
const airlines=data.airlines.filter(a=>a.region==='North America');
assert.equal(airlines.length,18);assert.equal(new Set(data.airlines.map(a=>a.id)).size,data.airlines.length);
for(const a of airlines){assert.equal(a.policy_status,'reviewed');assert.equal(a.reviewed_on,'2026-11-16');assert.match(a.source,/^https:\/\//);assert.ok(a.notes&&a.notes_fa);}
assert.equal(data.catalog_info.reviewed,data.airlines.filter(a=>a.policy_status==='reviewed').length);
for(const code of ['US','CA','MX'])assert.ok(data.countries.some(c=>c.code===code));
const options={petKg:4,cabinKg:1,crateKg:4,cabinDims:[30,20,18],crateDims:[70,45,50],breed:'Labrador',snub:false,from:'US',to:'US',placement:'cabin'};
const get=(id,changes={})=>context.window.PawVagoAirMatcher.evaluate([airlines.find(a=>a.id===id)],{...options,...changes}).entries[0];
assert.notEqual(get('DL').best.kind,'unverified');
assert.equal(get('AA',{from:'FR',to:'US'}).cabin.kind,'blocked');
assert.equal(get('WN',{from:'US',to:'MX'}).cabin.kind,'blocked');
assert.equal(get('F9',{from:'US',to:'MX'}).cabin.kind,'blocked');
assert.equal(get('TS',{petKg:8,cabinKg:1}).cabin.kind,'blocked');
assert.equal(get('AM',{petKg:9,cabinKg:1}).cabin.kind,'blocked');
assert.equal(get('WS',{placement:'hold',snub:true}).hold.kind,'blocked');
assert.equal(get('WS',{placement:'hold',from:'CA',to:'IE'}).hold.kind,'blocked');
assert.equal(get('AC',{placement:'hold',crateDims:[110,100,100]}).hold.kind,'blocked');
assert.equal(get('Y4',{placement:'hold',crateDims:[80,60,91]}).hold.kind,'blocked');
assert.equal(get('AA',{placement:'hold'}).hold.kind,'blocked');
assert.equal(get('UA',{placement:'hold'}).hold.kind,'review');
assert.equal(get('DL',{cabinDims:[48,28,28]}).cabin.kind,'review'); // recommendation is not a universal limit
assert.notEqual(get('B6').cabin.kind,'unverified');
assert.equal(data.airlines.find(a=>a.id==='AF').reviewed_on,'2026-10-21');
console.log('PASS: 18 carrier records; source dates; country availability; cabin/hold route, weight, size and breed restrictions; unknown fields remain cautious.');
