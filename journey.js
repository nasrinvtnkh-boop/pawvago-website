/* PawVago / official-source journey reference. This is NOT a live booking inventory. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const form = $("pvj-form");
  if (!form) return;

  const ui = {
    from: $("pvj-from"), to: $("pvj-to"), originCity: $("pvj-origin-city"),
    destCity: $("pvj-dest-city"), date: $("pvj-date"), species: $("pvj-species"),
    weight: $("pvj-weight"), bag: $("pvj-bag"), airline: $("pvj-airline"),
    airlineBox: $("pvj-airline-box"), results: $("pvj-results"),
    ruleCards: $("pvj-rule-cards"), audit: $("pvj-audit"),
    breed: $("pvj-breed"), snub: $("pvj-snub"), airTransport: $("pvj-air-transport"),
    carrierLabel: $("pvj-carrier-label"), placementHint: $("pvj-placement-hint"),
    airlineSearch: $("pvj-airline-search"), directorySearch: $("pvj-directory-search"),
    directoryRegion: $("pvj-directory-region"), directoryStatus: $("pvj-directory-status"),
    directoryCount: $("pvj-directory-count"), directoryMore: $("pvj-directory-more")
  };
  const safe = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
  const safeUrl = value => {
    try {
      const u = new URL(String(value));
      return u.protocol === "https:" ? u.href : "#";
    } catch (_) { return "#"; }
  };
  const formatKg = value => new Intl.NumberFormat("en-GB", {maximumFractionDigits:1}).format(value);
  const isoLocal = date => {
    const x = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return x.toISOString().slice(0, 10);
  };
  const today = new Date();
  const tripDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);
  ui.date.min = isoLocal(today);
  ui.date.value = isoLocal(tripDay);

  const setLabel = (id, value) => { const node=$(id); if(node)node.textContent=value; };
  const sourceLink = (url, label="View official source ↗") =>
    '<a class="pvj-source-link" target="_blank" rel="noopener noreferrer" href="' +
    safe(safeUrl(url)) + '">' + safe(label) + '</a>';
  const getMode = () => form.querySelector('input[name="pvj-mode"]:checked')?.value || "air";
  const getPlacement = () => form.querySelector('input[name="pvj-placement"]:checked')?.value || "cabin";
  const flatNosed = species => {
    if (ui.snub.checked) return true;
    const normalized = ui.breed.value.toLowerCase().replace(/[-_]/g, ' ').trim();
    if (!normalized) return false;
    return (policy?.brachycephalic_breeds?.[species] || [])
      .some(b => normalized.includes(String(b).replace(/-/g," ")));
  };
  const modeLabels = {
    cabin:"Cabin: your pet stays in a compliant under-seat carrier.",
    hold:"Hold (checked baggage / AVIH): your pet travels in a ventilated, climate-controlled compartment. A rigid IATA-compliant crate is required.",
    cargo:"Air cargo (freight): separate handling and booking through a qualified animal transport provider; not booked with ordinary checked baggage."
  };
  let policy = null;

  let catalogLimit = 24;
  const policyReviewed = a => a.policy_status === "reviewed";
  const reviewLabel = a => policyReviewed(a) ? "Source-reviewed reference" : "Policy not yet verified";
  const syncAirlinePicker = (preserve = true) => {
    if (!policy) return;
    const search = ui.airlineSearch.value.trim().toLocaleLowerCase();
    const current = preserve ? ui.airline.value : "";
    const choices = policy.airlines.filter(a =>
      !search || (a.name + " " + a.id + " " + a.region).toLocaleLowerCase().includes(search)
    );
    if (!choices.length) {
      ui.airline.innerHTML = '<option value="" selected>No matching airlines</option>';
      return;
    }
    const reviewed = choices.filter(policyReviewed);
    const pending = choices.filter(a => !policyReviewed(a));
    const group = (items,label) => items.length ? '<optgroup label="' + safe(label) + '">' +
      items.map(a => '<option value="' + safe(a.id) + '">' + safe(a.name) + ' (' + safe(a.id) + ')</option>').join("") + '</optgroup>' : "";
    ui.airline.innerHTML = group(reviewed,"Official-source policy references") +
      group(pending,"Policy not yet verified");
    if (choices.some(a => a.id === current)) ui.airline.value = current;
    else if (choices.some(a => a.id === "VY") && !search) ui.airline.value = "VY";
    else ui.airline.value = choices[0].id;
  };

  const renderLibrary = () => {
    if (!policy) return;
    const current = policy.airlines;
    const reviewed = current.filter(policyReviewed).length;
    ui.audit.innerHTML = '<strong>' + reviewed + ' / ' + current.length + ' carrier policies reviewed</strong>' +
      '<span>Review date ' + safe(policy.reviewed_on) +
      ' · selected airlines worldwide, not an exhaustive global registry</span>';
    const term = ui.directorySearch.value.trim().toLocaleLowerCase();
    const region = ui.directoryRegion.value || "all";
    const status = ui.directoryStatus.value || "all";
    const matches = current.filter(a => {
      const searchable = (a.name + " " + a.id + " " + a.region).toLocaleLowerCase();
      return (!term || searchable.includes(term)) &&
        (region === "all" || a.region === region) &&
        (status === "all" || (status === "reviewed" ? policyReviewed(a) : !policyReviewed(a)));
    });
    ui.directoryCount.textContent = "Showing " + Math.min(matches.length,catalogLimit) + " of " +
      matches.length + " matching airlines · " + current.length + " listed · " +
      reviewed + " reviewed · " + (current.length - reviewed) + " awaiting policy verification";
    ui.ruleCards.innerHTML = matches.length ? matches.slice(0,catalogLimit).map(a => {
      const review = policyReviewed(a);
      const hold = a.hold || {};
      const cabinAllowed = review && a.cabin_allowed === true;
      const cabinText = !review ? "Not yet reviewed" :
        a.cabin_allowed === false ? "No ordinary pets" :
        cabinAllowed && a.cabin_max_kg != null ? formatKg(a.cabin_max_kg) + " kg max" :
        "Confirm with airline";
      const cabinDetail = review && a.dimensions_cm ? a.dimensions_cm.join(" × ") + " cm carrier" :
        !review ? "Rules, limits and pet acceptance unknown" : "Carrier size and flight restrictions apply";
      const holdText = !review ? "Not yet reviewed" :
        hold.allowed === false ? "Not offered" :
        hold.allowed === true && hold.max_combined_kg != null ? formatKg(hold.max_combined_kg) + " kg max" :
        "Verify with airline";
      const holdDetail = !review ? "Hold pet acceptance not assessed" :
        hold.allowed === false ? "Ordinary pets not accepted in checked hold" :
        (hold.dimensions_cm ? "Crate up to " + hold.dimensions_cm.join(" × ") + " cm; " : "") +
        "Operating flight and breed rules apply";
      return '<article class="pvj-rule-card">' +
        '<span class="pvj-rule-card-tag ' + (review ? '' : 'pvj-tag-unverified') + '">' + reviewLabel(a) + '</span>' +
        '<div class="pvj-rule-card-name">' + safe(a.name) + '</div>' +
        '<small class="pvj-card-code">' + safe(a.id) + '</small>' +
        '<span class="pvj-card-region">' + safe(a.region) + '</span>' +
        '<div class="pvj-card-mode">CABIN</div><div class="pvj-rule-card-unknown">' + safe(cabinText) + '</div>' +
        '<div class="pvj-rule-card-dim">' + safe(cabinDetail) + '</div>' +
        '<div class="pvj-card-hold"><div class="pvj-card-mode">CHECKED HOLD</div><strong>' +
        safe(holdText) + '</strong><small>' + safe(holdDetail) + '</small></div>' +
        '<div class="pvj-rule-card-note">' +
        (review ? "Reference only — verify booking, route, animal breed and kennel with the operating carrier." :
         "No airline pet policy has been checked for this listing. Unknown is not the same as allowed or prohibited.") +
        '</div>' +
        (review && a.source ? '<a href="' + safe(safeUrl(a.source)) +
         '" target="_blank" rel="noopener noreferrer">Official policy ↗</a>' : '') +
        '<a class="pvj-card-choose" href="#journey-lab" data-pvj-pick="' + safe(a.id) +
        '">Select in Trip Checker ↗</a></article>';
    }).join("") : '<p>No airlines matched these filters. Try another name, code or region.</p>';
    ui.directoryMore.hidden = matches.length <= catalogLimit;
    ui.directoryMore.textContent = "Show more airlines (" +
      (matches.length - Math.min(matches.length,catalogLimit)) + " remaining) ↓";
  };

  const updatePreview = () => {
    const countryFrom = policy?.countries.find(c => c.code === ui.from.value);
    const countryTo = policy?.countries.find(c => c.code === ui.to.value);
    const from = ui.originCity.value.trim() || countryFrom?.name || "Departure";
    const to = ui.destCity.value.trim() || countryTo?.name || "Arrival";
    setLabel("pvj-map-from", from);
    setLabel("pvj-map-to", to);
    setLabel("pvj-map-from-country", countryFrom?.name || "");
    setLabel("pvj-map-to-country", countryTo?.name || "");
    setLabel("pvj-mode-caption", ({air:"AIR ROUTE",rail:"RAIL JOURNEY",road:"ROAD JOURNEY"})[getMode()]);
    const isAir = getMode() === "air";
    const placement = getPlacement();
    ui.airTransport.hidden = !isAir;
    ui.airlineBox.hidden = !isAir || placement === "cargo";
    ui.carrierLabel.textContent = placement === "hold" && isAir ? "Crate weight (kg)" : "Carrier weight (kg)";
    ui.placementHint.textContent = modeLabels[placement] || modeLabels.cabin;
  };

  const render = () => {
    if (!policy) return;
    if (!form.reportValidity()) return;
    const from = policy.countries.find(c => c.code === ui.from.value);
    const to = policy.countries.find(c => c.code === ui.to.value);
    const mode = getMode();
    const placement = getPlacement();
    const species = ui.species.value;
    const snub = flatNosed(species);
    const petKg = Number(ui.weight.value);
    const carrierKg = Number(ui.bag.value);
    const totalKg = petKg + carrierKg;
    const airline = policy.airlines.find(a => a.id === ui.airline.value);
    const dimsInput = [$("pvj-length").value, $("pvj-width").value, $("pvj-height").value];
    const dimensionsComplete = dimsInput.every(s => String(s).trim() !== "");
    const dimensionsPartial = dimsInput.some(s => String(s).trim() !== "") && !dimensionsComplete;
    const dims = dimensionsComplete ? dimsInput.map(Number) : null;
    if (!from || !to || !(petKg > 0) || !(carrierKg > 0)) return;
    updatePreview();

    const source = to.region === "GB" ? policy.official_sources.gb : policy.official_sources.eu;
    const docItems = [
      "Identification microchip (record must match pet)",
      "Valid rabies vaccination (check microchip/vaccination dates)"
    ];
    const euDepart = from.region === "EU";
    const euArrive = to.region === "EU" || to.region === "EU-associated";
    if (euDepart && euArrive) docItems.push("Valid EU pet passport");
    else if (to.region === "GB") docItems.push("Valid approved pet travel document for Great Britain");
    else docItems.push("Check health certificate / pet passport requirements for your departure country");
    if (to.dog_tapeworm_hours && species === "dog")
      docItems.push("Vet-administered tapeworm treatment 24–120 hours before arrival");
    if (mode === "air") {
      if (placement === "hold") {
        docItems.push("Rigid IATA-compliant crate: adequate standing, turning and lying space");
        docItems.push("Confirm approved hold pet space and applicable aircraft and transit restrictions");
        docItems.push("Vet fitness assessment and breed/temperature restrictions");
      } else if (placement === "cargo") {
        docItems.push("Choose a specialist live-animal air freight operator and obtain written quote");
        docItems.push("Confirm cargo acceptance, approved route and animal handling arrangements");
        docItems.push("Approved rigid crate and veterinary fitness assessment");
      } else {
        docItems.push("Airline approval for pet, carrier and specific flight");
      }
    }

    const notes = [];
    if (from.code === to.code) notes.push("Domestic journeys can follow different rules. Check national and carrier requirements.");
    if (euArrive && !euDepart) notes.push("Entry from outside the EU can require an official health certificate and, depending on origin and history, a rabies antibody test. Check the official country-entry tool.");
    if (species === "dog" && to.dog_tapeworm_hours) notes.push("Tapeworm treatment must be done by a veterinarian in the 24–120 hours before entry.");
    const startDate = new Date(ui.date.value + "T12:00:00");
    if ((startDate.getTime() - Date.now()) / 86400000 < 21)
      notes.push("If this is a primary rabies vaccination, the minimum 21-day waiting period may affect this departure date.");
    if (to.region === "GB")
      notes.push("Great Britain requires an approved route; pets on ordinary commercial flights into GB normally travel as cargo rather than in cabin.");
    if (mode === "air") {
      notes.push("Flight eligibility, route acceptance and pet-space availability are NOT checked or reserved by this tool.");
      if (placement === "hold") notes.push("Checked-hold transport (AVIH) is different from a separate cargo shipment. Confirm the kennel is ventilated, safe and large enough for your pet to stand, turn and lie down.");
      if (placement === "cargo") notes.push("Cargo requires a freight booking/agent; do not assume the chosen passenger airline offers it.");
      if (snub) notes.push("Short-nosed breeds can face increased breathing and heat risks in transit. Obtain a veterinary assessment and written carrier approval; an airline may refuse transport.");
    }
    else notes.push("Rail and road operator rules, border crossings and route timetables are not checked in this prototype.");

    const pieces = [];
    const status = (title, content, cls="pvj-caution") => {
      pieces.push('<div class="pvj-diagnostic ' + cls + '"><strong>' + safe(title) + '</strong><p>' + safe(content) + '</p></div>');
    };

    pieces.push('<div class="pvj-results-head"><span>Personalised screening</span><span class="pvj-policy-chip">Reviewed ' + safe(policy.reviewed_on) + '</span></div>');

    if (mode === "air") {
      if (placement === "cargo") {
        status("Separate air freight enquiry — no automatic eligibility determination",
          "Cargo is a specialist shipment, not a pet transported as checked baggage with your passenger booking. Verify accepted species/breed, airline/agent, route, crate, cost and import clearance in writing.",
          "pvj-caution");
        if (to.region === "GB") status("Cargo is normally required for commercial flights to Great Britain",
          "Check a government-approved air route and an approved live-animal cargo service. This screen does not reserve freight space.",
          "pvj-caution");
        pieces.push('<div class="pvj-result-row"><span>Pet + carrier</span><strong>' + safe(formatKg(totalKg)) + ' kg</strong></div>');
        pieces.push('<div class="pvj-result-row"><span>Freight operator / charge</span><strong>Quote required</strong></div>');
        pieces.push(sourceLink(policy.cargo_info?.source || policy.official_sources.gb_routes,"Understand live-animal cargo requirements ↗"));
        pieces.push(sourceLink(policy.cargo_info?.lufthansa_source || "https://www.lufthansa.com/at/en/tiere-als-uebergepaeck","Carrier hold vs cargo explanation ↗"));
      } else {
        if (!airline) return;
        // Unknown policies must never be interpreted as "not allowed" or "safe".
        if (!policyReviewed(airline)) {
          status("Pet policy not yet verified for " + airline.name,
            "This airline is included in our directory, but PawVago has not independently checked its cabin, hold or cargo rules. Do not book until the operating airline confirms its policy for your animal and exact route.",
            "pvj-caution");
          pieces.push('<div class="pvj-result-row"><span>Selected airline</span><strong>' + safe(airline.name) + '</strong></div>');
          pieces.push('<div class="pvj-result-row"><span>Cabin / hold rules</span><strong>Not yet reviewed</strong></div>');
          notes.push("No verified size, weight or breed limits are available for this airline in PawVago. Contact the operator directly.");
        } else {
        const gbFlight = to.region === "GB";
        if (placement === "hold") {
          const hold = airline.hold || {};
          const max = typeof hold.max_combined_kg === "number" ? hold.max_combined_kg : null;
          const tooHeavy = max !== null && totalKg > max + 0.000001;
          const tooLarge = !!(dims && hold.dimensions_cm && dims.some((d, i) => d > hold.dimensions_cm[i]));
          if (gbFlight) status("Checked-in hold baggage is not an approved option for standard flights to Great Britain",
            "For ordinary commercial air travel into Great Britain, animals must normally be transported as cargo freight rather than checked hold luggage. Confirm an approved route.",
            "pvj-danger");
          else if (airline.route_rule === "hold_domestic_tr_only" && !(from.code === "TR" && to.code === "TR")) status("Checked hold only on domestic Turkish flights",
            "Pegasus does not transport pets as checked hold baggage on its ordinary international routes. Verify any exceptional routing directly with the airline.",
            "pvj-danger");
          else if (hold.allowed === null || hold.allowed === undefined) status("Checked-hold pet policy requires confirmation",
            "This carrier's checked-hold pet service has not been established for your itinerary. Contact the airline or a qualified cargo specialist.",
            "pvj-caution");
          else if (hold.allowed === false) status("Hold transport not offered by " + airline.name,
            "This airline does not accept pet animals in the aircraft hold as checked baggage. Consider another airline or specialist freight provider.",
            "pvj-danger");
          else if (snub && hold.snub_nosed_restricted) status("Flat-faced breed not accepted in the hold by " + airline.name,
            "Short-nosed dog and cat breeds face breathing risks and are restricted from hold transport by this airline. Do not treat cargo as automatically accepted.",
            "pvj-danger");
          else if (tooHeavy) status("Above the published hold weight limit",
            "Pet and crate total " + formatKg(totalKg) + " kg exceeds the published " + formatKg(max) + " kg limit.",
            "pvj-danger");
          else if (airline.route_rule === "emirates_hold_dubai_departure_only") status("Emirates hold is itinerary-dependent",
            "Emirates requires cargo for itineraries ending in Dubai. Checked-baggage transport is restricted to certain Dubai-origin journeys and conditions. Confirm the exact journey; no permission is established here.",
            "pvj-caution");
          else if (tooLarge) status("Crate exceeds published hold dimensions",
            "The entered crate is larger than the " + hold.dimensions_cm.join(" × ") + " cm maximum.",
            "pvj-danger");
          else status("Hold policy screen — airline confirmation required",
            "This carrier lists a checked-hold option, but crate compliance, safe breed handling, flight type, transit points and capacity require direct approval before booking.",
            "pvj-caution");
          pieces.push('<div class="pvj-result-row"><span>Pet + rigid crate</span><strong>' + safe(formatKg(totalKg)) + ' kg</strong></div>');
          pieces.push('<div class="pvj-result-row"><span>Checked-hold status</span><strong>' + safe(!hold.allowed ? "Not offered" : max !== null ? max + " kg published max" : "Confirm operator limits") + '</strong></div>');
          pieces.push('<div class="pvj-result-row"><span>Published crate limit</span><strong>' + safe(hold.dimensions_cm ? hold.dimensions_cm.join(" × ") + " cm" : "Confirm with airline") + '</strong></div>');
          if (hold.allowed && !snub) notes.push("Enter and verify the breed or select the flat-faced option; the tool cannot exclude all restricted breeds automatically.");
          if (hold.allowed && !dims) notes.push("Crate dimensions have not been entered. An IATA-style crate must be large enough for standing, turning and lying down.");
          if (hold.allowed && hold.requires_hard_crate) notes.push("Soft cabin bags are unsuitable for checked-hold transport; use an accepted rigid kennel.");
          if (airline.id === "LH") notes.push("Lufthansa disallows checked-hold pets on connections via Munich; verify routing via another airport.");
          pieces.push(sourceLink(hold.source || airline.source,"Official " + airline.name + " hold conditions ↗"));
          if (snub && hold.breed_source) pieces.push(sourceLink(hold.breed_source,"Official short-nosed breed restrictions ↗"));
        } else {
          const max = airline.cabin_max_kg === null || airline.cabin_max_kg === undefined ? null : Number(airline.cabin_max_kg);
          const over = max !== null && totalKg > max + 0.000001;
          const oversized = !!(dims && airline.dimensions_cm && dims.some((d, i) => d > airline.dimensions_cm[i]));
          if (gbFlight) status("Cabin not permitted on standard flights to Great Britain",
            "Pets normally must travel as cargo on regular commercial flights into Great Britain. Check approved transport routes and operator rules.",
            "pvj-danger");
          else if (airline.cabin_allowed === false) status("Ordinary pets are not accepted in the passenger cabin",
            airline.name + " does not allow ordinary pet dogs or cats in passenger cabins under its reviewed policy. Assistance dogs and other special cases follow different rules.",
            "pvj-danger");
          else if (airline.cabin_allowed !== true) status("Cabin pet acceptance requires airline confirmation",
            "A verified general pet-cabin permission has not been established for this airline. Do not assume your pet is accepted.",
            "pvj-caution");
          else if (over) status("Above this airline's published cabin weight limit",
            "Your pet and carrier total " + formatKg(totalKg) + " kg; the published allowance is " + formatKg(max) + " kg.",
            "pvj-danger");
          else if (oversized) status("Carrier exceeds a published cabin dimension",
            "Your carrier size is larger than " + airline.dimensions_cm.join(" × ") + " cm in at least one dimension.",
            "pvj-danger");
          else if (max === null)
            status("Cabin offered — weight limit needs confirmation",
              "This airline has a cabin pet service but PawVago has not confirmed one universally applicable weight maximum. Check your exact flight and operating carrier before booking.",
              "pvj-caution");
          else if (!dims || !airline.dimensions_cm || dimensionsPartial)
            status("Weight within limit — carrier checks still needed",
              "The combined weight is within " + formatKg(max) + " kg. Check carrier size, breed, route and available pet spaces with " + airline.name + ".",
              "pvj-caution");
          else status("Preliminary cabin weight and size screen passed",
            "Published weight/size checks look suitable, subject to full pet and route conditions. This does not confirm airline acceptance or booking.",
            "pvj-positive");
          pieces.push('<div class="pvj-result-row"><span>Pet + cabin carrier</span><strong>' + safe(formatKg(totalKg)) + ' kg</strong></div>');
          pieces.push('<div class="pvj-result-row"><span>Published cabin maximum</span><strong>' + safe(max === null ? "Confirm with airline" : max + " kg") + '</strong></div>');
          pieces.push('<div class="pvj-result-row"><span>Cabin carrier size</span><strong>' + (airline.dimensions_cm ? safe(airline.dimensions_cm.join(" × ")) + " cm" : "Check with airline") + '</strong></div>');
          pieces.push(sourceLink(airline.source,"Official " + airline.name + " cabin conditions ↗"));
        }
        if (dimensionsPartial) notes.unshift("Carrier/crate dimensions are incomplete. Enter all three measurements or leave all blank.");
        } // end source-reviewed policy evaluation
      }
    } else {
      status(mode === "rail" ? "Rail travel: personalised document checklist" : "Road travel: personalised document checklist",
        "PawVago has prepared your destination checklist. Operator-specific pet acceptance and real-time routes are not connected yet.", "pvj-caution");
    }

    pieces.push('<div class="pvj-docs"><h4>Document preparation checklist</h4><p>Tick items as you verify them; this checklist is saved only on this screen.</p>' +
      docItems.map((item, i) => '<label><input type="checkbox" data-pvj-doc="' + i + '"><span>' + safe(item) + '</span></label>').join("") +
      '<progress id="pvj-doc-meter" value="0" max="' + docItems.length + '" aria-label="Checklist progress"></progress>' +
      '<div id="pvj-doc-progress" class="pvj-doc-progress" aria-live="polite">0 of ' + docItems.length + ' items checked</div></div>');

    if (notes.length) pieces.push('<div class="pvj-diagnostic pvj-caution"><strong>Before you book</strong><p>' + notes.map(safe).join("<br>") + '</p></div>');
    pieces.push(sourceLink(source, to.region === "GB" ? "Great Britain official entry rules ↗" : "EU official pet travel rules ↗"));
    if (to.region === "GB") pieces.push(sourceLink(policy.official_sources.gb_routes, "Approved routes into Great Britain ↗"));
    pieces.push('<p class="pvj-docs-footnote">Reference data last manually reviewed ' + safe(policy.reviewed_on) + '. Official sources may change without notice. No live inventory, veterinarian assessment, border clearance or booking is provided.</p>');
    ui.results.innerHTML = pieces.join("");
    const checks = Array.from(ui.results.querySelectorAll("[data-pvj-doc]"));
    const meter = $("pvj-doc-meter");
    const count = $("pvj-doc-progress");
    checks.forEach(box => box.addEventListener("change", () => {
      const n = checks.filter(x => x.checked).length;
      meter.value = n;
      count.textContent = n + " of " + checks.length + " items checked";
    }));
  };

  async function init() {
    try {
      const response = await fetch("/data/pet-policy-snapshot.json", {cache:"no-store"});
      if (!response.ok) throw new Error("Policy data unavailable");
      const data = await response.json();
      if (!data?.countries?.length || !data?.airlines?.length || !data.reviewed_on || !data.official_sources?.eu)
        throw new Error("Policy data invalid");
      policy = data;
      const countryOptions = data.countries.map(c =>
        '<option value="' + safe(c.code) + '">' + safe(c.name) + '</option>').join("");
      ui.from.innerHTML = countryOptions;
      ui.to.innerHTML = countryOptions;
      ui.from.value = "FR";
      ui.to.value = "ES";
      ui.directoryRegion.innerHTML = '<option value="all">All regions</option>' +
        [...new Set(data.airlines.map(a => a.region || "Other"))].sort().map(region =>
          '<option value="' + safe(region) + '">' + safe(region) + '</option>').join("");
      syncAirlinePicker(false);
      ui.airline.value = "VY";
      renderLibrary();
      updatePreview();
      render();
    } catch (error) {
      console.error("PawVago source-verified policy data:", error);
      ui.ruleCards.textContent = "Official-source reference data could not be loaded. Please use official airline websites before booking.";
      ui.audit.textContent = "Policy data unavailable";
      ui.results.textContent = "Policy checks cannot be completed at the moment. Do not rely on saved or cached rules.";
    }
  }

  form.addEventListener("submit", e => { e.preventDefault(); render(); });
  [ui.from,ui.to,ui.originCity,ui.destCity].forEach(el => el.addEventListener("change", updatePreview));
  form.querySelectorAll('input[name="pvj-mode"], input[name="pvj-placement"]').forEach(el =>
    el.addEventListener("change", () => { updatePreview(); if(policy) render(); }));
  [ui.breed,ui.snub].forEach(el => el.addEventListener("change", () => { if(policy) render(); }));
  form.querySelectorAll("select").forEach(el => {
    if (el === ui.from || el === ui.to) return;
    el.addEventListener("change", () => { if(policy) render(); });
  });

  ui.airlineSearch.addEventListener("input", () => {
    syncAirlinePicker();
    if (policy && ui.airline.value) render();
    else if (policy) ui.results.textContent = "No matching airline. Search another name or IATA code.";
  });
  [ui.directorySearch,ui.directoryRegion,ui.directoryStatus].forEach(el => {
    el.addEventListener(el === ui.directorySearch ? "input" : "change", () => {
      catalogLimit = 24;
      renderLibrary();
    });
  });
  ui.directoryMore.addEventListener("click", () => {
    catalogLimit += 24;
    renderLibrary();
  });
  ui.ruleCards.addEventListener("click", event => {
    const item = event.target.closest("[data-pvj-pick]");
    if (!item) return;
    const code = item.getAttribute("data-pvj-pick");
    if (!policy?.airlines.some(a => a.id === code)) return;
    ui.airlineSearch.value = "";
    syncAirlinePicker(false);
    ui.airline.value = code;
    const air = form.querySelector('input[name="pvj-mode"][value="air"]');
    if (air) air.checked = true;
    updatePreview();
    render();
  });

  init();
})();
