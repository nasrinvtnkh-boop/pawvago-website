"use strict";
const { listAirlines, policyDetails } = require("../lib/pawvago-policy.cjs");
const snapshot=require("../data/pet-policy-snapshot.json");

function answer(message) {
 const text=String(message||"").trim().slice(0,600);
 const low=text.toLocaleLowerCase("en-US");
 if(!text) return {answer:"Tell me your travel question. Start with your airline, pet weight, and destination.", next:"Share the airline name and pet + carrier weights.",mode:"guided-policy-preview"};
 const match=snapshot.airlines
  .filter(a=>a.name.length>3)
  .sort((a,b)=>b.name.length-a.name.length)
  .find(a=>low.includes(a.name.toLocaleLowerCase("en-US")));
 if(match) {
  const rule=policyDetails(match.name);
  if (!rule.reviewed) return {answer:match.name+" appears in our directory, but its pet travel policy has not been independently reviewed. Please verify cabin/hold rules, breed restrictions and the specific itinerary directly with the operating airline.",next:"Check another airline or review its official website.",reviewed_on:rule.reviewed_on,mode:"guided-policy-preview"};
  const cabin=rule.cabin_allowed===true
   ? "Our last-reviewed directory indicates that ordinary cabin pets may be accepted subject to restrictions"+(rule.cabin_max_kg!=null?"; general maximum combined pet and carrier weight: "+rule.cabin_max_kg+" kg":"")+"."
   : rule.cabin_allowed===false
    ? "Our last-reviewed directory indicates ordinary cabin pets are not accepted."
    : "Cabin pet acceptance could not be confirmed.";
  return {answer:match.name+": "+cabin+" This is not a live availability check. Confirm dimensions, short-nosed breed rules, route, transit, pet space and current policy directly before booking.",next:"Use the structured Trip Checker below to compare weights. This assistant does not book flights.",reviewed_on:rule.reviewed_on,sources:rule.source_urls,mode:"guided-policy-preview"};
 }
 if(/(cost|price|how much|booking|book|reserv|ticket|billet|رزرو|بلیط|قیمت)/iu.test(low))
  return {answer:"PawVago cannot currently search live fares, reserve a pet space, or book tickets. Ask the operating airline directly to confirm pet availability and total charges before purchasing.",next:"You can use PawVago's preliminary Trip Checker for general pet rules.",mode:"guided-policy-preview"};
 if(/(documents?|passport|rabies|vaccine|microchip|certificate|entry requirements?|visa|vaccin|passeport|carte|documents?|مدارک|پاسپورت|واکسن|گواهی)/iu.test(low))
  return {answer:"For pet travel, official requirements may include identification (microchip), rabies vaccination, passports or official health certificates, and destination/transit-specific conditions. The exact combination depends on species, departure, destination, transit route and date. PawVago's current preview cannot verify your paperwork or certify compliance. Check the destination authority and your veterinarian.",next:"Tell me the departure and destination countries, the pet species and the travel date.",mode:"guided-policy-preview"};
 if(/(airline|flight|fly|flying|cabin|hold|cargo|compagnie|avion|vol|cabine|transport|هواپیما|ایرلاین|کابین|بار)/iu.test(low)) {
  const dir=listAirlines("");
  const reviewed=snapshot.airlines.filter(a=>a.policy_status==="reviewed").slice(0,6).map(a=>a.name);
  return {answer:"Our airline-policy directory contains "+snapshot.airlines.length+" airlines, of which "+snapshot.airlines.filter(a=>a.policy_status==="reviewed").length+" have reviewed entries. Examples of reviewed airlines: "+reviewed.join(", ")+". This is NOT a route or live pet-space search. Provide the airline name, animal + carrier weights, and route for preliminary screening.",next:"Try: What is Air France's cabin pet policy?",reviewed_on:dir.reviewed_on,mode:"guided-policy-preview"};
 }
 return {answer:"I can guide you through preliminary airline pet policies and document questions. For a tailored answer, please share: departure country, destination country, date, species, breed, pet weight, carrier weight, and airline (if known). This free preview uses reviewed policy data; it is not yet a generative AI chat or booking engine.",next:"Try: What is Air France's cabin pet policy? Or: What documents does my dog need?",mode:"guided-policy-preview"};
}

module.exports=async function handler(req,res) {
 res.setHeader("Cache-Control","no-store");
 res.setHeader("X-Content-Type-Options","nosniff");
 if(req.method!=="POST")return res.status(405).json({error:"POST required"});
 if(Number(req.headers["content-length"]||0)>4000)return res.status(413).json({error:"Request too large"});
 const body=req.body&&typeof req.body==="object"?req.body:{};
 if(typeof body.message!=="string")return res.status(400).json({error:"Message required"});
 return res.status(200).json(answer(body.message));
};
module.exports._answer=answer;
