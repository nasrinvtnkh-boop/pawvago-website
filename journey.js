/* PawVago / official-source journey reference. This is NOT a live booking inventory. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const form = $("pvj-form");
  if (!form) return;

  const ui = {
    from: $("pvj-from"), to: $("pvj-to"), originCity: $("pvj-origin-city"),
    destCity: $("pvj-dest-city"), date: $("pvj-date"), species: $("pvj-species"),
    weight: $("pvj-weight"), bag: $("pvj-bag"),
    crateWeight: $("pvj-crate-weight"), crateBox: $("pvj-crate-box"),
    results: $("pvj-results"),
    ruleCards: $("pvj-rule-cards"), audit: $("pvj-audit"),
    breed: $("pvj-breed"), snub: $("pvj-snub"), airTransport: $("pvj-air-transport"),
    carrierLabel: $("pvj-carrier-label"), placementHint: $("pvj-placement-hint"),
    directorySearch: $("pvj-directory-search"),
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
  ui.date.value = "";

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
    auto:"PawVago compares cabin and checked-hold airline policies automatically. Rigid crate details are separate from cabin bag details.",
    cabin:"Cabin: your pet stays in a compliant under-seat carrier.",
    hold:"Hold (checked baggage / AVIH): your pet travels in a ventilated, climate-controlled compartment. A rigid IATA-compliant crate is required.",
    cargo:"Air cargo (freight): separate handling and booking through a qualified animal transport provider; not booked with ordinary checked baggage."
  };
  let policy = null;

  let catalogLimit = Number.POSITIVE_INFINITY;
  const policyReviewed = a => a.policy_status === "reviewed";
  const reviewLabel = a => policyReviewed(a) ? "Source-reviewed reference" : "Policy not yet verified";
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
    }).sort((a,b) => Number(policyReviewed(b)) - Number(policyReviewed(a)) ||
      a.name.localeCompare(b.name, "en"));
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
        '">Compare automatically ↗</a></article>';
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
    ui.crateBox.hidden = !isAir || (placement !== "auto" && placement !== "hold");
    ui.carrierLabel.textContent = "Cabin bag weight (kg)";
    ui.placementHint.textContent = modeLabels[placement] || modeLabels.cabin;
  };

  const render = () => {
    if (!policy) return;

    const from = policy.countries.find(c => c.code === ui.from.value);
    const to = policy.countries.find(c => c.code === ui.to.value);
    const mode = getMode();
    const placement = getPlacement();
    const species = ui.species.value;
    const snub = flatNosed(species);
    const petKg = Number(ui.weight.value);
    const carrierKg = Number(ui.bag.value);
    const totalKg = petKg + carrierKg;
    const dimsInput = [$("pvj-length").value, $("pvj-width").value, $("pvj-height").value];
    const dimensionsComplete = dimsInput.every(s => String(s).trim() !== "");
    const dimensionsPartial = dimsInput.some(s => String(s).trim() !== "") && !dimensionsComplete;
    const dims = dimensionsComplete ? dimsInput.map(Number) : null;
    if (!from || !to || !(petKg > 0) || !(carrierKg > 0) || !ui.date.value) {
      ui.results.innerHTML = '<p class="pvj-result-placeholder">Enter the departure, destination, travel date and pet / cabin bag weights to compare airlines automatically.</p>';
      return;
    }
    const crateValue = ui.crateWeight.value.trim();
    const crateKg = crateValue ? Number(crateValue) : null;
    const crateRaw = [$("pvj-crate-length").value,$("pvj-crate-width").value,$("pvj-crate-height").value];
    const crateDimsComplete = crateRaw.every(v => String(v).trim() !== "");
    const crateDimsPartial = crateRaw.some(v => String(v).trim() !== "") && !crateDimsComplete;
    const crateDims = crateDimsComplete ? crateRaw.map(Number) : null;
    const invalidDimensions = (dims && dims.some(x => !Number.isFinite(x) || x <= 0)) ||
      (crateDims && crateDims.some(x => !Number.isFinite(x) || x <= 0));
    if ((crateKg !== null && (!Number.isFinite(crateKg) || crateKg <= 0)) || invalidDimensions) {
      ui.results.innerHTML = '<p class="pvj-result-placeholder">Enter positive, valid weights and dimensions to compare airline rules.</p>';
      return;
    }
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
      if (placement === "hold" || placement === "auto") {
        docItems.push("Review cabin versus checked-hold options and get written airline approval");
        docItems.push("Rigid IATA-compliant crate if travelling in the hold: adequate standing, turning and lying space");
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
    if (to.region === "GB" && from.region !== "GB")
      notes.push("Great Britain requires an approved air route; ordinary pets entering GB on commercial flights normally travel as cargo, not passenger cabin or checked hold baggage.");
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
        status("Air freight requires a separate service and booking",
          "Cargo involves a qualified animal freight operator. PawVago cannot match cargo flights, quotes or accepted breeds with the current data.",
          "pvj-caution");
        if (to.region === "GB") status("Great Britain: check an approved cargo route",
          "For ordinary commercial flights into Great Britain, companion animals normally travel as freight cargo. Confirm approved carrier and routes.",
          "pvj-caution");
        pieces.push(sourceLink(policy.cargo_info?.source || policy.official_sources.gb_routes,"View official guidance on cargo / approved routes ↗"));
      } else if (!window.PawVagoAirMatcher) {
        status("Airline comparison unavailable",
          "The airline matching module could not be loaded. Do not make decisions using incomplete results.","pvj-danger");
      } else {
        const analysis = window.PawVagoAirMatcher.evaluate(policy.airlines,{
          petKg, cabinKg:carrierKg, crateKg,
          cabinDims:dims, crateDims,
          cabinDimensionsPartial:dimensionsPartial,crateDimensionsPartial:crateDimsPartial,
          breed:ui.breed.value,snub,from:from.code,to:to.code,placement
        });
        const showStatus = result => result.kind === "potential" ? "Passes initial policy screen" :
                                     result.kind === "review" ? "Check further" : "Not suitable under listed policy";
        const modeName = mode => mode==="hold" ? "Checked hold" : "Cabin";
        const airlineCard = entry => {
          const {airline,best,cabin,hold} = entry;
          const candidateSummary = best.reasons[0] || "Contact the operating airline for confirmation.";
          const detail = placement==="auto" ? '<div class="pvj-match-card-mode">' +
            '<span class="pvj-match-mode-pill"><strong>Cabin:</strong> ' + safe(showStatus(cabin)) + '</span>' +
            '<span class="pvj-match-mode-pill"><strong>Hold:</strong> ' + safe(showStatus(hold)) + '</span></div>' : "";
          const refUrl = best.method==="hold" ? (airline.hold?.source || airline.source) : airline.source;
          const otherNotes = best.reasons.slice(1,3).map(safe).join(" · ");
          return '<article class="pvj-match-card pvj-match-' + safe(best.kind) + '">' +
            '<div class="pvj-match-card-head"><h4>' + safe(airline.name) + '</h4>' +
            '<span class="pvj-match-card-tag">' + safe(modeName(best.method)) + ' · ' +
            safe(showStatus(best)) + '</span></div>' +
            '<p>' + safe(candidateSummary) + '</p>' +
            (otherNotes ? '<p>' + otherNotes + '</p>' : '') + detail +
            (refUrl ? sourceLink(refUrl,"Official " + airline.name + " animal transport rules ↗") : '') +
            '</article>';
        };
        const potential=analysis.groups.potential,review=analysis.groups.review,blocked=analysis.groups.blocked;
        pieces.push('<div class="pvj-match-overview">' +
          '<div><strong>' + potential.length + '</strong><small>Initial policy matches</small></div>' +
          '<div><strong>' + review.length + '</strong><small>Need additional checks</small></div>' +
          '<div><strong>' + blocked.length + '</strong><small>Policy mismatches</small></div></div>');
        pieces.push('<p class="pvj-match-warning"><strong>Important:</strong> ' + safe(analysis.warning) +
          ' Results only use ' + analysis.reviewed + ' source-reviewed airline policies; ' + analysis.unverified +
          ' unverified listings have been excluded from recommendations.</p>');
        if (placement==="auto") pieces.push('<p class="pvj-match-warning">Automatic mode compares cabin using your cabin bag weight, and checked hold using a separate rigid crate weight. It does not assume the same carrier can be used in both places.</p>');
        if (potential.length) pieces.push('<div class="pvj-match-group-heading"><span>Preliminary policy matches</span><small>Flight route + space unverified</small></div><div class="pvj-match-list">' +
          potential.map(airlineCard).join("") + '</div>');
        else pieces.push('<div class="pvj-match-empty">No airline has passed all available first-stage weight and container checks yet. Complete the carrier dimensions and breed, or review the airlines that need more information below.</div>');
        if (review.length) pieces.push('<div class="pvj-match-group-heading"><span>Potential options requiring verification</span><small>' +
          review.length + ' airlines</small></div><div class="pvj-match-list">' + review.map(airlineCard).join("") + '</div>');
        if (blocked.length) pieces.push('<details class="pvj-match-blocked-list"><summary>Not suitable under listed conditions (' +
          blocked.length + ' carriers)</summary><div class="pvj-match-list" style="margin-top:12px">' +
          blocked.map(airlineCard).join("") + '</div></details>');
        if (analysis.unverified) pieces.push('<p class="pvj-match-disclaimer">More airlines are listed in our <a href="#policy-library">airline directory ↗</a>, but policy details are unverified and cannot be safely recommended yet.</p>');
      }
    } else {
      status(mode === "rail" ? "Rail: personalised document checklist" : "Road: personalised document checklist",
        "PawVago prepares the destination checklist. Exact operator policies, border crossings and route availability have not been verified.", "pvj-caution");
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
      // Relative URL works both at a domain root and under a Vercel preview path.
      // If an edge rewrite returns HTML instead of JSON, try the bundled snapshot.
      const urls = ["data/pet-policy-snapshot.json", "https://raw.githubusercontent.com/nasrinvtnkh-boop/pawvago-website/main/data/pet-policy-snapshot.json"];
      let data = null, lastError = null;
      for (const url of urls) {
        try {
          const response = await fetch(url, { cache: "no-store" });
          if (!response.ok) throw new Error("Policy snapshot HTTP " + response.status);
          const candidate = await response.json();
          if (!Array.isArray(candidate?.airlines) || !Array.isArray(candidate?.countries) ||
              !candidate.airlines.length || !candidate.countries.length ||
              !candidate.reviewed_on || !candidate.official_sources?.eu)
            throw new Error("Policy snapshot invalid");
          data = candidate;
          break;
        } catch (error) { lastError = error; }
      }
      if (!data) throw lastError || new Error("Policy data unavailable");
      if (!data?.countries?.length || !data?.airlines?.length || !data.reviewed_on || !data.official_sources?.eu)
        throw new Error("Policy data invalid");
      policy = data;
      const countryOptions = data.countries.map(c =>
        '<option value="' + safe(c.code) + '">' + safe(c.name) + '</option>').join("");
      const chooseCountry = '<option value="" selected disabled>Select country</option>';
      ui.from.innerHTML = chooseCountry + countryOptions;
      ui.to.innerHTML = chooseCountry + countryOptions;
      ui.from.value = "";
      ui.to.value = "";
      ui.directoryRegion.innerHTML = '<option value="all">All regions</option>' +
        [...new Set(data.airlines.map(a => a.region || "Other"))].sort().map(region =>
          '<option value="' + safe(region) + '">' + safe(region) + '</option>').join("");

      renderLibrary();
      updatePreview();
      ui.results.textContent = "Complete your journey details to see personalized travel guidance.";
    } catch (error) {
      console.error("PawVago source-verified policy data:", error);
      ui.ruleCards.textContent = "Official-source reference data could not be loaded. Please use official airline websites before booking.";
      ui.audit.textContent = "Policy data unavailable";
      ui.results.textContent = "Policy checks cannot be completed at the moment. Do not rely on saved or cached rules.";
    }
  }


  form.addEventListener("submit", event => {
    event.preventDefault();
    if (form.reportValidity()) render();
  });
  const rerender = () => {updatePreview();if(policy && form.checkValidity())render();};
  [ui.from,ui.to,ui.originCity,ui.destCity,ui.date,ui.species,ui.weight,
    ui.bag,ui.crateWeight,ui.breed,ui.snub,
    $("pvj-length"),$("pvj-width"),$("pvj-height"),
    $("pvj-crate-length"),$("pvj-crate-width"),$("pvj-crate-height")
  ].forEach(el => {
    el.addEventListener("change",rerender);
    if (el.matches && el.matches('input:not([type="checkbox"])')) el.addEventListener("input",rerender);
  });
  form.querySelectorAll('input[name="pvj-mode"],input[name="pvj-placement"]').forEach(el =>
    el.addEventListener("change",rerender));
  [ui.directorySearch,ui.directoryRegion,ui.directoryStatus].forEach(el => {
    el.addEventListener(el === ui.directorySearch ? "input" : "change", () => {
      catalogLimit = Number.POSITIVE_INFINITY;
      renderLibrary();
    });
  });
  ui.directoryMore.addEventListener("click",() => {catalogLimit += 24;renderLibrary();});
  ui.ruleCards.addEventListener("click",event => {
    const anchor=event.target.closest("[data-pvj-pick]");
    if (!anchor) return;
    const air=form.querySelector('input[name="pvj-mode"][value="air"]');
    const auto=form.querySelector('input[name="pvj-placement"][value="auto"]');
    if (air) air.checked=true;
    if (auto) auto.checked=true;
    rerender();
  });

  init();
})();
