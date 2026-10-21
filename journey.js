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
    ruleCards: $("pvj-rule-cards"), audit: $("pvj-audit")
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
  let policy = null;

  const renderLibrary = () => {
    if (!policy) return;
    const reviewed = policy.reviewed_on;
    const days = Math.floor((Date.now() - new Date(reviewed + "T12:00:00Z").getTime()) / 86400000);
    const overdue = days > 30;
    ui.audit.innerHTML = '<strong>' + (overdue ? 'Review date is over 30 days old' : 'Official pages reviewed: ' + safe(reviewed)) +
      '</strong><span>' + (overdue ? 'Confirm all details with linked official sources' : 'Manually curated policy snapshot, not live flight capacity') + '</span>';
    ui.ruleCards.innerHTML = policy.airlines.map(a => {
      const dims = a.dimensions_cm?.join(" × ") || "See carrier policy for size";
      return '<article class="pvj-rule-card"><div class="pvj-rule-card-name">' + safe(a.name) + '</div>' +
        '<div class="pvj-rule-card-limit">' + safe(a.cabin_max_kg) + ' <small>kg max</small></div>' +
        '<div class="pvj-rule-card-dim">' + safe(dims) + (a.dimensions_cm ? " cm" : "") + '</div>' +
        '<div class="pvj-rule-card-note">Combined weight of pet and carrier. Restrictions and availability must be confirmed.</div>' +
        '<a href="' + safe(safeUrl(a.source)) + '" target="_blank" rel="noopener noreferrer">Official airline policy ↗</a></article>';
    }).join("");
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
    ui.airlineBox.hidden = getMode() !== "air";
  };

  const render = () => {
    if (!policy) return;
    if (!form.reportValidity()) return;
    const from = policy.countries.find(c => c.code === ui.from.value);
    const to = policy.countries.find(c => c.code === ui.to.value);
    const mode = getMode();
    const species = ui.species.value;
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
    if (mode === "air") docItems.push("Airline approval for pet, carrier and specific flight");

    const notes = [];
    if (from.code === to.code) notes.push("Domestic journeys can follow different rules. Check national and carrier requirements.");
    if (euArrive && !euDepart) notes.push("Entry from outside the EU can require an official health certificate and, depending on origin and history, a rabies antibody test. Check the official country-entry tool.");
    if (species === "dog" && to.dog_tapeworm_hours) notes.push("Tapeworm treatment must be done by a veterinarian in the 24–120 hours before entry.");
    const startDate = new Date(ui.date.value + "T12:00:00");
    if ((startDate.getTime() - Date.now()) / 86400000 < 21)
      notes.push("If this is a primary rabies vaccination, the minimum 21-day waiting period may affect this departure date.");
    if (to.region === "GB")
      notes.push("Great Britain requires an approved route; pets on ordinary commercial flights into GB normally travel as cargo rather than in cabin.");
    if (mode === "air") notes.push("Flight eligibility, route acceptance and pet-space availability are NOT checked or reserved by this tool.");
    else notes.push("Rail and road operator rules, border crossings and route timetables are not checked in this prototype.");

    const pieces = [];
    const status = (title, content, cls="pvj-caution") => {
      pieces.push('<div class="pvj-diagnostic ' + cls + '"><strong>' + safe(title) + '</strong><p>' + safe(content) + '</p></div>');
    };

    pieces.push('<div class="pvj-results-head"><span>Personalised screening</span><span class="pvj-policy-chip">Reviewed ' + safe(policy.reviewed_on) + '</span></div>');

    if (mode === "air") {
      if (!airline) return;
      const max = Number(airline.cabin_max_kg);
      const over = totalKg > max + 0.000001;
      const oversized = !!(dims && airline.dimensions_cm && dims.some((d, i) => d > airline.dimensions_cm[i]));
      const gbFlight = to.region === "GB";
      if (gbFlight) status("Cabin not permitted on standard flights to Great Britain", "Pets normally must travel as cargo on regular commercial flights into Great Britain. Check approved transport routes and operator rules.", "pvj-danger");
      else if (over) status("Above this airline's published cabin weight limit", "Your pet and carrier total " + formatKg(totalKg) + " kg; the published allowance is " + formatKg(max) + " kg.", "pvj-danger");
      else if (oversized) status("Carrier exceeds a published cabin dimension", "Your carrier size is larger than " + airline.dimensions_cm.join(" × ") + " cm in at least one dimension.", "pvj-danger");
      else if (!dims || !airline.dimensions_cm || dimensionsPartial)
        status("Weight within limit — carrier checks still needed", "The combined weight is within " + formatKg(max) + " kg. Check the carrier dimensions, breed, route and available pet spaces directly with " + airline.name + ".", "pvj-caution");
      else status("Preliminary cabin weight and size screen passed", "The published weight and size checks look suitable. This is not airline acceptance or confirmation of a pet reservation.", "pvj-positive");
      pieces.push('<div class="pvj-result-row"><span>Combined weight</span><strong>' + safe(formatKg(totalKg)) + ' kg</strong></div>');
      pieces.push('<div class="pvj-result-row"><span>Published cabin maximum</span><strong>' + safe(max) + ' kg</strong></div>');
      pieces.push('<div class="pvj-result-row"><span>Carrier size</span><strong>' + (airline.dimensions_cm ? safe(airline.dimensions_cm.join(" × ")) + " cm" : "Check with airline") + '</strong></div>');
      pieces.push(sourceLink(airline.source, "Read " + airline.name + " official conditions ↗"));
      if (dimensionsPartial) notes.unshift("Carrier dimensions are incomplete. Enter all three measurements or leave all blank.");
      if (airline.id === "VY") notes.push("Vueling does not carry pets in the hold.");
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
      ui.airline.innerHTML = data.airlines.map(a => '<option value="' + safe(a.id) + '">' + safe(a.name) + '</option>').join("");
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
  form.querySelectorAll('input[name="pvj-mode"]').forEach(el =>
    el.addEventListener("change", () => { updatePreview(); if(policy) render(); }));
  form.querySelectorAll("select").forEach(el => {
    if (el === ui.from || el === ui.to) return;
    el.addEventListener("change", () => { if(policy) render(); });
  });

  init();
})();
