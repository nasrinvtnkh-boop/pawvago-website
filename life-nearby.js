/* Opt-in location discovery; no third-party map API keys, no GPS persistence. */
(() => {
"use strict";
document.addEventListener("DOMContentLoaded",()=>{
 const $=id=>document.getElementById(id),db=typeof sb!=="undefined"?sb:null;
 const target=$("pvl-nearby-results"),button=$("pvl-find-nearby");
 if(!target||!button)return;
 const groups={
  veterinarian:["veterinarian","vet","veterinary","veterinary_clinic"],
  emergency_vet:["emergency_vet","emergency veterinarian","veterinarian","vet"],
  pet_shop:["pet_shop","pet shop","pet_store"],
  groomer:["groomer","grooming","pet_groomer"],
  boarding:["boarding","pet_sitter","pet_boarding","kennel"],
  hotel:["pet_hotel","pet_friendly_hotel","hotel"]
 };
 const query={veterinarian:"veterinarian",emergency_vet:"emergency veterinarian",
  pet_shop:"pet shop",groomer:"pet groomer",boarding:"pet boarding",hotel:"pet friendly hotel"};
 const text=(tag,s,cls)=>{const n=document.createElement(tag);n.textContent=s;if(cls)n.className=cls;return n};
 const link=(label,url)=>{
  const a=text("a",label,"pvl-partner-link");a.href=url;a.target="_blank";a.rel="noopener noreferrer";return a;
 };
 const km=(a,b,c,d)=>{
  const toRadians=v=>v*Math.PI/180;
  const x=toRadians(c-a),y=toRadians(d-b);
  const t=Math.sin(x/2)**2+Math.cos(toRadians(a))*Math.cos(toRadians(c))*Math.sin(y/2)**2;
  return 12742*Math.atan2(Math.sqrt(t),Math.sqrt(1-t));
 };
 button.onclick=()=>{
  if(!navigator.geolocation){
   target.replaceChildren(text("p","This browser does not support location. Please search in your preferred map app.","pvl-help"));return;
  }
  const category=$("pvl-place-category").value;
  target.replaceChildren(text("p","Requesting location permission…","pvl-help"));
  button.disabled=true;
  navigator.geolocation.getCurrentPosition(async pos=>{
   const lat=pos.coords.latitude,lon=pos.coords.longitude;
   target.replaceChildren();
   try {
    if(!db)throw new Error("Directory not available");
    const result=await db.from("service_providers")
      .select("id,name,category,latitude,longitude,address,is_verified")
      .eq("is_active",true).not("latitude","is",null).not("longitude","is",null).limit(500);
    if(result.error)throw result.error;
    const nearby=(result.data||[])
     .filter(p=>groups[category].includes(String(p.category||"").toLowerCase()))
     .map(p=>({...p,distance:km(lat,lon,Number(p.latitude),Number(p.longitude))}))
     .filter(p=>Number.isFinite(p.distance)&&p.distance<=35)
     .sort((a,b)=>a.distance-b.distance).slice(0,10);
    if(!nearby.length)target.append(text("p","No entries for this category in the PawVago directory nearby. Try a live map search below.","pvl-help"));
    for(const p of nearby){
     const item=text("div","","pvl-item");
     const details=text("div","","");
     details.append(text("strong",p.name),text("small",p.distance.toFixed(1)+" km · "+
       (p.is_verified===true?"Directory-verified listing":"Provider not independently verified")));
     const href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(p.name+" "+(p.address||"")+" "+p.latitude+","+p.longitude);
     item.append(details,link("Directions",href));target.append(item);
    }
   } catch(e){
    target.append(text("p","PawVago's provider directory is unavailable. You can look for current businesses on an external map.","pvl-help"));
   }
   const href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(query[category]+" near "+lat.toFixed(4)+","+lon.toFixed(4));
   target.append(link("Search this category on Google Maps →",href),
     text("p","Location was used for this search only and is not saved. Opening Google Maps shares the approximate coordinates with Google.","pvl-help"));
   button.disabled=false;
  },err=>{
   target.replaceChildren(text("p",err.code===1?"Location permission declined. No location was used.":"Location unavailable. Please retry or search manually in a map app.","pvl-help"));
   button.disabled=false;
  },{enableHighAccuracy:false,timeout:12000,maximumAge:120000});
 };
});
})();