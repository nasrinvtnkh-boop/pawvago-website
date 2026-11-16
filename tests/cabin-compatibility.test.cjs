const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const policy = JSON.parse(fs.readFileSync(__dirname+'/../data/pet-policy-snapshot.json','utf8'));
const client = {from(){return {select(){return this},eq(){return this},limit(){return this},then(resolve){return Promise.resolve({data:[]}).then(resolve)}};}};
const context = vm.createContext({console, Date, setTimeout, localStorage:{getItem(){return null;}},
 window:{PAWVAGO_CONFIG:{SUPABASE_URL:'test',SUPABASE_ANON_KEY:'test'},supabase:{createClient:()=>client}},
 document:{documentElement:{lang:'en'},getElementById(){return null;}},
 fetch:async()=>({ok:true,json:async()=>policy})});
const source=fs.readFileSync(__dirname+'/../app.js','utf8');
vm.runInContext(source.slice(0,source.lastIndexOf('\nensureStyles();')),context);
const run=code=>vm.runInContext(code,context);
async function main(){
 run("user={id:'u'};pet={id:'p',name:'Titi',species:'Dog',breed:'Shih Tzu',weight_kg:8};trip={from:'France',to:'Canada',destination_country:'Canada'}");
 await context.loadTravelData();
 const airline=id=>run(`airlineData.find(a=>a.id==='${id}')`);
 const verdict=id=>context.airlineResult(airline(id),context.getActiveRule(airline(id)));
 assert.equal(verdict('A3').status,'Not compatible','8 kg pet cannot meet 8 kg combined limit');
 assert.equal(verdict('VY').status,'Check','Missing bag cannot pass');
 run("cabinCarrier={kg:1,length:45,width:39,height:21,type:'soft',comfortable:true}");
 assert.equal(verdict('VY').status,'Compatible');
 assert.equal(verdict('AF').status,'Not compatible');
 run('cabinCarrier.height=22');assert.equal(verdict('VY').status,'Not compatible');
 run("cabinCarrier={kg:1,length:43,width:40,height:20,type:'soft',comfortable:true}");
 assert.equal(airline('AC').name,'Air Canada');
 assert.equal(verdict('AC').status,'Check','Aircraft required');
 run("cabinAircraft.set('AC','0')");assert.equal(verdict('AC').status,'Compatible');
 assert.match(context.renderCabinAirline(airline('AC'),context.getActiveRule(airline('AC')),verdict('AC')),/43 × 40 × 20/);
 run("cabinCarrier={kg:1,length:40,width:30,height:30,type:'soft',comfortable:true}");
 assert.equal(verdict('UX').status,'Not compatible','Air Europa short-nosed cap applied');
 run("pet.breed='Beagle'");assert.equal(verdict('UX').status,'Compatible');
 run("cabinCarrier.kg=2.01");assert.equal(verdict('UX').status,'Not compatible');
 run("cabinCarrier.kg=2; cabinCarrier.type='hard'");assert.equal(verdict('UX').status,'Not compatible');
 run("cabinCarrier.type='soft';cabinCarrier.comfortable=false");assert.equal(verdict('UX').status,'Check');
 run("trip.destination_country='United Kingdom'");assert.equal(verdict('VY').status,'Not compatible');
 run("trip.destination_country='Canada';pet.species='Other'");assert.equal(verdict('VY').status,'Check');
 run("pet.species='Dog';document.documentElement.lang='fa'");
 assert.match(context.renderCabinAirline(airline('A3'),context.getActiveRule(airline('A3')),verdict('A3')),/۵۵ × ۴۰ × ۲۳/);
 assert.equal(context.airlineResult({name:'Unknown'},null).status,'Check');
 console.log('PASS 16 cabin checks: exact combined limit, missing data, overweight, oversize, aircraft variants, breed cap, hard carrier, fit confirmation, GB arrival, species and Persian dimensions.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
