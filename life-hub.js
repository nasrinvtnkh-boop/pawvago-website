(() => {
"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);
  const db = typeof sb !== "undefined" ? sb : null;
  const store = {uid:null,pets:[],petId:null,docs:[],reminders:[],vets:[]};
  const show = text => {$("pvl-status").textContent = text;};
  const elem = (tag,text,cls) => {
    const node = document.createElement(tag);
    if(text !== undefined)node.textContent=String(text);
    if(cls)node.className=cls;
    return node;
  };
  const clear = (id,message) => $(id).replaceChildren(elem("p",message,"pvl-muted"));
  const dateText = d => {
    if(!d)return "No expiry";
    const days = Math.round((new Date(d+"T12:00:00")-new Date().setHours(12,0,0,0))/86400000);
    return days<0?"Overdue "+Math.abs(days)+" days":days===0?"Due today":days<=30?"Due in "+days+" days":d;
  };
  const pet = () => store.pets.find(x=>x.id===store.petId);
  function mode(name){
    const isTravel=name==="travel";
    $("pvl-travel").hidden=!isTravel;$("pvl-everyday").hidden=isTravel;
    $("pvl-tab-travel").setAttribute("aria-selected",String(isTravel));
    $("pvl-tab-everyday").setAttribute("aria-selected",String(!isTravel));
    if(!isTravel)void load();
  }
  $("pvlDashboardOpen")?.addEventListener("click",()=>{
    if(typeof window.show==="function")window.show("home");
    mode("everyday");
    document.getElementById("paw-life-hub")?.scrollIntoView({behavior:"smooth",block:"start"});
  });
  $("pvl-tab-travel").onclick=()=>mode("travel");
  $("pvl-tab-everyday").onclick=()=>mode("everyday");
  document.querySelectorAll("[data-pvl-open]").forEach(button=>button.addEventListener("click",()=>{
    mode(button.dataset.pvlOpen);
    if(button.dataset.pvlFocus==="nearby")$("pvl-nearby").scrollIntoView({behavior:"smooth"});
  }));
  const informLogin=()=>{
    if(store.uid)return true;
    if(typeof auth==="function")auth("signup");
    show("Please sign in to save data securely.");return false;
  };
  function renderPets(){
    const select=$("pvl-pet-select");select.replaceChildren(elem("option","Choose pet"));
    select.firstChild.value="";
    for(const p of store.pets){const option=elem("option",p.name+" · "+p.species);option.value=p.id;select.append(option)}
    select.value=store.petId||"";select.disabled=!store.pets.length;
    $("pvl-account").textContent=store.uid?store.pets.length+" saved companion(s).":"Sign in to save your pet profiles.";
    const stats=$("pvl-pet-summary");stats.replaceChildren();
    const p=pet();
    if(p)for(const [label,value] of [["Pet",p.name],["Breed",p.breed||"Not set"],["Weight",p.weight_kg?p.weight_kg+" kg":"Not set"],["Rabies until",p.rabies_valid_until||"Not set"]]){
      const item=elem("div",undefined,"pvl-stat");item.append(elem("strong",value),elem("span",label));stats.append(item);
    }
  }
  function fillPetForm(){
    const f=$("pvl-pet-form"),p=pet();f.reset();
    if(p)for(const field of ["name","species","breed","weight_kg","date_of_birth","rabies_valid_until"])
      if(f.elements[field])f.elements[field].value=p[field]??"";
  }
  async function fetchDetails(){
    store.docs=[];store.reminders=[];store.vets=[];
    if(!store.petId||!store.uid)return;
    for(const [name,table,sort] of [["docs","pet_documents","created_at"],["reminders","pet_care_reminders","due_date"],["vets","pet_vet_contacts","created_at"]]){
      const r=await db.from(table).select("*").eq("pet_id",store.petId).eq("user_id",store.uid).order(sort,{ascending:name==="reminders"}).limit(80);
      if(r.error)throw r.error;store[name]=r.data||[];
    }
  }
  function makeRow(title,detail,handlers){
    const row=elem("div",undefined,"pvl-item"),info=elem("div");
    info.append(elem("strong",title),elem("small",detail));row.append(info);
    for(const [label,fn] of handlers){
      const btn=elem("button",label,"pvl-mini");btn.type="button";btn.onclick=fn;row.append(btn);
    }
    return row;
  }
  function renderRecords(){
    for(const [key,id,title] of [["docs","pvl-docs-list","No saved document dates."],["reminders","pvl-reminder-list","No saved reminders."],["vets","pvl-vet-list","No saved veterinarians."]]){
      const wrap=$(id);wrap.replaceChildren();
      if(!store.petId){wrap.append(elem("p","Select a saved pet first.","pvl-muted"));continue}
      if(!store[key].length){wrap.append(elem("p",title,"pvl-muted"));continue}
      for(const item of store[key]){
        const name=key==="docs"?(item.document_name||item.document_type):key==="vets"?item.clinic_name:item.title;
        const note=key==="docs"?(item.document_type+" · "+dateText(item.expiry_date)):
          key==="vets"?[item.address,item.phone].filter(Boolean).join(" · "):
          item.category+" · "+dateText(item.due_date)+(item.completed?" · Complete":"");
        const actions=[];
        if(key==="reminders")actions.push([item.completed?"Reopen":"Done",()=>void mark(item.id,!item.completed)]);
        actions.push(["Delete",()=>void remove(key,item.id)]);
        wrap.append(makeRow(name,note,actions));
      }
    }
    const entries=[...store.reminders.filter(x=>!x.completed).map(x=>({date:x.due_date,title:x.title})),
      ...store.docs.filter(x=>x.expiry_date).map(x=>({date:x.expiry_date,title:x.document_name||"Document"}))];
    const p=pet();if(p?.rabies_valid_until)entries.push({date:p.rabies_valid_until,title:"Rabies vaccination"});
    const due=entries.filter(x=>{
      const days=(new Date(x.date+"T12:00:00")-new Date().setHours(12,0,0,0))/86400000;
      return Number.isFinite(days)&&days<=30;
    }).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5);
    $("pvl-due-summary").textContent=!p?"Select a pet to see reminders.":due.length?due.map(x=>x.title+": "+dateText(x.date)).join(" · "):"No upcoming dates within 30 days.";
  }
  const render=()=>{renderPets();renderRecords()};
  async function load(){
    if(!db){show("Account service unavailable; map search remains accessible.");return}
    try{
      const {data,error}=await db.auth.getUser();if(error)throw error;
      if(!data?.user){
        store.uid=null;store.pets=[];store.petId=null;store.docs=[];store.reminders=[];store.vets=[];
        render();show("Sign in to securely manage pets, documents and care reminders.");return;
      }
      if(data.user.id!==store.uid)store.petId=null;
      store.uid=data.user.id;
      const r=await db.from("pets").select("id,name,species,breed,weight_kg,date_of_birth,rabies_valid_until").eq("user_id",store.uid).order("created_at").limit(80);
      if(r.error)throw r.error;store.pets=r.data||[];
      if(!store.pets.some(x=>x.id===store.petId))store.petId=store.pets[0]?.id||null;
      await fetchDetails();render();fillPetForm();
      show("Records are private to your PawVago account. Reminders display in-app on return visits.");
    }catch(e){show("Could not load account records: "+e.message)}
  }
  async function updateRecords(table,data,form){
    if(!informLogin())return;
    if(!store.petId){show("Save a pet first.");return}
    const r=await db.from(table).insert({...data,user_id:store.uid,pet_id:store.petId});
    if(r.error){show("Saving failed: "+r.error.message);return}
    form.reset();await fetchDetails();render();show("Saved to your PawVago account.");
  }
  async function remove(type,id){
    if(!store.uid||!store.petId||!confirm("Delete this record?"))return;
    const table={docs:"pet_documents",reminders:"pet_care_reminders",vets:"pet_vet_contacts"}[type];
    const r=await db.from(table).delete().eq("id",id).eq("user_id",store.uid).eq("pet_id",store.petId);
    if(r.error){show(r.error.message);return}
    await fetchDetails();render();show("Record deleted.");
  }
  async function mark(id,completed){
    const r=await db.from("pet_care_reminders").update({completed}).eq("id",id).eq("user_id",store.uid).eq("pet_id",store.petId);
    if(r.error){show(r.error.message);return}
    await fetchDetails();render();
  }
  $("pvl-pet-select").onchange=async e=>{store.petId=e.target.value||null;await fetchDetails();render();fillPetForm()};
  $("pvl-new-pet").onclick=()=>{store.petId=null;$("pvl-pet-select").value="";fillPetForm();renderRecords();show("Enter another pet profile.")};
  $("pvl-reload").onclick=()=>void load();
  $("pvl-pet-form").onsubmit=async e=>{
    e.preventDefault();if(!informLogin())return;
    const f=e.currentTarget,d=new FormData(f);
    const row={user_id:store.uid,name:String(d.get("name")||"").trim(),species:String(d.get("species")||"Dog"),
      breed:String(d.get("breed")||"").trim()||null,weight_kg:d.get("weight_kg")?Number(d.get("weight_kg")):null,
      date_of_birth:d.get("date_of_birth")||null,rabies_valid_until:d.get("rabies_valid_until")||null};
    if(!row.name||row.weight_kg!==null&&!(row.weight_kg>0&&row.weight_kg<=200)){show("Invalid pet name or weight.");return}
    const q=store.petId?db.from("pets").update(row).eq("id",store.petId).eq("user_id",store.uid):db.from("pets").insert(row);
    const res=await q.select("id").single();if(res.error){show(res.error.message);return}
    store.petId=res.data.id;await load();
    if(typeof loadUserData==="function"){await loadUserData();if(typeof refresh==="function")await refresh()}
  };
  for(const [id,table,fields] of [
    ["pvl-doc-form","pet_documents",["document_type","document_name","issue_date","expiry_date"]],
    ["pvl-reminder-form","pet_care_reminders",["category","title","due_date","notes"]],
    ["pvl-vet-form","pet_vet_contacts",["clinic_name","phone","address","website"]]
  ])$(id).onsubmit=e=>{
    e.preventDefault();const f=e.currentTarget,d=new FormData(f),row={};
    for(const field of fields){const value=String(d.get(field)||"").trim();if(value)row[field]=value}
    void updateRecords(table,row,f);
  };
  if(db)db.auth.onAuthStateChange(()=>setTimeout(()=>void load(),0));
  void load();
});
})();