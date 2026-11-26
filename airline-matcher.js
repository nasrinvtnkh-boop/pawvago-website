/* PawVago automatic airline policy matching.
   Conservative policy SCREENING only, never a route, inventory or booking claim. */
(function (root) {
  "use strict";
  const hasNumber = value => value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value));
  const valueKg = input => hasNumber(input) ? Number(input) : null;
  const checkSize = (entered, maximum) =>
    Array.isArray(entered) && entered.length === 3 && Array.isArray(maximum) &&
    maximum.length === 3 && entered.some((n,i) => n > Number(maximum[i]));
  const readable = kg => new Intl.NumberFormat("en-GB",{maximumFractionDigits:1}).format(kg) + " kg";
  const label = kind => kind === "potential" ? "Preliminary policy match" :
                        kind === "review" ? "Needs more checks" : kind === "unverified" ? "Policy not yet reviewed" : "Policy mismatch";
  const rank = kind => ({potential:3,review:2,blocked:1,unverified:0})[kind];

  // Only enforce country exclusions explicitly recorded from official policies.
  // This does not determine flight operation, transit, state or airport restrictions.
  function cabinRouteBlocked(airline,p) {
    const allowed=airline.cabin_country_allowlist;
    return (Array.isArray(allowed) && (!allowed.includes(p.from)||!allowed.includes(p.to))) ||
      (airline.cabin_blocked_countries||[]).some(code=>code===p.from||code===p.to) ||
      (airline.cabin_blocked_origins||[]).includes(p.from) ||
      (airline.cabin_blocked_destinations||[]).includes(p.to);
  }

  function testCabin(airline, p) {
    const reasons=[];
    let baseMax=valueKg(airline.cabin_max_kg);
    for (const limit of airline.cabin_country_weight_limits || []) {
      if (limit.countries.includes(p.from) || limit.countries.includes(p.to))
        baseMax=Math.min(baseMax ?? Infinity,limit.max_combined_kg);
    }
    const max=p.snub&&hasNumber(airline.cabin_snub_max_kg)?Math.min(baseMax??Infinity,Number(airline.cabin_snub_max_kg)):baseMax;
    const reject = msg => ({kind:"blocked",reasons:[msg],max,method:"cabin"});
    if (p.enteringGB) return reject("Standard commercial flights into Great Britain normally require cargo, not cabin pet travel.");
    if (airline.cabin_allowed === false) return reject("The airline does not accept ordinary pets in the passenger cabin.");
    if (p.snub && airline.cabin_snub_restricted===true) return reject("The published cabin policy excludes short-nosed breeds.");
    if (cabinRouteBlocked(airline,p)) return reject("The published cabin policy excludes this country pair; check the airline's route restrictions.");
    if (airline.cabin_allowed !== true) return {kind:"review",reasons:["Cabin pet acceptance has not been confirmed in PawVago."],max,method:"cabin"};
    if (max !== null && p.cabinTotal > max+0.000001)
      return reject("Pet and cabin bag total " + readable(p.cabinTotal) + " is above the " + readable(max) + " cabin maximum.");
    if (hasNumber(airline.cabin_pet_max_kg) && p.petKg>Number(airline.cabin_pet_max_kg))
      return reject("The pet alone exceeds the airline's published animal-only cabin weight limit.");
    if (checkSize(p.cabinDims,airline.dimensions_cm))
      return reject("Your cabin bag exceeds at least one published carrier dimension.");
    const variants=airline.cabin_dimension_variants||[];
    if(p.cabinDims && variants.length && variants.every(v=>checkSize(p.cabinDims,v.dimensions_cm)))
      return reject("Your cabin bag exceeds all published aircraft-specific size options.");
    if(p.cabinDims && hasNumber(airline.cabin_max_linear_cm) && p.cabinDims.reduce((a,b)=>a+b,0)>Number(airline.cabin_max_linear_cm))
      return reject("Your cabin bag exceeds the published combined length, width and height limit.");
    if (max === null) reasons.push("One universal cabin weight limit has not been confirmed.");
    if (!p.cabinDims) reasons.push("Enter all three cabin bag dimensions to check the published size limit.");
    if (p.cabinDims && !airline.dimensions_cm) reasons.push(variants.length||airline.cabin_max_linear_cm ? "Published carrier limits are listed by aircraft or total dimensions in the policy details." : "The cabin bag size limit requires direct airline verification.");
    if (p.cabinDimensionsPartial) reasons.push("Complete all three cabin bag dimensions.");
    if (!p.breedKnown) reasons.push("Add the breed to screen short-nosed travel restrictions.");
    if (p.snub) reasons.push("Flat-faced breed: check individual breed, respiratory and temperature restrictions with the airline.");
    if (airline.route_rule && airline.route_rule !== "hold_domestic_tr_only" && airline.route_rule !== "emirates_hold_dubai_departure_only")
      reasons.push("Flight/route-specific conditions apply to this carrier.");
    if (!reasons.length) reasons.push("Published cabin weight and measured bag dimensions pass this first screen; breed and flight acceptance are not guaranteed.");
    return {kind:reasons.length === 1 && reasons[0].startsWith("Published cabin") ? "potential" : "review",reasons,max,method:"cabin"};
  }

  function testHold(airline,p) {
    const hold=airline.hold||{},reasons=[];
    let max=valueKg(hold.max_combined_kg);
    for(const limit of hold.country_weight_limits||[]){
      if(limit.countries.includes(p.from)||limit.countries.includes(p.to))max=Math.min(max??Infinity,limit.max_combined_kg);
    }
    const reject = msg => ({kind:"blocked",reasons:[msg],max,method:"hold"});
    if (p.enteringGB) return reject("Checked hold baggage is not the normal option for commercial flights into Great Britain; ask a cargo provider.");
    if (hold.allowed === false) return reject("The airline does not carry ordinary pets as checked-in hold baggage.");
    if ((hold.blocked_countries||[]).some(code=>code===p.from||code===p.to) ||
        (hold.blocked_destinations||[]).includes(p.to))
      return reject("The published checked-hold policy excludes this country pair; confirm with the airline.");
    if (airline.route_rule==="hold_domestic_tr_only" && !(p.from==="TR"&&p.to==="TR"))
      return reject("Checked hold service is restricted to eligible Turkish domestic / North Cyprus journeys; this route is not verified as eligible.");
    if (p.snub && (hold.snub_nosed_restricted===true || (hold.snub_nosed_dogs_restricted===true && p.species==='dog')))
      return reject("Short-nosed dogs or cats are prohibited from the checked hold by this airline.");
    if (max!==null && p.petKg>max+0.000001)
      return reject("The animal alone weighs more than this airline's published checked-hold total maximum.");
    if (max!==null && p.crateKg!==null && p.petKg+p.crateKg>max+0.000001)
      return reject("Pet and rigid crate total " + readable(p.petKg+p.crateKg) + " exceeds " + readable(max) + ".");
    if (checkSize(p.crateDims,hold.dimensions_cm))
      return reject("The rigid crate exceeds a published hold size limit.");
    if(p.crateDims && hold.dimension_variants?.length && hold.dimension_variants.every(v=>checkSize(p.crateDims,v.dimensions_cm)))
      return reject("The rigid crate exceeds all published aircraft-specific hold size options.");
    if (p.crateDims && hasNumber(hold.max_linear_cm) && p.crateDims.reduce((a,b)=>a+b,0)>Number(hold.max_linear_cm))
      return reject("The rigid crate exceeds the published combined length, width and height limit.");
    if (p.crateDims && hasNumber(hold.max_length_cm) && p.crateDims[0]>Number(hold.max_length_cm))
      return reject("The rigid crate exceeds the published hold length limit.");
    if (p.crateDims && hasNumber(hold.max_height_cm) && p.crateDims[2]>Number(hold.max_height_cm))
      return reject("The rigid crate exceeds a published hold size limit.");
    if (hold.allowed!==true)
      reasons.push("Checked-hold pet acceptance is not independently established for this airline.");
    if (airline.route_rule==="emirates_hold_dubai_departure_only")
      reasons.push("Emirates checked-hold service is itinerary-dependent; routes arriving Dubai normally require separate cargo.");
    if (airline.route_rule==="confirm_operating_route")
      reasons.push("Flight/route-specific conditions apply to this carrier.");
    if (max===null) reasons.push(hold.weight_policy==='not_published'||hold.weight_policy==='no_fixed_limit' ? "The published hold policy sets no single weight cap; rigid crate and aircraft conditions apply." : "No universal hold weight maximum verified; confirm directly with the airline.");
    if(hold.weight_policy==='route_limits')reasons.push("The published weight limit depends on origin, destination and transit countries; transit is not entered in this checker.");
    if(hold.weight_policy==='aircraft_dependent'||hold.weight_policy==='airport_dependent')reasons.push("Published hold limits vary by operating aircraft or airport; see the listed policy conditions.");
    if (p.crateKg===null) reasons.push("Add the hard crate weight; cabin bag weight cannot be used for the hold.");
    if (!p.crateDims) reasons.push("Add three rigid crate dimensions and confirm IATA live-animal requirements.");
    if (p.crateDimensionsPartial) reasons.push("Complete all three rigid crate dimensions.");
    if (p.crateDims && !hold.dimensions_cm) reasons.push(hold.dimension_variants?.length ? "Published crate size limits vary by aircraft and are listed in the policy details." : hold.max_linear_cm ? "Check the published total size and individual side limits in the airline policy." : "No universal rigid crate dimension cap verified; ask the airline.");
    if (!p.breedKnown) reasons.push("Add the breed for short-nosed hold restrictions.");
    if (p.snub && hold.snub_nosed_restricted !== false)
      reasons.push("Flat-faced breeds have extra safety restrictions. Hold eligibility is not verified.");
    if (airline.id==="LH") reasons.push("Lufthansa does not carry checked-hold pets on connections through Munich.");
    if (!reasons.length)
      reasons.push("Published hold weight/size screen passed; the rigid crate, flight type, route and vet clearance still need approval.");
    const couldPass = reasons.length===1 && reasons[0].startsWith("Published hold weight");
    return {kind:couldPass?"potential":"review",reasons,max,method:"hold"};
  }

  function evaluate(airlines,options) {
    const p={...options};
    p.petKg=Number(p.petKg);
    p.cabinKg=Number(p.cabinKg);
    p.cabinTotal=p.petKg+p.cabinKg;
    p.crateKg=valueKg(p.crateKg);
    p.breedKnown=Boolean(String(p.breed||"").trim());
    p.enteringGB=p.to==="GB"&&p.from!=="GB";
    p.cabinDims=Array.isArray(p.cabinDims)&&p.cabinDims.length===3?p.cabinDims:null;
    p.crateDims=Array.isArray(p.crateDims)&&p.crateDims.length===3?p.crateDims:null;
    const reviewed=airlines.filter(a=>a.policy_status==="reviewed");
    const unverified=airlines.length-reviewed.length;
    const entries=airlines.map(airline=>{
      if (airline.policy_status !== "reviewed") {
        const reason = "PawVago has not verified this airline’s cabin or checked-hold pet policy. Eligibility, route and pet acceptance are unknown; contact the operating airline.";
        const cabin = {kind:"unverified",reasons:[reason],max:null,method:"cabin"};
        const hold = {kind:"unverified",reasons:[reason],max:null,method:"hold"};
        const best = p.placement==="hold" ? hold : cabin;
        return {airline,cabin,hold,best};
      }
      const cabin=testCabin(airline,p);
      const hold=testHold(airline,p);
      const candidates=p.placement==="cabin"?[cabin]:p.placement==="hold"?[hold]:[cabin,hold];
      const best=candidates.slice().sort((a,b)=>rank(b.kind)-rank(a.kind)|| (a.method==="cabin"?-1:1))[0];
      return {airline,cabin,hold,best};
    }).sort((a,b)=>rank(b.best.kind)-rank(a.best.kind)||
      (a.best.method==="cabin"?-1:1)-(b.best.method==="cabin"?-1:1)||
      a.airline.name.localeCompare(b.airline.name,"en"));
    return {
      entries,
      groups:{
        potential:entries.filter(e=>e.best.kind==="potential"),
        review:entries.filter(e=>e.best.kind==="review"),
        blocked:entries.filter(e=>e.best.kind==="blocked"),
        unverified:entries.filter(e=>e.best.kind==="unverified")
      },
      reviewed:reviewed.length,unverified,total:airlines.length,
      warning:"This screen checks published pet conditions, NOT whether an airline operates your route, flight spaces, aircraft restrictions, costs or real-time availability.",
      labels:{potential:label("potential"),review:label("review"),blocked:label("blocked"),unverified:label("unverified")}
    };
  }
  root.PawVagoAirMatcher=Object.freeze({evaluate});
})(window);

