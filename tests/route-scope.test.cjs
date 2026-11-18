const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const context=vm.createContext({window:{}});
vm.runInContext(readFileSync(__dirname+'/../route-scope.js','utf8'),context);
const {scope,country,continents}=context.window.PawVagoRouteScope;
const carriers=[{id:'AC',region:'North America'},{id:'AM',region:'North America'},{id:'TK',region:'Europe'},{id:'PC',region:'Europe'},{id:'BA',region:'Europe'},{id:'AF',region:'Europe'},{id:'SQ',region:'Asia'},{id:'QR',region:'Middle East'},{id:'LA',region:'South America'},{id:'QF',region:'Oceania'},{id:'AT',region:'Africa'}];
for(const route of [['GB','TR'],['London, United Kingdom','Istanbul, Turkey'],['لندن','ترکیه'],['TR','GB']]){
 const result=scope(carriers,...route);
 assert.equal(result.filtered,true);
 assert.equal(result.airlines.length,6);
 assert.ok(!result.airlines.some(a=>['AC','AM','LA','QF','AT'].includes(a.id)));
 assert.ok(result.airlines.some(a=>a.id==='TK'));
}
assert.equal(country('London Heathrow'),'GB');
assert.equal(country('Antalya'),'TR');
assert.equal(scope(carriers,'FR','CA').filtered,true);
assert.deepEqual(Array.from(scope(carriers,'FR','CA').continents),['Europe','North America']);
assert.ok(scope(carriers,'FR','CA').airlines.some(a=>a.id==='AC'));
assert.ok(!scope(carriers,'FR','CA').airlines.some(a=>a.id==='QR'));
assert.deepEqual(Array.from(scope(carriers,'US','MX').continents),['North America']);
assert.equal(scope(carriers,'FR','ES').airlines.length,4);
assert.equal(scope(carriers,'','').airlines.length,carriers.length);
assert.equal(scope(carriers,'FR','').airlines.length,4);
assert.deepEqual(Array.from(continents('Turkey')),['Europe','Asia']);
console.log('PASS: continent union, both directions, city/Persian names, single selection, reset, domestic and cross-continent journeys.');
