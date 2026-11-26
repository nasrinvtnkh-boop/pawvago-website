/* PawVago / official-source journey reference. This is NOT a live booking inventory. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const form = $("pvj-form");
  if (!form) return;

  // USDA APHIS state directory, with separately reviewed personal-dog entry summaries.
  const usStates = {
    "Alabama": ["https://agi.alabama.gov/animalindustries/animal-health/imports-requirements/", "Carry an official Certificate of Veterinary Inspection (CVI) documenting rabies vaccination when applicable. Alabama does not accept APHIS VS Form 7001 for this movement."],
    "Alaska": ["https://dec.alaska.gov/eh/vet/import/dog-cat-ferret/", "Carry a CVI from a licensed, accredited veterinarian issued within 30 days before entry. Check rabies vaccination requirements and any local rules."],
    "Arizona": ["https://agriculture.az.gov/sites/default/files/documents/AZ%20Dogs%20and%20Cats%20Entry%20Requirements_1.pdf", "Carry a CVI issued by an accredited veterinarian, valid for 30 days. It must document current rabies vaccination for dogs 12 weeks or older."],
    "Arkansas": ["https://codeofarrules.arkansas.gov/Rules/Rule?chapterID=3&levelType=section&partID=221&sectionID=63217&subChapterID=10&subPartID=9394&titleID=2", "Carry an official CVI and proof of rabies vaccination. Check the rule for three-year vaccine recognition and puppy provisions."],
    "California": ["https://www.cdfa.ca.gov/ahfss/Animal_Health/Entry_Requirements.html", "CDFA lists no additional import requirements for a pet dog that is not changing ownership. Check local rabies rules and any airline health certificate separately."],
    "Colorado": ["https://ag.colorado.gov/animals/import-requirements"],
    "Connecticut": ["https://portal.ct.gov/-/media/doag/state-vet/2024/ctimportrequirementsrevised2024.pdf", "Carry a veterinary health certificate issued no more than 30 days before entry and approved by the appropriate official in the state of origin."],
    "Delaware": ["https://regulations.delaware.gov/AdminCode/title3/900/904.pdf"],
    "Florida": ["https://www.fdacs.gov/Consumer-Resources/Animals/Animal-Movement/Dog-and-Cat-Movement-Requirements/Travel-of-Dogs-Cats-and-Pet-Birds-in-out-of-Florida-FAQ", "Florida lists a state health-certificate exemption for privately owned pets travelling with their owner. Check the state rabies requirements and whether the airline requires a CVI."],
    "Georgia": ["https://www.agr.georgia.gov/bringing-animals-georgia", "Carry proof of current, approved rabies vaccination. Georgia lists a separate CVI requirement for animals entering for sale, trade or exchange."],
    "Hawaii": ["https://hdoa.hawaii.gov/ai/aqs/aqs-info/", "For Direct Airport Release or 5 Day Or Less, prepare microchip identification, two rabies vaccination records, a passing FAVN rabies antibody test and its waiting period, a health certificate and import form AQS-279. Check the airport-specific checklist and submission deadlines. Direct release at Kona, Kahului or Lihue requires a Neighbor Island Inspection Permit."],
    "Idaho": ["https://agri.idaho.gov/main/animals/small-animal-species/small-animal-imports/"],
    "Illinois": ["https://agr.illinois.gov/animals/animalhealth/animal-import.html", "Carry a CVI issued within 30 days before entry. It must describe the dog and identify the destination. Follow the state rabies vaccination provisions."],
    "Indiana": ["https://www.in.gov/boah/indiana-entry-health-requirements/"],
    "Iowa": ["https://www.legis.iowa.gov/docs/iac/rule/02-05-2025.21.65.10.pdf", "Carry a CVI. Dogs aged 4 months or older must have a current rabies vaccination. The exhibition exception has separate conditions."],
    "Kansas": ["https://sos.ks.gov/publications/KAR/2022/2022_KAR_Volumes_Book_1.pdf", "Carry a CVI covering health, rabies exposure and rabies vaccination. Dogs under 3 months are exempt from the rabies vaccination provision."],
    "Kentucky": ["https://www.kyagr.com/statevet/animal-movement.html"],
    "Louisiana": ["https://www.interstatelivestock.com/regulations/KS/LA/CAN/653/4129/8634", "Carry a CVI issued within 30 days before entry and rabies vaccination documentation for dogs over 3 months old."],
    "Maine": ["https://www.maine.gov/dacf/ahw/animal_health/index.shtml"],
    "Maryland": ["https://mda.maryland.gov/AnimalHealth/Documents/Maryland%20Animal%20Import%20Regulations%202018-19%20DC.pdf"],
    "Massachusetts": ["https://www.mass.gov/info-details/importing-and-exporting-pets", "Carry a veterinary health certificate. For dogs over 6 months old, check the state vaccination requirements and timing."],
    "Michigan": ["https://www.michigan.gov/mdard/animals/id-movement"],
    "Minnesota": ["https://www.revisor.mn.gov/rules/1721.0500/", "Carry a CVI unless an exemption applies. Temporary entry with no ownership change is exempt when the dog leaves within 30 days."],
    "Mississippi": ["https://www.mbah.ms.gov/regulations/chapter-12/", "Carry proof of current rabies vaccination for dogs 3 months or older. A routine owner-accompanied visit is exempt from CVI requirements. Exhibition, ownership transfer, adoption and unaccompanied travel have separate requirements."],
    "Missouri": ["https://agriculture.mo.gov/animals/rules.php"],
    "Montana": ["https://liv.mt.gov/Animal-Health/Import-Requirements/index", "Carry proof of current rabies vaccination. Montana does not require a state health certificate for a personal pet travelling with its owner."],
    "Nebraska": ["https://nda.nebraska.gov/animal/imports/dogs-cats", "Carry a CVI issued by an accredited veterinarian within 30 days before entry. Check its rabies section, including the provisions for young puppies."],
    "Nevada": ["https://agri.nv.gov/Animals/Animal_Disease/Import_Requirements/"],
    "New Hampshire": ["https://www.gencourt.state.nh.us/rules/state_agencies/agr2100.html"],
    "New Jersey": ["https://www.nj.gov/health/vph/documents/requirements_importation_aug2017.pdf", "Carry a CVI signed by a veterinarian licensed in the state of origin within 30 days of travel. Local dog licensing has separate rabies rules."],
    "New Mexico": ["https://www.nmlbonline.com/import"],
    "New York": ["https://agriculture.ny.gov/animals/companion-animals"],
    "North Carolina": ["https://ncpublichealth.com/epi-sub/cd/diseases/importexport.html", "North Carolina does not require an interstate CVI for dogs. Age-eligible dogs must have current rabies vaccination at entry or receive it within one week of entry."],
    "North Dakota": ["https://www.ndda.nd.gov/divisions/animal-health/animal-movement-and-importation-requirements/dogs-cats-ferrets", "Carry current rabies vaccination proof for dogs over 12 weeks. A CVI is required if the stay exceeds 30 days."],
    "Ohio": ["https://codes.ohio.gov/ohio-administrative-code/rule-901:1-17-05", "Carry an interstate CVI. Dogs aged 12 weeks or older must be vaccinated against rabies and, if vaccinated, travel with the current NASPHV Form 51 certificate. Minimum age is 8 weeks with an exception for nursing puppies travelling with their mother."],
    "Oklahoma": ["https://ag.ok.gov/wp-content/uploads/2025/12/Animal-Import-Requirements.pdf", "Carry a CVI. For dogs aged 12 weeks or older, the CVI must include rabies vaccination details."],
    "Oregon": ["https://www.oregon.gov/oda/programs/AnimalHealthFeedsLivestockID/TravellingWithAnimals/Pages/Basics.aspx"],
    "Pennsylvania": ["https://www.pacodeandbulletin.gov/secure/pacode/data/007/chapter3/s3.91.html", "Carry a health certificate from a licensed veterinarian covering infectious disease and rabies exposure. See the state rule for exact certificate wording."],
    "Rhode Island": ["https://dem.ri.gov/natural-resources-bureau/agriculture-and-forest-environment/agriculture"],
    "South Carolina": ["https://www.clemson.edu/public/lph/ahp/import/index.html"],
    "South Dakota": ["https://aib.sd.gov/Dogs%20%26%20Cats%20Import%20Requirements.pdf", "South Dakota waives the CVI for dogs travelling with their owner and staying less than 30 days. Check vaccination documentation and restrictions in the state checklist."],
    "Tennessee": ["https://www.tn.gov/agriculture/animals/animal-movement-requirements/import-requirements1.html"],
    "Texas": ["https://www.dshs.texas.gov/notifiable-conditions/zoonosis-control/laws/animal-import-export-requirements", "Carry a current rabies certificate for dogs aged 12 weeks or older. Texas does not require a state CVI for dogs. Airlines may have separate certificate requirements."],
    "Utah": ["https://ag.utah.gov/farmers/animal-industry/animal-health-program/animal-import-requirements/"],
    "Vermont": ["https://agriculture.vermont.gov/"],
    "Virginia": ["https://www.vdacs.virginia.gov/animals-animal-admissions.shtml"],
    "Washington": ["https://app.leg.wa.gov/wac/default.aspx?cite=16-54-170", "Carry a CVI documenting rabies vaccination. The heartworm test exemption applies to dogs travelling with the same owner for over one month with no planned sale or ownership change."],
    "West Virginia": ["https://agriculture.wv.gov/divisions/animal-health/health-requirements-imports-fairs/"],
    "Wisconsin": ["https://datcp.wi.gov/Pages/Programs_Services/AnimalMovement.aspx"],
    "Wyoming": ["https://wlsb.state.wy.us/public/animal-health"]
  };

  const ui = {
    from: $("pvj-from"), to: $("pvj-to"), originCity: $("pvj-origin-city"),
    fromState: $("pvj-from-state"), toState: $("pvj-to-state"),
    destCity: $("pvj-dest-city"), date: $("pvj-date"), species: $("pvj-species"),
    weight: $("pvj-weight"), bag: $("pvj-bag"),
    crateWeight: $("pvj-crate-weight"), crateBox: $("pvj-crate-box"),
    results: $("pvj-results"),
    ruleCards: $("pvj-rule-cards"), audit: $("pvj-audit"),
    breed: $("pvj-breed"), snub: $("pvj-snub"), airTransport: $("pvj-air-transport"),
    carrierLabel: $("pvj-carrier-label"), placementHint: $("pvj-placement-hint"),
    directorySearch: $("pvj-directory-search"),
    directoryRegion: $("pvj-directory-region"),
    directoryCount: $("pvj-directory-count"), directoryMore: $("pvj-directory-more"),
    airlineName: $("pvj-airline-name"), airlineNames: $("pvj-airline-names")
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
  const policyReviewed = a => a.policy_status === "reviewed" && Boolean(a.reviewed_on) && safeUrl(a.source) !== "#";
  const normalizeSearch = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().trim();
  const shortNosedRows = (airline, species, breed, results) => {
    if (!window.PawVagoAirMatcher?.shortNosedPolicy) return "";
    const fa = document.documentElement.lang === "fa";
    const labels = fa
      ? {eligible:"مجاز با شرایط",blocked:"غیرمجاز",restricted:"محدودیت دارد",unknown:"تأیید نشده"}
      : {eligible:"Allowed with conditions",blocked:"Not allowed",restricted:"Restricted",unknown:"Unverified"};
    const explanations = fa
      ? {eligible:"وزن، ابعاد باکس و شرایط پرواز را بررسی کنید.",restricted:"پذیرش را برای همین نژاد و مسیر در منبع ایرلاین بررسی کنید.",unknown:"پذیرش این نژاد برای این روش هنوز تأیید نشده است."}
      : {eligible:"Check weight, carrier dimensions and flight conditions.",restricted:"Check the airline’s rules for the exact breed and route.",unknown:"Acceptance for this breed and transport method is unverified."};
    const modes = fa
      ? {cabin:"کابین کنار مسافر",hold:"سوت همراه مسافر",cargo:"کارگو با رزرو جدا"}
      : {cabin:"Passenger cabin",hold:"Checked hold",cargo:"Cargo · separate booking"};
    const title = fa ? "سفر با نژاد پوزه‌کوتاه" : "Short-nosed pet travel";
    return '<div class="pvj-short-nosed"><strong class="pvj-short-nosed-title">' + safe(title) +
      (breed?.trim() ? ' · ' + safe(breed.trim()) : '') + '</strong><ul>' +
      Object.entries(modes).map(([mode,name]) => {
        const rule = window.PawVagoAirMatcher.shortNosedPolicy(airline,mode,species,breed);
        const result = results?.[mode];
        const outcome = result?.kind === "blocked" ? "blocked" : rule.status;
        const reason = outcome === "blocked" ? result?.reasons[0] : explanations[outcome];
        const official = result?.kind === "blocked" && rule.status !== "blocked"
          ? (mode === "hold" ? airline.hold?.source : airline.source)
          : rule.source;
        return '<li><div class="pvj-short-nosed-line"><strong>' + safe(name) +
          '</strong><span class="pvj-short-nosed-status pvj-short-nosed-' + outcome + '">' +
          safe(labels[outcome]) + '</span></div>' +
          (reason ? '<span class="pvj-short-nosed-reason">' + safe(reason) + '</span>' : '') +
          (official ? sourceLink(official,fa ? "منبع رسمی ↗" : "Official source ↗") : '') + '</li>';
      }).join("") + '</ul></div>';
  };

  const renderLibrary = () => {
    if (!policy) return;
    const current = window.PawVagoRouteScope?.scope(policy.airlines,ui.from.value,ui.to.value).airlines || policy.airlines;
    ui.audit.innerHTML = '<strong>' + current.length + ' source-reviewed airline policies</strong>' +
      '<span>Airline review dates are shown individually</span>';
    const term = normalizeSearch(ui.directorySearch.value);
    const region = ui.directoryRegion.value || "all";
    const matches = current.filter(a => {
      const searchable = normalizeSearch([a.name,a.id,a.region,...(a.search_aliases||[])].join(' '));
      return (!term || searchable.includes(term)) &&
        (region === "all" || a.region === region);
    }).sort((a,b) => a.name.localeCompare(b.name, "en"));
    ui.directoryCount.textContent = "Showing " + Math.min(matches.length,catalogLimit) + " of " +
      matches.length + " matching airlines · " + current.length + " source-reviewed";
    ui.ruleCards.innerHTML = matches.length ? matches.slice(0,catalogLimit).map(a => {
      const hold = a.hold || {};
      const cabinAllowed = a.cabin_allowed === true;
      const cabinText = a.cabin_allowed === false ? "No ordinary pets" :
        cabinAllowed && a.cabin_max_kg != null ? formatKg(a.cabin_max_kg) + " kg max" :
        cabinAllowed ? "See published carrier conditions" : "Cabin service not documented";
      const cabinDetail = a.dimensions_cm ? a.dimensions_cm.join(" × ") + " cm carrier" :
        a.cabin_allowed === false ? "Assistance animals follow a separate policy" :
        a.cabin_dimension_variants?.length ? a.cabin_dimension_variants.map(v=>v.label+': '+v.dimensions_cm.join(' × ')+' cm').join(' · ') :
        a.cabin_max_linear_cm ? 'Carrier total dimensions: '+a.cabin_max_linear_cm+' cm maximum' : "Aircraft-specific carrier rules are detailed below";
      const holdText = a.cargo_only ? "Separate cargo service" :
        hold.allowed === false ? "Not offered" :
        hold.weight_label ? hold.weight_label :
        hold.allowed === true && hold.max_combined_kg != null ? formatKg(hold.max_combined_kg) + " kg max" :
        hold.allowed === true ? (hold.weight_policy==='not_published' || hold.weight_policy==='no_fixed_limit' ? "No single published weight cap" : "Accepted in checked hold") : "Checked-hold service not documented";
      const holdDetail = a.cargo_only ? "Booked through a specialist cargo provider, not passenger baggage" :
        hold.allowed === false ? "Ordinary pets not accepted in checked hold" :
        hold.dimension_variants?.length ? hold.dimension_variants.map(v=>v.label+': '+v.dimensions_cm.join(' × ')+' cm').join(' · ') :
        (hold.dimensions_cm ? "Crate up to " + hold.dimensions_cm.join(" × ") + " cm; " : "") +
        (hold.weight_policy==='not_published' ? "Rigid crate and aircraft conditions determine acceptance" : "Operating flight and breed rules apply");
      return '<article class="pvj-rule-card">' +
        '<span class="pvj-rule-card-tag">Source-reviewed reference</span>' +
        '<div class="pvj-rule-card-name">' + safe(a.name) + '</div>' +
        '<small class="pvj-card-code">' + safe(a.id) + '</small>' +
        '<span class="pvj-card-region">' + safe(a.region) + '</span>' +
        shortNosedRows(a) +
        '<div class="pvj-card-mode">CABIN</div><div class="pvj-rule-card-unknown">' + safe(cabinText) + '</div>' +
        '<div class="pvj-rule-card-dim">' + safe(cabinDetail) + '</div>' +
        '<div class="pvj-card-hold"><div class="pvj-card-mode">CHECKED HOLD</div><strong>' +
        safe(holdText) + '</strong><small>' + safe(holdDetail) + '</small></div>' +
        '<div class="pvj-rule-card-note">' +
        'Published weight includes pet and carrier. Flight pet-space reservation is separate.</div>' +
        (a.notes ? '<p class="pvj-rule-card-note">' + safe(a.notes) + '</p>' : '') +
        '<small class="pvj-policy-chip">Reviewed ' + safe(a.reviewed_on) + '</small>' +
        '<a href="' + safe(safeUrl(a.source)) + '" target="_blank" rel="noopener noreferrer">Official policy ↗</a>' +
        (a.sources||[]).filter(url=>url!==a.source).map(url=>sourceLink(url,"More official sources ↗")).join('') +
        '<a class="pvj-card-choose" href="#journey-lab" data-pvj-pick="' + safe(a.id) +
        '">Compare automatically ↗</a></article>';
    }).join("") : '<p>No airlines matched these filters. Try another name, code or region.</p>';
    ui.directoryMore.hidden = matches.length <= catalogLimit;
    ui.directoryMore.textContent = "Show more airlines (" +
      (matches.length - Math.min(matches.length,catalogLimit)) + " remaining) ↓";
  };

  const stateOptions = '<option value="">Select state</option>' +
    Object.keys(usStates).map(state => '<option>' + safe(state) + '</option>').join("");
  [ui.fromState, ui.toState].forEach(select => { select.innerHTML = stateOptions; });
  const syncUsStates = () => {
    [[ui.from, ui.fromState], [ui.to, ui.toState]].forEach(([country, state]) => {
      const show = country.value === "US" && ui.species.value === "dog";
      state.closest("label").parentElement.hidden = !show;
      state.disabled = !show;
      if (!show) state.value = "";
    });
    $("pvj-us-states").hidden = ui.fromState.disabled && ui.toState.disabled;
  };

  const updatePreview = () => {
    syncUsStates();
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

    const usDogArrival = to.code === "US" && species === "dog";
    const domesticUs = from.code === "US" && to.code === "US";
    const arrivalState = usDogArrival ? ui.toState.value : "";
    const departureState = domesticUs ? ui.fromState.value : "";
    const stateEntry = usStates[arrivalState];
    const sameState = Boolean(arrivalState && arrivalState === departureState);
    const toHawaii = arrivalState === "Hawaii" && !sameState;
    const mainlandHawaiiRoute = domesticUs && departureState &&
      ((departureState === "Hawaii") !== (arrivalState === "Hawaii")) && arrivalState;
    const northAmerica = ['US','CA','MX'].includes(to.code);
    const regionalEntry = ['Caribbean','South America'].includes(to.region);
    const internationalRegionalEntry = regionalEntry && from.code !== to.code;
    const entry = to.pet_entry;
    const regionalItems = internationalRegionalEntry
      ? (from.code === "US" && entry?.us_checklist) || entry?.checklist || []
      : [];
    const regionalSource = internationalRegionalEntry
      ? entry?.source || (from.code === "US" ? entry?.us_source : null)
      : null;
    const source = regionalEntry ? regionalSource : domesticUs && usDogArrival ? "https://www.aphis.usda.gov/pet-travel/state-to-state" : northAmerica ? policy.official_sources[to.code.toLowerCase()] :
      to.region === "GB" ? policy.official_sources.gb : policy.official_sources.eu;
    const usToCanadaDog = from.code === "US" && to.code === "CA" && species === "dog";
    const docItems = regionalEntry ? [...regionalItems] : usToCanadaDog ? [
      "Personal dog travelling with you, aged 3 months or older: carry a current rabies vaccination certificate in English or French from a licensed veterinarian that identifies your dog",
      "Dog younger than 3 months: carry proof of age; rabies vaccination is not required for Canadian entry",
      "If the dog is travelling unaccompanied or for sale, adoption or another commercial purpose, check the separate Canadian import requirements"
    ] : domesticUs && usDogArrival ? [] : northAmerica ? [
      "Check official destination entry requirements for your pet's species, age, origin and travel history",
      "Confirm required health, vaccination and identification documents with the destination authority"
    ] : [
      "Identification microchip (record must match pet)",
      "Valid rabies vaccination (check microchip/vaccination dates)"
    ];
    const euDepart = from.region === "EU";
    const euArrive = to.region === "EU" || to.region === "EU-associated";
    if (usDogArrival && !domesticUs) docItems.push("Complete the CDC Dog Import Form and check requirements based on the dog's last six months of travel");
    if (stateEntry?.[1] && !sameState && (domesticUs || toHawaii)) docItems.push(stateEntry[1]);
    if (northAmerica || regionalEntry) { /* Country-specific official tools above replace the EU checklist. */ }
    else if (euDepart && euArrive) docItems.push("Valid EU pet passport");
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
    if (!northAmerica && !regionalEntry && (startDate.getTime() - Date.now()) / 86400000 < 21)
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


    if (internationalRegionalEntry) {
      const title = to.name + " entry documents";
      status(title, regionalItems.length
        ? "Review the destination checklist and verify the conditions for your pet and departure country in the official source."
        : "PawVago does not yet have a verified checklist for this departure country and destination.");
    }

    if (usDogArrival) {
      if (!arrivalState) {
        status("Select the destination state", "State entry documents vary. Choose the U.S. destination state above.");
      } else {
        const [url, summary] = stateEntry;
        const description = sameState ? "For a trip entirely within one state, check local and carrier rules."
          : !domesticUs && !toHawaii ? "U.S. federal entry requirements apply. Use the state source below to verify any additional requirements for dogs arriving from abroad."
          : summary ? "The checklist below covers personal dogs travelling with their owners. Verify any age, timing or purpose exceptions in the state source."
          : "Open the official state source for the required documents. A state-specific checklist has yet to be verified.";
        status(arrivalState + " dog travel documents", description);
        pieces.push(sourceLink(url, arrivalState + " entry requirements ↗"));
      }
    }

    if (mode === "air") {
      if (usDogArrival) status("Cabin and checked hold", "The operating airline sets transport rules for the flight, carrier and breed. State admission documents are required separately where applicable.", "pvj-caution");
      if (toHawaii || mainlandHawaiiRoute) {
        status("Hawaii flight restrictions", "Hawaii services have airline-specific route exceptions. Confirm the operating flight and pet space before booking.");
      }
      if (placement === "cargo") {
        const cargoCarrier = normalizeSearch(ui.airlineName?.value);
        const provider = cargoCarrier && policy.airlines.find(a =>
          [a.id, a.name].some(name => normalizeSearch(name) === cargoCarrier));
        if (provider && snub) pieces.push(shortNosedRows(provider,species,ui.breed.value));
        if (provider?.cargo?.source) {
          status(provider.name + " live-animal cargo", provider.cargo.notes);
          pieces.push(sourceLink(provider.cargo.source, "Official " + provider.name + " cargo rules ↗"));
        }
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
        const preferredName = ui.airlineName?.value.trim() || "";
        const normalizedAirlineName = normalizeSearch(preferredName);
        const exactCode = normalizedAirlineName
          ? policy.airlines.filter(a => a.id.toLocaleLowerCase() === normalizedAirlineName)
          : [];
        const namedAirlines = !normalizedAirlineName ? policy.airlines
          : exactCode.length ? exactCode
          : policy.airlines.filter(a => normalizeSearch([a.name,...(a.search_aliases||[])].join(' ')).includes(normalizedAirlineName));
        const routeScope = window.PawVagoRouteScope?.scope(namedAirlines,from.code,to.code);
        const routeAirlines = (routeScope?.airlines || namedAirlines).map(airline => {
          if (airline.id === "DL" && toHawaii) return {...airline, cabin_allowed: false};
          if (airline.id === "WN" && mainlandHawaiiRoute)
            return {...airline, cabin_allowed: false, hold: {...airline.hold, allowed: false}};
          return airline;
        });
        const analysis = window.PawVagoAirMatcher.evaluate(routeAirlines,{
          petKg, cabinKg:carrierKg, crateKg, species,
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
          const explanation = '<p>' + safe(candidateSummary) + '</p>' +
            (otherNotes ? '<p>' + otherNotes + '</p>' : '') + detail +
            (airline.notes ? '<p class="pvj-match-warning">' + safe(airline.notes) + '</p>' : '');
          return '<article class="pvj-match-card pvj-match-' + safe(best.kind) + '">' +
            '<div class="pvj-match-card-head"><h4>' + safe(airline.name) + '</h4>' +
            (snub ? "" : '<span class="pvj-match-card-tag">' + safe(modeName(best.method)) + ' · ' +
              safe(showStatus(best)) + '</span>') + '</div>' +
            (snub ? shortNosedRows(airline,species,ui.breed.value,{cabin,hold}) +
              '<details class="pvj-short-nosed-details"><summary>' +
              (document.documentElement.lang === "fa" ? "جزئیات وزن، باکس و پرواز" : "Weight, carrier and flight details") +
              '</summary>' + explanation + '</details>' : explanation) +
            (airline.reviewed_on ? '<small class="pvj-policy-chip">Reviewed ' + safe(airline.reviewed_on) + '</small>' : '') +
            (refUrl ? sourceLink(refUrl,"Official " + airline.name + " animal transport rules ↗") : '') +
            '</article>';
        };
        const potential=analysis.groups.potential,review=analysis.groups.review,blocked=analysis.groups.blocked;
        if (!analysis.total) {
          status("No published airline guide matches this search",
            "Try a different carrier or clear the airline field to see the guides available for this trip.", "pvj-caution");
        } else {
          pieces.push('<div class="pvj-match-overview">' +
            '<div><strong>' + potential.length + '</strong><small>Initial policy matches</small></div>' +
            '<div><strong>' + review.length + '</strong><small>Need additional checks</small></div>' +
            '<div><strong>' + blocked.length + '</strong><small>Policy mismatches</small></div></div>');
          if (routeScope?.filtered) pieces.push('<p class="pvj-match-warning">' + (document.documentElement.lang==='fa' ? 'ایرلاین‌ها بر اساس قاره‌های مبدأ و مقصد فیلتر شده‌اند؛ این فهرست جست‌وجوی پرواز نیست.' : 'Airlines are filtered by departure and destination continents. This is not a flight search.') + '</p>');
          pieces.push('<p class="pvj-match-warning">' + safe(analysis.warning) + '</p>');
          if (placement==="auto") pieces.push('<p class="pvj-match-warning">Automatic mode compares cabin using your cabin bag weight, and checked hold using a separate rigid crate weight. It does not assume the same carrier can be used in both places.</p>');
          if (potential.length) pieces.push('<div class="pvj-match-group-heading"><span>Preliminary policy matches</span><small>Confirm your flight and pet space</small></div><div class="pvj-match-list">' +
            potential.map(airlineCard).join("") + '</div>');
          else pieces.push('<div class="pvj-match-empty">No airline has passed all available first-stage weight and container checks yet. Complete the carrier dimensions and breed, or review the airlines that need more information below.</div>');
          if (review.length) pieces.push('<div class="pvj-match-group-heading"><span>Potential options requiring verification</span><small>' +
            review.length + ' airlines</small></div><div class="pvj-match-list">' + review.map(airlineCard).join("") + '</div>');
          if (blocked.length) pieces.push('<details class="pvj-match-blocked-list"><summary>Not suitable under listed conditions (' +
            blocked.length + ' carriers)</summary><div class="pvj-match-list" style="margin-top:12px">' +
            blocked.map(airlineCard).join("") + '</div></details>');
        }
      }
    } else {
      status(mode === "rail" ? "Rail: personalised document checklist" : "Road: personalised document checklist",
        "PawVago prepares the destination checklist. Exact operator policies, border crossings and route availability have not been verified.", "pvj-caution");
    }

    if (docItems.length) pieces.push('<div class="pvj-docs"><h4>Document preparation checklist</h4><p>Tick items as you verify them; this checklist is saved only on this screen.</p>' +
      docItems.map((item, i) => '<label><input type="checkbox" data-pvj-doc="' + i + '"><span>' + safe(item) + '</span></label>').join("") +
      '<progress id="pvj-doc-meter" value="0" max="' + docItems.length + '" aria-label="Checklist progress"></progress>' +
      '<div id="pvj-doc-progress" class="pvj-doc-progress" aria-live="polite">0 of ' + docItems.length + ' items checked</div></div>');

    if (notes.length) pieces.push('<div class="pvj-diagnostic pvj-caution"><strong>Before you book</strong><p>' + notes.map(safe).join("<br>") + '</p></div>');
    if (source) pieces.push(sourceLink(source, regionalEntry ? to.name + " official entry guidance ↗" : northAmerica ? "Destination official pet entry rules ↗" : to.region === "GB" ? "Great Britain official entry rules ↗" : "EU official pet travel rules ↗"));
    if (internationalRegionalEntry && from.code === "US" && entry?.us_source && entry.us_source !== source)
      pieces.push(sourceLink(entry.us_source, "USDA guidance for travel from the United States ↗"));
    if (usToCanadaDog) pieces.push(sourceLink("https://www.aphis.usda.gov/pet-travel/us-to-another-country-export/pet-travel-us-canada", "USDA guidance for dogs travelling to Canada ↗"));
    if (mode === "air" && toHawaii)
      pieces.push(sourceLink("https://www.delta.com/us/en/pet-travel/overview", "Delta pet travel to Hawaii ↗"));
    if (mode === "air" && mainlandHawaiiRoute)
      pieces.push(sourceLink("https://support.southwest.com/helpcenter/article/traveling-with-pets-destination-information", "Southwest Hawaii pet restrictions ↗"));
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
      policy = {...data, airlines:data.airlines.filter(policyReviewed)};
      const countryOptions = [...data.countries].sort((a,b) => a.name.localeCompare(b.name, "en")).map(c =>
        '<option value="' + safe(c.code) + '">' + safe(c.name) + '</option>').join("");
      const chooseCountry = '<option value="" selected disabled>Select country</option>';
      ui.from.innerHTML = chooseCountry + countryOptions;
      ui.to.innerHTML = chooseCountry + countryOptions;
      ui.from.value = "";
      ui.to.value = "";
      ui.directoryRegion.innerHTML = '<option value="all">All regions</option>' +
        [...new Set(policy.airlines.map(a => a.region || "Other"))].sort().map(region =>
          '<option value="' + safe(region) + '">' + safe(region) + '</option>').join("");

      if (ui.airlineNames) ui.airlineNames.innerHTML = policy.airlines
        .slice().sort((a,b)=>a.name.localeCompare(b.name,"en"))
        .map(a => '<option value="' + safe(a.name) + '"></option>').join("");
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
  const syncRouteRegions = () => {
    if (!policy || !window.PawVagoRouteScope) return;
    const scoped = window.PawVagoRouteScope.scope(policy.airlines,ui.from.value,ui.to.value);
    const selected = ui.directoryRegion.value;
    const regions = [...new Set(scoped.airlines.map(a=>a.region || 'Other'))].sort();
    ui.directoryRegion.innerHTML = '<option value="all">' + (document.documentElement.lang==='fa' ? 'همهٔ مناطق مرتبط' : 'All relevant regions') + '</option>' + regions.map(region=>'<option value="'+safe(region)+'">'+safe(region)+'</option>').join('');
    ui.directoryRegion.value = regions.includes(selected) ? selected : 'all';
    if (ui.airlineNames) ui.airlineNames.innerHTML = scoped.airlines.slice().sort((a,b)=>a.name.localeCompare(b.name,'en')).map(a=>'<option value="'+safe(a.name)+'"></option>').join('');
    catalogLimit=Number.POSITIVE_INFINITY;
    renderLibrary();
  };

  const rerender = () => {syncRouteRegions();updatePreview();if(policy && form.checkValidity())render();else if(policy) ui.results.textContent = document.documentElement.lang==='fa' ? 'مشخصات سفر را کامل کنید تا نتیجهٔ متناسب با مبدأ و مقصد جدید نمایش داده شود.' : 'Complete the journey details to see results for the selected departure and destination.';};
  [ui.from,ui.to,ui.fromState,ui.toState,ui.originCity,ui.destCity,ui.date,ui.species,ui.weight,
    ui.bag,ui.crateWeight,ui.breed,ui.snub,ui.airlineName,
    $("pvj-length"),$("pvj-width"),$("pvj-height"),
    $("pvj-crate-length"),$("pvj-crate-width"),$("pvj-crate-height")
  ].forEach(el => {
    el.addEventListener("change",rerender);
    if (el.matches && el.matches('input:not([type="checkbox"])')) el.addEventListener("input",rerender);
  });
  form.querySelectorAll('input[name="pvj-mode"],input[name="pvj-placement"]').forEach(el =>
    el.addEventListener("change",rerender));
  [ui.directorySearch,ui.directoryRegion].forEach(el => {
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
    if (ui.airlineName) ui.airlineName.value=anchor.dataset.pvjPick;
    rerender();
  });

  window.PawVagoCitySearch?.bind(ui.originCity, ui.from);
  window.PawVagoCitySearch?.bind(ui.destCity, ui.to);
  init();
})();


