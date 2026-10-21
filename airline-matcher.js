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
                        kind === "review" ? "Needs more checks" : "Policy mismatch";
  const rank = kind => ({potential:2,review:1,blocked:0})[kind];

  function testCabin(airline, p) {
    const reasons=[],max=valueKg(airline.cabin_max_kg);
    const reject = msg => ({kind:"blocked",reasons:[msg],max,method:"cabin"});
    if (p.enteringGB) return reject("Standard commercial flights into Great Britain normally require cargo, not cabin pet travel.");
    if (airline.cabin_allowed === false) return reject("The airline does not accept ordinary pets in the passenger cabin.");
    if (airline.cabin_allowed !== true) return {kind:"review",reasons:["Cabin pet acceptance has not been confirmed in PawVago."],max,method:"cabin"};
    if (max !== null && p.cabinTotal > max+0.000001)
      return reject("Pet and cabin bag total " + readable(p.cabinTotal) + " is above the " + readable(max) + " cabin maximum.");
    if (checkSize(p.cabinDims,airline.dimensions_cm))
      return reject("Your cabin bag exceeds at least one published carrier dimension.");
    if (max === null) reasons.push("One universal cabin weight limit has not been confirmed.");
    if (!p.cabinDims) reasons.push("Enter all three cabin bag dimensions to check the published size limit.");
    if (p.cabinDims && !airline.dimensions_cm) reasons.push("The cabin bag size limit requires direct airline verification.");
    if (p.cabinDimensionsPartial) reasons.push("Complete all three cabin bag dimensions.");
    if (!p.breedKnown) reasons.push("Add the breed to screen short-nosed travel restrictions.");
    if (p.snub) reasons.push("Flat-faced breed: check individual breed, respiratory and temperature restrictions with the airline.");
    if (airline.route_rule && airline.route_rule !== "hold_domestic_tr_only" && airline.route_rule !== "emirates_hold_dubai_departure_only")
      reasons.push("Flight/route-specific conditions apply to this carrier.");
    if (!reasons.length) reasons.push("Published cabin weight and measured bag dimensions pass this first screen; breed and flight acceptance are not guaranteed.");
    return {kind:reasons.length === 1 && reasons[0].startsWith("Published cabin") ? "potential" : "review",reasons,max,method:"cabin"};
  }

  function testHold(airline,p) {
    const hold=airline.hold||{},max=valueKg(hold.max_combined_kg),reasons=[];
    const reject = msg => ({kind:"blocked",reasons:[msg],max,method:"hold"});
    if (p.enteringGB) return reject("Checked hold baggage is not the normal option for commercial flights into Great Britain; ask a cargo provider.");
    if (hold.allowed === false) return reject("The airline does not carry ordinary pets as checked-in hold baggage.");
    if (airline.route_rule==="hold_domestic_tr_only" && !(p.from==="TR"&&p.to==="TR"))
      return reject("Checked hold service is restricted to eligible Turkish domestic / North Cyprus journeys; this route is not verified as eligible.");
    if (p.snub && hold.snub_nosed_restricted===true)
      return reject("Short-nosed dogs or cats are prohibited from the checked hold by this airline.");
    if (max!==null && p.petKg>max+0.000001)
      return reject("The animal alone weighs more than this airline's published checked-hold total maximum.");
    if (max!==null && p.crateKg!==null && p.petKg+p.crateKg>max+0.000001)
      return reject("Pet and rigid crate total " + readable(p.petKg+p.crateKg) + " exceeds " + readable(max) + ".");
    if (checkSize(p.crateDims,hold.dimensions_cm))
      return reject("The rigid crate exceeds a published hold size limit.");
    if (hold.allowed!==true)
      reasons.push("Checked-hold pet acceptance is not independently established for this airline.");
    if (airline.route_rule==="emirates_hold_dubai_departure_only")
      reasons.push("Emirates checked-hold service is itinerary-dependent; routes arriving Dubai normally require separate cargo.");
    if (max===null) reasons.push("No universal hold weight maximum verified; confirm directly with the airline.");
    if (p.crateKg===null) reasons.push("Add the hard crate weight; cabin bag weight cannot be used for the hold.");
    if (!p.crateDims) reasons.push("Add three rigid crate dimensions and confirm IATA live-animal requirements.");
    if (p.crateDimensionsPartial) reasons.push("Complete all three rigid crate dimensions.");
    if (p.crateDims && !hold.dimensions_cm) reasons.push("No universal rigid crate dimension cap verified; ask the airline.");
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
    const entries=reviewed.map(airline=>{
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
        blocked:entries.filter(e=>e.best.kind==="blocked")
      },
      reviewed:reviewed.length,unverified,
      warning:"This screen checks published pet conditions, NOT whether an airline operates your route, flight spaces, aircraft restrictions, costs or real-time availability.",
      labels:{potential:label("potential"),review:label("review"),blocked:label("blocked")}
    };
  }
  root.PawVagoAirMatcher=Object.freeze({evaluate});
})(window);
