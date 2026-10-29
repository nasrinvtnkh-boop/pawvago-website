"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {listAirlines,screenCabin,policyDetails}=require("../lib/pawvago-policy.cjs");

test("directory distinguishes reviewed from unverified airlines",()=>{
  const result=listAirlines("Aer Lingus");
  assert.equal(result.airlines.length,1);
  assert.equal(result.airlines[0].reviewed,false);
  assert.ok(result.reviewed_on);
});

test("known reviewed airline returns preliminary weight match without booking claim",()=>{
  const result=screenCabin({airline:"Air France",petWeightKg:6,carrierWeightKg:1.5,breed:"Shih Tzu",from:"France",to:"Spain"});
  assert.equal(result.status,"preliminary-weight-match");
  assert.ok(result.issues.some(v=>v.includes("short-nosed")));
  assert.ok(result.disclaimer.includes("NOT a booking confirmation"));
});

test("overweight cabin case is flagged, not recommended",()=>{
  const result=screenCabin({airline:"Air France",petWeightKg:18,carrierWeightKg:1});
  assert.equal(result.status,"preliminary-mismatch");
});

test("unreviewed airline never gets a weight-match verdict",()=>{
  const result=screenCabin({airline:"Aer Lingus",petWeightKg:5,carrierWeightKg:1});
  assert.equal(result.status,"needs-verification");
  assert.equal(result.cabin_allowed,null);
});

test("unknown airline remains unknown rather than invented",()=>{
  const result=screenCabin({airline:"Airline That Does Not Exist",petWeightKg:5,carrierWeightKg:1});
  assert.equal(result.status,"unknown-airline");
});

test("invalid weights cannot produce a preliminary match",()=>{
  const result=screenCabin({airline:"Air France",petWeightKg:-1,carrierWeightKg:1});
  assert.equal(result.status,"needs-verification");
});

test("policy details expose reviewed status and source date",()=>{
  const result=policyDetails("Air France");
  assert.equal(result.found,true);
  assert.equal(result.reviewed,true);
  assert.ok(result.reviewed_on);
});
