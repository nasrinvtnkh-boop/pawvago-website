"use strict";

// Shared, read-only screening logic for the PawVago website and ChatGPT MCP plugin.
// Never treat this curated snapshot as live inventory or government guidance.
const snapshot = require("../data/pet-policy-snapshot.json");

const normalized = s => String(s ?? "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const safeNum = value => value !== "" && value != null && Number.isFinite(Number(value)) ? Number(value) : null;
const source = a => {
  const urls = [a.source,a.hold?.source].filter(s => typeof s === "string" && /^https?:\/\//.test(s));
  return [...new Set(urls)];
};

function listAirlines(search = "") {
  const term = normalized(search).slice(0,120);
  const results = snapshot.airlines.filter(a => !term || normalized(a.name).includes(term) || normalized(a.id) === term);
  return {
    reviewed_on: snapshot.reviewed_on,
    limitations: snapshot.quality,
    airlines: results.slice(0,25).map(a => ({ id:a.id, name:a.name, reviewed:a.policy_status === "reviewed" })),
    has_more: results.length > 25
  };
}

function screenCabin({airline,petWeightKg,carrierWeightKg,breed,from,to}) {
  const term = normalized(airline).slice(0,120);
  const selected = snapshot.airlines.find(a => normalized(a.name) === term || normalized(a.id) === term)
    || (term.length >= 3 ? snapshot.airlines.find(a => normalized(a.name).includes(term)) : null);
  if (!selected) return {
    status:"unknown-airline", reason:"Airline is not in the PawVago curated snapshot.",
    reviewed_on:snapshot.reviewed_on, disclaimer:"No pet travel eligibility has been established."
  };
  const issues = [];
  const pet = safeNum(petWeightKg), carrier = safeNum(carrierWeightKg);
  const max = safeNum(selected.cabin_max_kg);
  let status="needs-verification";
  if (selected.policy_status !== "reviewed") {
    issues.push("This airline's pet policy has not been independently reviewed by PawVago.");
  } else if (selected.cabin_allowed === false) {
    status="preliminary-mismatch"; issues.push("The reviewed airline policy does not permit ordinary cabin pets.");
  } else if (selected.cabin_allowed !== true) {
    issues.push("Cabin acceptance has not been verified.");
  } else if (pet == null || pet <= 0 || carrier == null || carrier < 0) {
    issues.push("Enter both the pet weight and the carrier weight to check the combined cabin allowance.");
  } else if (max == null) {
    issues.push("A universal cabin weight limit has not been verified.");
  } else if (pet + carrier > max) {
    status="preliminary-mismatch";
    issues.push("Pet + carrier weight (" + (pet+carrier).toFixed(1) + " kg) exceeds the reviewed " + max + " kg cabin limit.");
  } else {
    status="preliminary-weight-match";
    issues.push("The combined weight is within the reviewed general cabin limit, but flight-specific acceptance is not confirmed.");
  }
  if (!breed) issues.push("Breed not supplied; check brachycephalic and breed restrictions.");
  if (!from || !to) issues.push("Route not supplied; route-specific restrictions remain unchecked.");
  issues.push("Carrier dimensions, flight/date availability, transit rules and official entry documents must be confirmed directly.");
  return {
    status, airline:selected.name, airline_id:selected.id, breed:breed||null,
    weight_limit_kg:max, combined_weight_kg:pet!=null && carrier!=null ? pet+carrier : null,
    cabin_allowed:selected.policy_status==="reviewed" ? selected.cabin_allowed : null,
    source_urls:source(selected),
    reviewed_on:snapshot.reviewed_on, issues,
    disclaimer:"Preliminary screening only — NOT a booking confirmation or legal veterinary advice."
  };
}

function policyDetails(airline) {
  const term=normalized(airline).slice(0,120);
  const found=snapshot.airlines.find(a=>normalized(a.name)===term || normalized(a.id)===term) ||
    (term.length>=3?snapshot.airlines.find(a=>normalized(a.name).includes(term)):null);
  if (!found) return {found:false, reviewed_on:snapshot.reviewed_on, message:"Airline not included in the current PawVago snapshot."};
  return {
    found:true, name:found.name, id:found.id,
    reviewed:found.policy_status==="reviewed",
    cabin_allowed:found.policy_status==="reviewed" ? found.cabin_allowed : null,
    cabin_max_kg:found.policy_status==="reviewed" ? found.cabin_max_kg : null,
    cabin_carrier_dimensions_cm:found.policy_status==="reviewed" ? found.dimensions_cm : null,
    hold:found.policy_status==="reviewed" ? found.hold : null,
    notes:found.notes||"",
    source_urls:source(found), reviewed_on:snapshot.reviewed_on,
    limitations:"Not live. Verify the operating airline, route, date and official destination authority."
  };
}

module.exports={listAirlines,screenCabin,policyDetails};
