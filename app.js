const C = window.PAWVAGO_CONFIG || {};

const sb =
  C.SUPABASE_URL &&
  C.SUPABASE_ANON_KEY &&
  window.supabase
    ? window.supabase.createClient(
        C.SUPABASE_URL,
        C.SUPABASE_ANON_KEY
      )
    : null;

const $ = id => document.getElementById(id);

let user = null;
let pet = null;
let trip = null;
let mode = 'signup';

let airlineData = [];
let countryRuleData = [];
let serviceData = [];

const COUNTRY_ALIASES = {
  france: 'France',
  france: 'France',
  paris: 'France',
  nantes: 'France',
  'la chapelle-sur-erdre': 'France',
  'saint-herblain': 'France',

  hungary: 'Hungary',
  budapest: 'Hungary',

  spain: 'Spain',
  madrid: 'Spain',
  barcelona: 'Spain',

  germany: 'Germany',
  berlin: 'Germany',
  munich: 'Germany',
  frankfurt: 'Germany',

  italy: 'Italy',
  rome: 'Italy',
  milan: 'Italy',

  portugal: 'Portugal',
  lisbon: 'Portugal',

  austria: 'Austria',
  vienna: 'Austria',

  poland: 'Poland',
  warsaw: 'Poland',
  krakow: 'Poland',

  belgium: 'Belgium',
  brussels: 'Belgium',

  netherlands: 'Netherlands',
  amsterdam: 'Netherlands',

  finland: 'Finland',
  ireland: 'Ireland',
  malta: 'Malta',
  norway: 'Norway',

  'northern ireland': 'Northern Ireland',

  switzerland: 'Switzerland',

  uk: 'United Kingdom',
  'united kingdom': 'United Kingdom',

  czechia: 'Czechia',
  'czech republic': 'Czechia',

  croatia: 'Croatia',
  greece: 'Greece'
};

const COUNTRY_CODES = {
  France: 'FR',
  Hungary: 'HU',
  Spain: 'ES',
  Germany: 'DE',
  Italy: 'IT',
  Portugal: 'PT',
  Austria: 'AT',
  Poland: 'PL',
  Belgium: 'BE',
  Netherlands: 'NL',
  Finland: 'FI',
  Ireland: 'IE',
  Malta: 'MT',
  Norway: 'NO',
  'Northern Ireland': 'GB-NIR',
  Switzerland: 'CH',
  'United Kingdom': 'GB',
  Czechia: 'CZ',
  Croatia: 'HR',
  Greece: 'GR'
};


/* =========================================================
   HELPERS
========================================================= */

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}


function fmtDate(value) {
  if (!value) return '';

  const d = new Date(value + 'T00:00:00');

  if (Number.isNaN(d.getTime())) {
    return value;
  }

  return d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}


function todayISO() {
  return new Date().toISOString().slice(0, 10);
}


function addDays(dateString, days) {
  const d = new Date(dateString + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}


function countryFromDestination(value) {
  const s = String(value || '')
    .trim()
    .toLowerCase();

  for (const [alias, country] of Object.entries(COUNTRY_ALIASES)) {
    if (
      s === alias ||
      s.includes(alias)
    ) {
      return country;
    }
  }

  return null;
}


function countryCode(country) {
  return COUNTRY_CODES[country] || null;
}


function petWeight() {
  return Number(
    pet?.weight_kg ??
    pet?.weight ??
    0
  );
}


/* =========================================================
   STYLES FOR PAWVAGO ENGINE
========================================================= */

function ensureStyles() {

  if ($('pawvagoEngineStyles')) return;

  const style = document.createElement('style');

  style.id = 'pawvagoEngineStyles';

  style.textContent = `

    .pv-engine {
      display:grid;
      gap:18px;
      margin-top:18px;
    }

    .pv-card {
      padding:20px;
      border:1px solid rgba(15,23,42,.10);
      border-radius:18px;
      background:#fff;
    }

    .pv-card h3 {
      margin:0 0 12px;
    }

    .pv-grid {
      display:grid;
      grid-template-columns:repeat(
        auto-fit,
        minmax(230px,1fr)
      );
      gap:12px;
    }

    .pv-airline {
      padding:16px;
      border:1px solid rgba(15,23,42,.10);
      border-radius:14px;
    }

    .pv-airline strong {
      font-size:1.05rem;
    }

    .pv-pill {
      display:inline-block;
      padding:5px 9px;
      border-radius:999px;
      font-size:.78rem;
      font-weight:700;
      background:#eef2f7;
      margin-top:8px;
    }

    .pv-ok {
      background:#dcfce7;
      color:#166534;
    }

    .pv-warn {
      background:#fef3c7;
      color:#92400e;
    }

    .pv-bad {
      background:#fee2e2;
      color:#991b1b;
    }

    .pv-row {
      display:flex;
      gap:10px;
      align-items:flex-start;
      padding:10px 0;
      border-bottom:1px solid rgba(15,23,42,.07);
    }

    .pv-row:last-child {
      border-bottom:0;
    }

    .pv-icon {
      width:25px;
      height:25px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:800;
      flex:0 0 25px;
    }

    .pv-muted {
      opacity:.68;
      font-size:.9rem;
    }

    .pv-timeline {
      display:grid;
      gap:10px;
    }

    .pv-timeline-item {
      padding:12px 14px;
      border-left:3px solid rgba(15,23,42,.18);
      background:#f8fafc;
      border-radius:0 10px 10px 0;
    }

    .pv-timeline-item strong {
      display:block;
    }

    .pv-service {
      padding:14px;
      border:1px solid rgba(15,23,42,.10);
      border-radius:14px;
    }

    .pv-service h4 {
      margin:0 0 6px;
    }

    .pv-disclaimer {
      font-size:.82rem;
      line-height:1.5;
      opacity:.7;
    }

    .pv-empty {
      padding:16px;
      border-radius:14px;
      background:#f8fafc;
    }

    .pv-summary {
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(150px,1fr));
      gap:10px;
      margin:14px 0 18px;
    }

    .pv-summary-item {
      padding:13px 14px;
      border:1px solid rgba(15,23,42,.08);
      border-radius:12px;
      background:#f8fafc;
    }

    .pv-summary-item strong {
      display:block;
      font-size:1.05rem;
      margin-bottom:3px;
    }

    .pv-summary-item span {
      font-size:.78rem;
      opacity:.68;
    }

  `;

  document.head.appendChild(style);
}


/* =========================================================
   AUTH
========================================================= */

function auth(newMode) {

  mode = newMode;

  $('authTitle').textContent =
    mode === 'signup'
      ? 'Create your account'
      : 'Welcome back';

  $('authSubtitle').textContent =
    mode === 'signup'
      ? 'Start building your pet travel plan.'
      : 'Log in to continue your PawVago journey.';

  $('authSubmit').textContent =
    mode === 'signup'
      ? 'Create account'
      : 'Log in';

  const switchButton =
    $('switchAuth')?.querySelector('button');

  if (switchButton) {

    switchButton.textContent =
      mode === 'signup'
        ? 'Log in'
        : 'Create account';

  }

  if ($('switchAuth')) {

    $('switchAuth').firstChild.textContent =
      mode === 'signup'
        ? 'Already have an account? '
        : "Don't have an account? ";

  }

  $('authNotice').textContent = '';
  $('authNotice').className = 'notice';

  $('authModal').classList.remove('hidden');
}


function closeAuth() {
  $('authModal')?.classList.add('hidden');
}


/* =========================================================
   PET
========================================================= */

function openPet() {

  if (!user) {
    auth('login');
    return;
  }

  if (pet) {

    $('petName').value =
      pet.name || '';

    $('species').value =
      pet.species || 'Dog';

    $('weight').value =
      pet.weight_kg ??
      pet.weight ??
      '';

    $('breed').value =
      pet.breed || '';

  } else {

    $('petName').value = '';
    $('species').value = 'Dog';
    $('weight').value = '';
    $('breed').value = '';

  }

  $('petModal').classList.remove('hidden');
}


function closePet() {
  $('petModal')?.classList.add('hidden');
}


async function savePet(event) {

  event.preventDefault();

  if (!sb || !user?.id) {

    showPetError(
      'Please log in before saving your pet.'
    );

    return;
  }

  const petData = {

    user_id: user.id,

    name:
      $('petName').value.trim(),

    species:
      $('species').value,

    weight_kg:
      Number($('weight').value),

    breed:
      $('breed').value.trim()

  };

  let result;

  if (pet?.id) {

    result = await sb
      .from('pets')
      .update(petData)
      .eq('id', pet.id)
      .eq('user_id', user.id)
      .select()
      .single();

  } else {

    result = await sb
      .from('pets')
      .insert(petData)
      .select()
      .single();

  }

  if (result.error) {

    console.error(
      'Pet save error:',
      result.error
    );

    showPetError(
      result.error.message
    );

    return;
  }

  pet = result.data;

  closePet();

  await loadUserData();

  render();
}


function showPetError(message) {

  const box =
    $('petModal')?.querySelector('.modal-box');

  if (!box) return;

  let notice =
    box.querySelector('.pv-error');

  if (!notice) {

    notice =
      document.createElement('div');

    notice.className =
      'notice error pv-error';

    box.appendChild(notice);

  }

  notice.textContent = message;
}


/* =========================================================
   TRIP MODAL
========================================================= */

function ensureTripModal() {

  if ($('tripModal')) return;

  const modal =
    document.createElement('div');

  modal.className =
    'modal hidden';

  modal.id =
    'tripModal';

  modal.innerHTML = `

    <div class="modal-box">

      <button
        class="close"
        id="closeTrip"
        type="button"
      >
        ×
      </button>

      <p class="eyebrow">
        TRIP PLANNER
      </p>

      <h2>
        Plan your pet journey
      </h2>

      <p>
        PawVago will use your saved pet profile,
        route, travel date and database rules
        to build your travel plan.
      </p>

      <form id="tripForm">

        <label>
          From
          <input
            id="tripFrom"
            required
            placeholder="e.g. Nantes, France"
          >
        </label>

        <label>
          To
          <input
            id="tripTo"
            required
            placeholder="e.g. Budapest, Hungary"
          >
        </label>

        <label>
          Travel date
          <input
            id="tripDate"
            type="date"
            required
            min="${todayISO()}"
          >
        </label>

        <button
          class="btn dark full"
          type="submit"
        >
          Analyze my trip
        </button>

      </form>

      <div
        class="notice"
        id="tripNotice"
      ></div>

    </div>

  `;

  document.body.appendChild(modal);

  $('closeTrip').onclick =
    closeTrip;

  $('tripForm').onsubmit =
    saveTrip;
}


function openTrip() {

  ensureTripModal();

  if (!user) {
    auth('login');
    return;
  }

  if (!pet) {
    openPet();
    return;
  }

  if (trip) {

    $('tripFrom').value =
      trip.from || '';

    $('tripTo').value =
      trip.to || '';

    $('tripDate').value =
      trip.date || '';

  } else {

    $('tripFrom').value = '';
    $('tripTo').value = '';
    $('tripDate').value = '';

  }

  $('tripModal').classList.remove('hidden');
}


function closeTrip() {
  $('tripModal')?.classList.add('hidden');
}


async function saveTrip(event) {

  event.preventDefault();

  if (!sb || !user?.id) {

    showTripError(
      'Please log in first.'
    );

    return;
  }

  if (!pet?.id) {

    showTripError(
      'Please save your pet profile first.'
    );

    return;
  }

  const from =
    $('tripFrom').value.trim();

  const to =
    $('tripTo').value.trim();

  const date =
    $('tripDate').value;

  if (!from || !to || !date) {

    showTripError(
      'Please complete all trip fields.'
    );

    return;
  }

  const originCountry =
    countryFromDestination(from) ||
    from;

  const destinationCountry =
    countryFromDestination(to) ||
    to;

  const data = {

    user_id:
      user.id,

    pet_id:
      pet.id,

    origin_country:
      originCountry,

    origin_city:
      from,

    destination_country:
      destinationCountry,

    destination_city:
      to,

    travel_date:
      date,

    status:
      'planned'

  };

  let result;

  if (trip?.id) {

    result = await sb
      .from('trips')
      .update(data)
      .eq('id', trip.id)
      .eq('user_id', user.id)
      .select()
      .single();

  } else {

    result = await sb
      .from('trips')
      .insert(data)
      .select()
      .single();

  }

  if (result.error) {

    console.error(
      'Trip save error:',
      result.error
    );

    showTripError(
      result.error.message
    );

    return;
  }

  trip = {

    ...result.data,

    from:
      from,

    to:
      to,

    date:
      date

  };

  await loadTravelData();

  closeTrip();

  render();
}


function showTripError(message) {

  const notice =
    $('tripNotice');

  if (!notice) return;

  notice.textContent =
    message;

  notice.className =
    'notice error';
}


/* =========================================================
   DATABASE
========================================================= */

async function loadUserData() {

  pet = null;
  trip = null;

  if (!sb || !user?.id) {
    return;
  }

  const petResult =
    await sb
      .from('pets')
      .select('*')
      .eq('user_id', user.id)
      .order(
        'created_at',
        { ascending: true }
      )
      .limit(1)
      .maybeSingle();

  if (petResult.error) {

    console.error(
      'Pet loading error:',
      petResult.error
    );

  } else {

    pet =
      petResult.data || null;

  }


  const tripResult =
    await sb
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order(
        'created_at',
        { ascending: false }
      )
      .limit(1)
      .maybeSingle();

  if (tripResult.error) {

    console.error(
      'Trip loading error:',
      tripResult.error
    );

  } else if (tripResult.data) {

    const t =
      tripResult.data;

    trip = {

      ...t,

      from:
        t.origin_city
          ? t.origin_city
          : t.origin_country,

      to:
        t.destination_city
          ? t.destination_city
          : t.destination_country,

      date:
        t.travel_date

    };

  }
}


async function loadTravelData() {

  airlineData = [];
  countryRuleData = [];
  serviceData = [];

  if (!sb || !trip) {
    return;
  }

  const destinationCountry =
    countryFromDestination(trip.to) ||
    trip.destination_country ||
    null;

  if (!destinationCountry) {
    return;
  }

  const destinationCode =
    countryCode(destinationCountry);

  /* AIRLINES + RULES */
  let airlineQuery = await sb
    .from('airlines')
    .select(`
      *,
      airline_rules(*)
    `);

  if (airlineQuery.error) {
    console.error('Airline loading error:', airlineQuery.error);
  } else {
    airlineData = (airlineQuery.data || [])
      .filter(a => a.active !== false && a.is_active !== false);
  }

  /* COUNTRY RULES
     First try the country code, then fall back to country name.
     This keeps the engine resilient if a deployment/database row
     uses one identifier but not the other. */
  let rulesResult = null;

  if (destinationCode) {
    rulesResult = await sb
      .from('country_rules')
      .select('*')
      .eq('country_code', destinationCode)
      .eq('is_active', true);
  }

  if (
    rulesResult?.error ||
    !rulesResult?.data?.length
  ) {
    rulesResult = await sb
      .from('country_rules')
      .select('*')
      .eq('country_name', destinationCountry)
      .eq('is_active', true);
  }

  if (rulesResult.error) {
    console.error('Country rules error:', rulesResult.error);
  } else {
    countryRuleData = rulesResult.data || [];
  }

  /* DESTINATION SERVICES */
  const servicesResult =
    await sb
      .from('service_providers')
      .select('*')
      .eq('country_name', destinationCountry)
      .eq('is_active', true)
      .limit(20);

  if (servicesResult.error) {
    console.error('Service loading error:', servicesResult.error);
  } else {
    serviceData = servicesResult.data || [];
  }
}

/* =========================================================
   AIRLINE ENGINE
========================================================= */

function getActiveRule(airline) {

  const rules =
    Array.isArray(
      airline.airline_rules
    )
      ? airline.airline_rules
      : [];

  const species =
    pet?.species ||
    'Dog';

  return (
    rules.find(
      r =>
        r.is_active !== false &&
        (
          !r.species ||
          r.species.toLowerCase() ===
          species.toLowerCase()
        )
    ) ||
    rules.find(
      r =>
        r.is_active !== false
    ) ||
    null
  );
}


function parseRestrictionList(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map(item => String(item || '').trim().toLowerCase())
      .filter(Boolean);
  }

  if (typeof value === 'object') {
    return Object.values(value)
      .flatMap(item => Array.isArray(item) ? item : [item])
      .map(item => String(item || '').trim().toLowerCase())
      .filter(Boolean);
  }

  return String(value)
    .split(/[,;|]/)
    .map(item => item.trim().toLowerCase())
    .filter(Boolean);
}

function breedRestrictionText(restrictions) {
  const items = parseRestrictionList(restrictions);
  return items.length ? items.join(', ') : '';
}

function breedIsRestricted(breed, restrictions) {
  const normalizedBreed = String(breed || '').trim().toLowerCase();
  if (!normalizedBreed) return false;

  const items = parseRestrictionList(restrictions);

  return items.some(item => {
    if (!item || item === '*' || item === 'all') return false;

    return (
      normalizedBreed === item ||
      normalizedBreed.includes(item) ||
      item.includes(normalizedBreed)
    );
  });
}

function airlineResult(airline, rule) {
  const weight = petWeight();
  const breed = String(pet?.breed || '').trim();

  if (!rule) {
    return {
      status: 'Rule not stored',
      cls: 'pv-warn',
      reason: 'PawVago does not yet have a current rule for this airline.'
    };
  }

  if (!rule.cabin_allowed) {
    return {
      status: 'Not compatible',
      cls: 'pv-bad',
      reason: 'This stored rule does not allow this pet type in the cabin.'
    };
  }

  if (!weight) {
    return {
      status: 'Check',
      cls: 'pv-warn',
      reason: 'Add your pet weight to calculate compatibility.'
    };
  }

  if (breedIsRestricted(breed, rule.breed_restrictions)) {
    return {
      status: 'Not compatible',
      cls: 'pv-bad',
      reason: `The stored airline rule lists restrictions that match this breed.`
    };
  }

  const maxCombined = Number(rule.max_combined_weight_kg ?? 0);
  const maxPet = Number(rule.max_pet_weight_kg ?? 0);

  if (maxPet > 0 && weight > maxPet) {
    return {
      status: 'Not compatible',
      cls: 'pv-bad',
      reason: `Pet weight is ${weight} kg, above the stored pet limit of ${maxPet} kg.`
    };
  }

  let status = 'Compatible';
  let cls = 'pv-ok';
  let reason = 'Your pet meets the stored cabin rule.';

  if (maxCombined > 0) {
    const remaining = maxCombined - weight;

    if (remaining < 0) {
      return {
        status: 'Not compatible',
        cls: 'pv-bad',
        reason: `Pet weight is ${weight} kg, above the stored combined limit of ${maxCombined} kg.`
      };
    }

    if (remaining === 0) {
      status = 'Conditional';
      cls = 'pv-warn';
      reason = 'The pet is exactly at the stored combined limit. The carrier must add no weight, so verify with the airline before booking.';
    } else {
      status = 'Conditional';
      cls = 'pv-warn';
      reason = `The pet is ${weight} kg. Up to ${remaining.toFixed(1)} kg remains for the carrier under the stored combined limit.`;
    }
  }

  if (rule.route_restrictions) {
    status = 'Conditional';
    cls = 'pv-warn';

    const restrictionText = breedRestrictionText(rule.route_restrictions);

    if (restrictionText) {
      reason += ` Route restrictions are stored (${restrictionText}); the exact itinerary must be verified.`;
    } else {
      reason += ' Route restrictions are stored; the exact itinerary must be verified.';
    }
  }

  const dimensions = [
    Number(rule.carrier_length_cm),
    Number(rule.carrier_width_cm),
    Number(rule.carrier_height_cm)
  ].every(Number.isFinite)
    ? `${rule.carrier_length_cm} × ${rule.carrier_width_cm} × ${rule.carrier_height_cm} cm`
    : '';

  return {
    status,
    cls,
    reason,
    dimensions,
    carrierType: rule.carrier_type || '',
    remainingKg: maxCombined > 0
      ? Math.max(0, maxCombined - weight)
      : null,
    reservationRequired: rule.requires_reservation === true
  };
}



/* =========================================================
   COUNTRY DOCUMENT ENGINE
========================================================= */

function humanizeRuleKey(key) {
  const labels = {
    rabies_waiting_days: 'Rabies waiting period',
    echinococcus_required: 'Echinococcus treatment',
    microchip_before_rabies: 'Microchip before rabies vaccination',
    eu_pet_passport_required: 'EU pet passport required',
    maximum_non_commercial_pets: 'Maximum non-commercial pets',
    primary_rabies_minimum_age_weeks: 'Minimum age for primary rabies vaccination'
  };
  if (labels[key]) return labels[key];
  return String(key || '').replaceAll('_', ' ').replace(/\b\w/g, char => char.toUpperCase());
}

function humanizeRuleValue(key, value) {
  if (typeof value === 'boolean') return value ? 'Required' : 'Not required';
  if (value === null || value === undefined || value === '') return 'Not specified';
  if (key === 'maximum_non_commercial_pets') return `Up to ${value} pets`;
  if (key === 'primary_rabies_minimum_age_weeks') return `${value} weeks`;
  return String(value);
}

function cleanRuleDescription(value) {
  return String(value || '')
    .replace(/\bnull\b\s*[×x]\s*\bnull\b\s*[×x]\s*\bnull\b/gi, 'airline-approved carrier dimensions')
    .replace(/\bnull\b/gi, 'not specified');
}

function buildDocuments() {
  if (!countryRuleData.length) {
    return [{
      title: 'Destination rules not loaded',
      detail: 'PawVago does not yet have a current database rule for this destination.'
    }];
  }

  const docs = [];
  const rule = countryRuleData[0];

  if (rule.requires_microchip) {
    docs.push({
      title: 'Microchip',
      detail: 'Required according to the stored destination rule.'
    });
  }

  if (rule.requires_rabies) {
    docs.push({
      title: 'Valid rabies vaccination',
      detail: rule.rabies_waiting_days
        ? `Primary vaccination must be valid for at least ${rule.rabies_waiting_days} days before travel.`
        : 'Required according to the stored destination rule.'
    });
  }

  if (rule.requires_eu_pet_passport) {
    docs.push({
      title: 'EU pet passport',
      detail: 'Required according to the stored destination rule.'
    });
  }

  if (rule.requires_health_certificate) {
    docs.push({
      title: 'Health certificate',
      detail: 'Required according to the stored destination rule.'
    });
  }

  if (rule.requires_rabies_titre) {
    docs.push({
      title: 'Rabies antibody titre',
      detail: rule.titre_waiting_days
        ? `Waiting period: ${rule.titre_waiting_days} days.`
        : 'Required according to the stored destination rule.'
    });
  }

  if (rule.requires_deworming) {
    docs.push({
      title: 'Echinococcus treatment',
      detail: `Treatment window: ${rule.deworming_min_hours || '?'}–${rule.deworming_max_hours || '?'} hours before entry.`
    });
  }

  if (rule.additional_requirements && typeof rule.additional_requirements === 'object') {
    for (const [key, value] of Object.entries(rule.additional_requirements)) {
      docs.push({
        title: humanizeRuleKey(key),
        detail: humanizeRuleValue(key, value)
      });
    }
  }

  if (!docs.length) {
    docs.push({
      title: 'Destination rule found',
      detail: 'The destination has a current database rule. No additional document requirements are stored.'
    });
  }

  return docs;
}


/* =========================================================
   TIMELINE
========================================================= */

function buildTimeline() {

  if (!trip?.date) {
    return [];
  }

  const result = [];

  const travel =
    trip.date;

  result.push({

    date:
      travel,

    title:
      'Travel day',

    detail:
      'Your planned travel date.'

  });


  const rule =
    countryRuleData[0];

  if (
    rule?.requires_rabies &&
    rule?.rabies_waiting_days
  ) {

    result.push({

      date:
        addDays(
          travel,
          -Number(
            rule.rabies_waiting_days
          )
        ),

      title:
        'Rabies timing checkpoint',

      detail:
        `The stored destination rule specifies a ${rule.rabies_waiting_days}-day waiting period.`

    });

  }


  if (
    rule?.requires_deworming &&
    rule?.deworming_max_hours
  ) {

    const days =
      Math.ceil(
        Number(
          rule.deworming_max_hours
        ) / 24
      );

    result.push({

      date:
        addDays(
          travel,
          -days
        ),

      title:
        'Deworming treatment window',

      detail:
        `Treatment must fall within the stored ${rule.deworming_min_hours || '?'}–${rule.deworming_max_hours} hour window before entry.`

    });

  }


  result.push({

    date:
      addDays(
        travel,
        -7
      ),

    title:
      'Airline booking check',

    detail:
      'Confirm pet space, operating carrier and route acceptance before travel.'

  });


  return result
    .sort(
      (a, b) =>
        a.date.localeCompare(
          b.date
        )
    );

}


/* =========================================================
   SERVICES
========================================================= */

function renderServices() {

  if (!serviceData.length) {

    return `

      <div class="pv-empty">

        No destination services are stored yet.

        <div class="pv-muted">
          PawVago will show verified vets,
          pet sitters, pet taxis, hotels and shops
          here when they are available in the database.
        </div>

      </div>

    `;

  }

  return `

    <div class="pv-grid">

      ${serviceData
        .slice(0, 12)
        .map(service => `

          <div class="pv-service">

            <h4>
              ${escapeHtml(
                service.name
              )}
            </h4>

            <div class="pv-pill">
              ${escapeHtml(
                service.category ||
                'Pet service'
              )}
            </div>

            ${
              service.city_name
                ? `
                  <p class="pv-muted">
                    ${escapeHtml(
                      service.city_name
                    )}
                  </p>
                `
                : ''
            }

            ${
              service.address
                ? `
                  <p class="pv-muted">
                    ${escapeHtml(
                      service.address
                    )}
                  </p>
                `
                : ''
            }

            ${
              service.phone
                ? `
                  <p>
                    ${escapeHtml(
                      service.phone
                    )}
                  </p>
                `
                : ''
            }

            ${
              service.website_url
                ? `
                  <a
                    href="${escapeHtml(
                      service.website_url
                    )}"
                    target="_blank"
                    rel="noopener"
                  >
                    Website →
                  </a>
                `
                : ''
            }

            ${
              service.is_verified
                ? `
                  <span class="pv-pill pv-ok">
                    Verified
                  </span>
                `
                : ''
            }

          </div>

        `)
        .join('')}

    </div>

  `;
}


/* =========================================================
   TRIP ENGINE RENDER
========================================================= */

function renderEngine() {

  if (!trip) {
    return '';
  }

  const destination =
    countryFromDestination(
      trip.to
    ) ||
    trip.destination_country ||
    trip.to;


  /* AIRLINE CARDS */

  let airlineCards = '';

  if (!airlineData.length) {
    airlineCards = `
      <div class="pv-empty">
        No airline data is available yet.
        <div class="pv-muted">
          PawVago will calculate airline compatibility after airline rules are stored in the database.
        </div>
      </div>
    `;
  } else {
    const evaluatedAirlines = airlineData.map(airline => {
      const rule = getActiveRule(airline);
      return {
        airline,
        rule,
        result: airlineResult(airline, rule)
      };
    });

    const compatibleCount = evaluatedAirlines.filter(item =>
      item.result.status === 'Compatible' || item.result.status === 'Conditional'
    ).length;

    airlineCards = `
      <div style="margin-bottom:12px" class="pv-muted">
        ${compatibleCount} airline option${compatibleCount === 1 ? '' : 's'} found from stored rules.
        Results are based on your saved pet profile and route data; live seat availability is not checked.
      </div>

      ${evaluatedAirlines
        .map(({ airline, rule, result }) => `
          <div class="pv-airline">
            <strong>${escapeHtml(airline.name)}</strong>
            <br>

            <span class="pv-pill ${result.cls}">
              ${escapeHtml(result.status)}
            </span>

            <p>${escapeHtml(result.reason)}</p>

            ${result.dimensions
              ? `
                <div class="pv-muted">
                  Carrier size:
                  ${escapeHtml(result.dimensions)}
                </div>
              `
              : ''}

            ${result.carrierType
              ? `
                <div class="pv-muted">
                  Carrier type:
                  ${escapeHtml(result.carrierType)}
                </div>
              `
              : ''}

            ${result.reservationRequired
              ? `
                <div class="pv-muted">
                  Reservation required: yes
                </div>
              `
              : ''}

            ${rule?.breed_restrictions
              ? `
                <div class="pv-muted">
                  Breed restrictions stored: ${escapeHtml(breedRestrictionText(rule.breed_restrictions))}
                </div>
              `
              : ''}

            ${rule?.route_restrictions
              ? `
                <div class="pv-muted">
                  Route restrictions stored — itinerary verification required.
                </div>
              `
              : ''}

            ${rule?.rule_description
              ? `
                <div class="pv-muted">
                  ${escapeHtml(cleanRuleDescription(rule.rule_description))}
                </div>
              `
              : ''}

            ${rule?.source_url
              ? `
                <div style="margin-top:8px">
                  <a
                    href="${escapeHtml(rule.source_url)}"
                    target="_blank"
                    rel="noopener"
                  >
                    Official source →
                  </a>
                </div>
              `
              : ''}
          </div>
        `)
        .join('')}
    `;
  }



  /* DOCUMENTS */

  const documents =
    buildDocuments();

  const documentRows =
    documents
      .map(doc => `

        <div class="pv-row">

          <span
            class="pv-icon pv-warn"
          >
            ○
          </span>

          <div>

            <strong>
              ${escapeHtml(
                doc.title
              )}
            </strong>

            <div class="pv-muted">
              ${escapeHtml(
                doc.detail
              )}
            </div>

          </div>

        </div>

      `)
      .join('');


  /* TIMELINE */

  const timeline =
    buildTimeline();

  const timelineRows =
    timeline
      .map(item => `

        <div
          class="pv-timeline-item"
        >

          <strong>
            ${fmtDate(
              item.date
            )}
            —
            ${escapeHtml(
              item.title
            )}
          </strong>

          <span class="pv-muted">
            ${escapeHtml(
              item.detail
            )}
          </span>

        </div>

      `)
      .join('');


  const weight =
    petWeight();


  return `

    <div class="pv-engine">

      <div class="pv-card">

        <h3>
          Route intelligence
        </h3>

        <p>

          <strong>
            ${escapeHtml(
              trip.from
            )}
          </strong>

          →

          <strong>
            ${escapeHtml(
              trip.to
            )}
          </strong>

        </p>

        <p class="pv-muted">

          Travel date:
          ${escapeHtml(
            fmtDate(
              trip.date
            )
          )}

        </p>

        <p class="pv-muted">

          Destination detected:
          ${escapeHtml(
            destination
          )}

        </p>

      </div>


      <div class="pv-card">

        <h3>
          Airlines matching your pet
        </h3>

        <div class="pv-summary">
          <div class="pv-summary-item">
            <strong>${airlineData.length}</strong>
            <span>Stored airline rules</span>
          </div>
          <div class="pv-summary-item">
            <strong>${airlineData.filter(a => {
              const r = getActiveRule(a);
              return airlineResult(a, r).status === 'Compatible';
            }).length}</strong>
            <span>Compatible</span>
          </div>
          <div class="pv-summary-item">
            <strong>${airlineData.filter(a => {
              const r = getActiveRule(a);
              return airlineResult(a, r).status === 'Conditional';
            }).length}</strong>
            <span>Needs verification</span>
          </div>
        </div>

        <p class="pv-muted">

          Based on
          ${escapeHtml(
            pet?.name ||
            'your pet'
          )}

          ${
            weight
              ? `(${weight} kg)`
              : ''
          }.

          PawVago checks stored airline
          rules. This is not live flight
          or seat availability.

        </p>

        <div class="pv-grid">

          ${airlineCards}

        </div>

      </div>


      <div class="pv-card">

        <h3>
          Documents PawVago expects
        </h3>

        <p class="pv-muted">

          Requirements come from the
          PawVago destination-rules database.

        </p>

        ${documentRows}

      </div>


      <div class="pv-card">

        <h3>
          Smart timeline
        </h3>

        ${
          timelineRows
            ? `
              <div class="pv-timeline">
                ${timelineRows}
              </div>
            `
            : `
              <div class="pv-empty">
                No timeline rules are stored yet.
              </div>
            `
        }

      </div>


      <div class="pv-card">

        <h3>
          Destination services
        </h3>

        <p class="pv-muted">

          Vets, pet sitters, pet taxis,
          hotels and shops stored for this
          destination.

        </p>

        ${renderServices()}

      </div>


      <div class="pv-card">

        <h3>
          PawVago data status
        </h3>

        <p class="pv-disclaimer">

          Airline rules, destination rules and
          service providers are database-driven.
          PawVago should verify the applicable
          official rules and operating carrier
          before a booking or international journey.

        </p>

      </div>

    </div>

  `;

}


/* =========================================================
   DASHBOARD
========================================================= */

function render() {

  const content =
    $('dashboardContent');

  if (!content) return;


  if (!user) {

    content.innerHTML = `

      <div class="empty">

        <h2>
          Your PawVago dashboard
        </h2>

        <p>
          Create an account to continue.
        </p>

        <button
          class="btn dark"
          id="dlogin"
        >
          Log in
        </button>

      </div>

    `;

    $('dlogin').onclick =
      () => auth('login');

    return;
  }


  content.innerHTML = `

    <div class="dash-card">

      <h2>
        Welcome to PawVago
      </h2>

      <p>
        ${escapeHtml(
          user.email || ''
        )}
      </p>

    </div>


    <div class="dash-card">

      <h2>
        Pet profile
      </h2>

      ${
        pet

          ? `

            <p>

              <b>
                ${escapeHtml(
                  pet.name
                )}
              </b>

              ·

              ${escapeHtml(
                pet.species
              )}

              ·

              ${escapeHtml(
                pet.weight_kg ??
                pet.weight ??
                ''
              )}

              kg

              ${
                pet.breed
                  ? `
                    ·
                    ${escapeHtml(
                      pet.breed
                    )}
                  `
                  : ''
              }

            </p>

            <button
              class="btn"
              id="edit"
            >
              Edit profile
            </button>

          `

          : `

            <div class="empty">

              <p>
                Add your pet before planning a trip.
              </p>

              <button
                class="btn dark"
                id="add"
              >
                Add pet profile
              </button>

            </div>

          `
      }

    </div>


    <div class="dash-card">

      <h2>
        Trip intelligence
      </h2>

      ${
        trip

          ? `

            <p>

              <strong>
                ${escapeHtml(
                  trip.from
                )}

                →

                ${escapeHtml(
                  trip.to
                )}
              </strong>

              ·

              ${fmtDate(
                trip.date
              )}

            </p>

            ${renderEngine()}

            <button
              class="btn outline"
              id="editTrip"
            >
              Change trip
            </button>

          `

          : `

            <div class="empty">

              <p>
                Tell PawVago where and when
                you are travelling. The app will
                generate airline compatibility,
                documents, rules and destination
                services from the database.
              </p>

              <button
                class="btn dark"
                id="trip"
              >
                Analyze my trip
              </button>

            </div>

          `
      }

    </div>

  `;


  $('add')?.addEventListener(
    'click',
    openPet
  );

  $('edit')?.addEventListener(
    'click',
    openPet
  );

  $('trip')?.addEventListener(
    'click',
    openTrip
  );

  $('editTrip')?.addEventListener(
    'click',
    openTrip
  );

}


/* =========================================================
   AUTH SUBMIT
========================================================= */

async function submitAuth(event) {

  event.preventDefault();

  if (!sb) {

    $('authNotice').textContent =
      'Supabase is not configured.';

    $('authNotice').className =
      'notice error';

    return;
  }

  const email =
    $('email').value.trim();

  const password =
    $('password').value;


  let result;


  if (mode === 'signup') {

    result =
      await sb.auth.signUp({
        email,
        password
      });

  } else {

    result =
      await sb.auth.signInWithPassword({
        email,
        password
      });

  }


  if (result.error) {

    console.error(
      'Authentication error:',
      result.error
    );

    $('authNotice').textContent =
      result.error.message;

    $('authNotice').className =
      'notice error';

    return;
  }


  user =
    result.data.user ||
    result.data.session?.user ||
    null;


  if (
    mode === 'signup' &&
    !result.data.session
  ) {

    $('authNotice').textContent =
      'Account created. Please check your email to confirm your account, then log in.';

    $('authNotice').className =
      'notice';

    return;
  }


  await loadUserData();

  await loadTravelData();

  closeAuth();

  await refresh();

  show('dashboard');
}


/* =========================================================
   REFRESH AUTH UI
========================================================= */

async function refresh() {

  if (sb) {

    const sessionResult =
      await sb.auth.getSession();

    user =
      sessionResult.data.session?.user ||
      null;

  }


  if (user) {

    await loadUserData();

    await loadTravelData();

  }


  const actions =
    $('authActions');

  if (!actions) return;


  actions.innerHTML =

    user

      ? `

        <button
          class="btn dark"
          id="dashBtn"
        >
          Dashboard
        </button>

      `

      : `

        <button
          class="btn ghost"
          id="loginBtn"
        >
          Log in
        </button>

        <button
          class="btn dark"
          id="signupBtn"
        >
          Create account
        </button>

      `;


  $('loginBtn')?.addEventListener(
    'click',
    () => auth('login')
  );

  $('signupBtn')?.addEventListener(
    'click',
    () => auth('signup')
  );

  $('dashBtn')?.addEventListener(
    'click',
    () => show('dashboard')
  );


  if (
    $('dashboardView')?.classList.contains(
      'active'
    )
  ) {

    render();

  }

}


/* =========================================================
   VIEW NAVIGATION
========================================================= */

function show(view) {

  document
    .querySelectorAll('.view')
    .forEach(element => {

      element.classList.remove(
        'active'
      );

    });


  const target =
    $(view + 'View');

  if (target) {

    target.classList.add(
      'active'
    );

  }


  if (view === 'dashboard') {

    render();

  }


  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}


/* =========================================================
   STATIC EVENTS
========================================================= */

function bindStaticEvents() {

  ensureStyles();

  ensureTripModal();


  $('loginBtn')?.addEventListener(
    'click',
    () => auth('login')
  );


  $('signupBtn')?.addEventListener(
    'click',
    () => auth('signup')
  );


  $('heroSignup')?.addEventListener(
    'click',
    () => auth('signup')
  );


  $('ctaSignup')?.addEventListener(
    'click',
    () => auth('signup')
  );


  $('heroDemo')?.addEventListener(
    'click',
    () => {

      $('features')?.scrollIntoView({
        behavior: 'smooth'
      });

    }
  );


  $('closeModal')?.addEventListener(
    'click',
    closeAuth
  );


  $('closePet')?.addEventListener(
    'click',
    closePet
  );


  $('authForm')?.addEventListener(
    'submit',
    submitAuth
  );


  $('petForm')?.addEventListener(
    'submit',
    savePet
  );


  $('switchAuth')?.querySelector(
    'button'
  )?.addEventListener(
    'click',
    () => {

      auth(
        mode === 'signup'
          ? 'login'
          : 'signup'
      );

    }
  );


  $('logoutBtn')?.addEventListener(
    'click',
    async () => {

      if (sb) {

        await sb.auth.signOut();

      }

      user = null;
      pet = null;
      trip = null;

      airlineData = [];
      countryRuleData = [];
      serviceData = [];

      await refresh();

      show('home');

    }
  );


  document
    .querySelectorAll(
      '[data-view]'
    )
    .forEach(link => {

      link.addEventListener(
        'click',
        event => {

          event.preventDefault();

          show(
            link.dataset.view
          );

        }
      );

    });


  if (sb) {

    sb.auth.onAuthStateChange(
      async (_event, session) => {

        user =
          session?.user ||
          null;

        if (user) {

          await loadUserData();

          await loadTravelData();

        } else {

          pet = null;
          trip = null;

        }

        await refresh();

      }
    );

  }

}


/* =========================================================
   START
========================================================= */

ensureStyles();

bindStaticEvents();

refresh();