"use strict";
const {listAirlines, screenCabin, policyDetails}=require("../lib/pawvago-policy.cjs");

module.exports = async function handler(req,res) {
  res.setHeader("Cache-Control","no-store");
  res.setHeader("X-Content-Type-Options","nosniff");
  if (req.method!=="POST") return res.status(405).json({error:"POST required"});
  const length=Number(req.headers["content-length"]||0);
  if (length>8000) return res.status(413).json({error:"Request too large"});
  const body=req.body && typeof req.body==="object" ? req.body : {};
  const action=String(body.action||"screen").slice(0,32);
  try {
    if (action==="list") return res.status(200).json(listAirlines(String(body.query||"")));
    if (action==="policy") return res.status(200).json(policyDetails(String(body.airline||"")));
    if (action!=="screen") return res.status(400).json({error:"Unknown action"});
    if (!body.airline || typeof body.airline!=="string") return res.status(400).json({error:"Provide an airline name"});
    const reply=screenCabin({
      airline:body.airline,
      petWeightKg:body.petWeightKg,
      carrierWeightKg:body.carrierWeightKg,
      breed:typeof body.breed==="string" ? body.breed.slice(0,100):"",
      from:typeof body.from==="string" ? body.from.slice(0,70):"",
      to:typeof body.to==="string" ? body.to.slice(0,70):""
    });
    return res.status(200).json(reply);
  } catch (err) {
    console.error("PawVago policy agent error",err);
    return res.status(500).json({error:"The policy assistant could not process this request"});
  }
};
