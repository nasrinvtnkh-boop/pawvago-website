const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const nodes = new Map();
function node(id) {
  if (!nodes.has(id)) nodes.set(id, {
    id, value: '', textContent: '', innerHTML: '', dataset: {}, listeners: {},
    classList: { add(){}, remove(){}, contains(){return false;}, toggle(){} },
    addEventListener(name, fn){ this.listeners[name] = fn; },
    querySelector(){return null;}, setAttribute(){}, removeAttribute(){}, scrollIntoView(){}
  });
  return nodes.get(id);
}
const buttons = ['dashboard','pets','trip','documents','places','community'].map(action => {
  const b = node(action+'Nav'); b.dataset.dashboardAction = action; return b;
});
let callback;
const writes = [];
const client = {
  auth: { getSession: async()=>({data:{session:null}}), onAuthStateChange(fn){callback=fn;} },
  from(table){return {
    insert(data){writes.push({table,operation:'insert',data});return this;},
    update(data){writes.push({table,operation:'update',data});return this;},
    eq(){return this;}, select(){return this;}, single:async()=>({data:{id:'saved-trip'}})
  };}
};
const context = vm.createContext({
  console, setTimeout, Date, fetch: async()=>({ok:false}),
  window:{PAWVAGO_CONFIG:{SUPABASE_URL:'test',SUPABASE_ANON_KEY:'test'},supabase:{createClient:()=>client},scrollTo(){}},
  location:{hash:''}, document:{documentElement:{lang:'en'},getElementById:node,
    querySelectorAll(selector){return selector==='.side-nav button'?buttons:[];},
    createElement:()=>node('created'),head:{appendChild(){}},body:{appendChild(){}}
  }
});
vm.runInContext(fs.readFileSync(__dirname+'/../app.js','utf8'),context);
async function run(){
  await new Promise(resolve=>setTimeout(resolve,0));
  vm.runInContext("user={id:'test-user'}; pet={id:'pet-1'}; trip={id:'old-trip',from:'Paris',to:'Madrid',date:'2027-01-01'};",context);
  buttons[2].listeners.click();
  assert.equal(node('tripFrom').value,'');
  assert.equal(vm.runInContext('tripEditingId',context),null);
  vm.runInContext('openTrip(true)',context);
  assert.equal(node('tripFrom').value,'Paris');
  assert.equal(vm.runInContext('tripEditingId',context),'old-trip');
  vm.runInContext('loadTravelData=async()=>{}; openTrip()',context);
  node('tripFrom').value='Nantes';node('tripTo').value='Barcelona';node('tripDate').value='2027-02-01';
  await context.saveTrip({preventDefault(){}});
  assert.equal(writes.at(-1).operation,'insert');
  assert.equal(writes.at(-1).data.user_id,'test-user');
  vm.runInContext('openTrip(true)',context);
  await context.saveTrip({preventDefault(){}});
  assert.equal(writes.at(-1).operation,'update');
  vm.runInContext('pet=null; openTrip()',context);
  assert.equal(vm.runInContext('pendingTrip',context),true);
  context.closePet();
  assert.equal(vm.runInContext('pendingTrip',context),false);
  assert.equal(callback.constructor.name,'Function');
  assert.equal(callback('TOKEN_REFRESHED',{user:{id:'test-user'}}),undefined);
  for(const button of buttons) assert.equal(typeof button.listeners.click,'function');
  context.auth('signup');assert.match(node('switchAuth').textContent,/Log in/);
  node('switchAuth').listeners.click();assert.match(node('switchAuth').textContent,/Create account/);
  console.log('PASS: sidebar events, new trip INSERT, edit UPDATE, pet prerequisite, auth callback and mode switch');
}
run().catch(error=>{console.error(error);process.exitCode=1;});
