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
let tripEditingId = null;
let pendingTrip = false;

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

    .pv-grid:has(> .pv-cabin-card) { grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr)); }
    .pv-cabin-card { min-width:0; }
    .pv-cabin-card dl { margin:14px 0; }
    .pv-cabin-fact { border-bottom:1px solid #e5e7eb; padding:10px 0; }
    .pv-cabin-fact dt { font-size:.8rem; color:#475569; }
    .pv-cabin-fact dd { margin:5px 0 0; font-weight:650; line-height:1.6; }
    .pv-cabin-card details { margin:12px 0; }
    #pvCarrierPanel { scroll-margin-top:100px; }
    #pvCarrierForm input:not([type=checkbox]), #pvCarrierForm select, .pv-cabin-card select { display:block; width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:10px; margin-top:6px; }
    #pvCarrierForm label { font-size:.85rem; }
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

  if ($('switchAuth')) {
    $('switchAuth').textContent = mode === 'signup'
      ? 'Already have an account? Log in'
      : "Don't have an account? Create account";
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
  pendingTrip = false;
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

  const resumeTrip = pendingTrip;
  closePet();
  pendingTrip = resumeTrip;

  await loadUserData();

  render();
  if (pendingTrip) openTrip();
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


function openTrip(editExisting = false) {

  pendingTrip = true;

  ensureTripModal();

  if (!user) {
    auth('login');
    return;
  }

  if (!pet) {
    openPet();
    return;
  }

  pendingTrip = false;
  tripEditingId = editExisting ? trip?.id || null : null;
  $('tripNotice').textContent = '';
  $('tripNotice').className = 'notice';

  if (editExisting && trip) {

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

  if (tripEditingId) {

    result = await sb
      .from('trips')
      .update(data)
      .eq('id', tripEditingId)
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

  /* Official-source snapshot is authoritative for supported EU/GB scenarios.
     Legacy Supabase airline rows may be outdated; do not silently use stale
     weight/dimension values in a travel eligibility decision. */
  try {
    const response = await fetch('/data/pet-policy-snapshot.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Official policy reference not available');
    const policy = await response.json();
    if (!Array.isArray(policy.airlines) || !Array.isArray(policy.countries)) {
      throw new Error('Invalid official policy reference');
    }
    // Include every airline in the snapshot; only reviewed rules can be screened.
    airlineData = policy.airlines.map(a => ({
      id: a.id,
      region: a.region,
      name: a.name,
      notes: a.notes,
      notes_fa: a.notes_fa,
      reviewed_on: a.reviewed_on || policy.reviewed_on,
      policy_status: a.policy_status,
      hold_policy: a.policy_status === "reviewed" ? (a.hold || null) : null,
      restricted_breeds: policy.brachycephalic_breeds || {},
      is_active: true,
      airline_rules: a.policy_status !== "reviewed" ? [] : [{
        is_active: true,
        cabin_allowed: a.cabin_allowed === true,
        max_combined_weight_kg: a.cabin_max_kg,
        max_pet_weight_kg: a.cabin_pet_max_kg,
        cabin_snub_max_kg: a.cabin_snub_max_kg,
        cabin_snub_nosed_allowed: a.cabin_snub_nosed_allowed,
        carrier_variants: a.cabin_dimension_variants || [],
        carrier_max_linear_cm: a.cabin_max_linear_cm,
        soft_carrier_required: a.soft_carrier === true,
        no_numeric_weight_limit: a.cabin_weight_policy === 'carrier_fit_only',
        carrier_length_cm: a.dimensions_cm?.[0] ?? null,
        carrier_width_cm: a.dimensions_cm?.[1] ?? null,
        carrier_height_cm: a.dimensions_cm?.[2] ?? null,
        carrier_type: a.soft_carrier ? 'Soft-sided carrier' : '',
        requires_reservation: a.reservation_required,
        route_restrictions: 'Exact flight, operating carrier and pet-space acceptance must be confirmed',
        rule_description: 'Official-source policy snapshot reviewed ' + (a.reviewed_on || policy.reviewed_on) +
          '. This does not confirm flight availability, route acceptance or booking.',
        source_url: a.source
      }]
    }));

    const routeScope = window.PawVagoRouteScope?.scope(airlineData,
      trip.origin_country || trip.from, trip.destination_country || trip.to);
    if (routeScope?.filtered) airlineData = routeScope.airlines;

    const originCountry = countryFromDestination(trip.from) ||
      trip.origin_country || null;
    const originCode = countryCode(originCountry);
    const origin = policy.countries.find(c => c.code === originCode);
    const destination = policy.countries.find(c => c.code === destinationCode);
    const validIntraEurope = !!origin && !!destination &&
      (origin.region === 'EU' || origin.region === 'EU-associated') &&
      (destination.region === 'EU' || destination.region === 'EU-associated');
    const validGbArrival = !!origin && !!destination &&
      (origin.region === 'EU' || origin.region === 'EU-associated') &&
      destination.region === 'GB';

    if (validIntraEurope || validGbArrival) {
      const dog = String(pet?.species || 'Dog').toLowerCase() === 'dog';
      countryRuleData = [{
        is_active: true,
        country_code: destinationCode,
        country_name: destination.name,
        requires_microchip: true,
        requires_rabies: true,
        rabies_waiting_days: 21,
        requires_eu_pet_passport: true,
        requires_health_certificate: false,
        requires_rabies_titre: false,
        requires_deworming: dog && !!destination.dog_tapeworm_hours,
        deworming_min_hours: destination.dog_tapeworm_hours?.[0] ?? null,
        deworming_max_hours: destination.dog_tapeworm_hours?.[1] ?? null,
        source_url: validGbArrival ? policy.official_sources.gb : policy.official_sources.eu,
        notes: 'Reviewed ' + policy.reviewed_on + '; confirm exceptions and applicable transit/route restrictions.'
      }];
    } else {
      // Unknown/non-EU corridor: no generalised compliance determination.
      countryRuleData = [];
    }
  } catch (error) {
    console.error('Source-reviewed pet rules unavailable:', error);
    airlineData = [];
    countryRuleData = [];
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

// Weight/size screening is separate from flight availability and border approval.
let cabinCarrier = { kg: '', length: '', width: '', height: '', type: 'soft', comfortable: false };
let cabinCarrierOwner = '';
const cabinAircraft = new Map();
const cabinText = (en, fa) => document.documentElement.lang === 'fa' ? fa : en;
const cabinNum = value => Number(value).toLocaleString(document.documentElement.lang === 'fa' ? 'fa-IR' : 'en', { maximumFractionDigits: 2 });
const cabinDims = dimensions => dimensions.map(cabinNum).join(' × ') + ' ' + cabinText('cm', 'سانتی‌متر');

function readCabinCarrier() {
  const owner = `${user?.id || ''}:${pet?.id || ''}`;
  if (owner === cabinCarrierOwner) return;
  cabinCarrierOwner = owner;
  cabinCarrier = { kg: '', length: '', width: '', height: '', type: 'soft', comfortable: false };
  cabinAircraft.clear();
  try {
    const stored = JSON.parse(localStorage.getItem('pv-cabin-carrier:' + owner) || 'null');
    if (stored && typeof stored === 'object') Object.assign(cabinCarrier, stored);
  } catch (_) {}
}

function renderCabinCarrier() {
  readCabinCarrier();
  const field = (key, en, fa, unit) => `<label>${cabinText(en, fa)} (${unit})<input name="${key}" type="number" min="0.01" max="${key === 'kg' ? 100 : 300}" step="0.01" value="${escapeHtml(cabinCarrier[key])}" required></label>`;
  return `<section class="pv-card" id="pvCarrierPanel"><h3>${cabinText('Check your cabin carrier', 'بررسی کیف کابین شما')}</h3>
    <p>${cabinText('Enter the empty carrier weight and its external dimensions. Results below compare your pet + carrier with each published limit.', 'وزن کیف خالی و ابعاد بیرونی آن را وارد کنید. کارت‌های زیر مجموع وزن حیوان و کیف و سایز آن را با حد مجاز هر ایرلاین مقایسه می‌کنند.')}</p>
    <form id="pvCarrierForm"><div class="pv-grid">
      ${field('kg', 'Empty carrier weight', 'وزن کیف خالی', cabinText('kg', 'کیلوگرم'))}
      ${field('length', 'Length', 'طول', cabinText('cm', 'سانتی‌متر'))}
      ${field('width', 'Width', 'عرض', cabinText('cm', 'سانتی‌متر'))}
      ${field('height', 'Height', 'ارتفاع', cabinText('cm', 'سانتی‌متر'))}
      <label>${cabinText('Carrier type', 'نوع کیف')}<select name="type"><option value="soft" ${cabinCarrier.type === 'soft' ? 'selected' : ''}>${cabinText('Soft-sided', 'نرم و انعطاف‌پذیر')}</option><option value="hard" ${cabinCarrier.type === 'hard' ? 'selected' : ''}>${cabinText('Rigid', 'سخت')}</option></select></label>
    </div><label style="display:flex;align-items:center;gap:8px;margin:14px 0"><input name="comfortable" type="checkbox" style="width:auto" ${cabinCarrier.comfortable ? 'checked' : ''}>${cabinText('My pet can stand, turn and lie down naturally inside the closed carrier.', 'حیوانم داخل کیف بسته می‌تواند طبیعی بایستد، بچرخد و دراز بکشد.')}</label>
    <button class="btn dark" type="submit">${cabinText('Check weight and size', 'بررسی وزن و سایز')}</button>
    <p class="pv-muted">${cabinText('Carrier details are saved on this device for this pet. A green result confirms only the listed weight/size checks, not a reserved pet space.', 'مشخصات کیف برای این حیوان روی همین دستگاه ذخیره می‌شود. نتیجهٔ سبز فقط تطابق وزن و سایز درج‌شده را نشان می‌دهد؛ به معنی رزرو جای حیوان نیست.')}</p></form></section>`;
}

function bindCabinControls() {
  $('pvCarrierForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    for (const key of ['kg','length','width','height']) cabinCarrier[key] = form.elements.namedItem(key).value;
    cabinCarrier.type = form.elements.namedItem('type').value;
    cabinCarrier.comfortable = form.elements.namedItem('comfortable').checked;
    try { localStorage.setItem('pv-cabin-carrier:' + cabinCarrierOwner, JSON.stringify(cabinCarrier)); } catch (_) {}
    render();
    $('pvCarrierPanel')?.scrollIntoView({ block: 'start' });
  });
  document.querySelectorAll('[data-cabin-aircraft]').forEach(select => select.addEventListener('change', () => {
    cabinAircraft.set(select.dataset.cabinAircraft, select.value);
    const id = select.closest('[data-cabin-card]')?.id;
    render();
    if (id) $(id)?.scrollIntoView({block:'center'});
  }));
}

function cabinVariants(rule) {
  return (rule?.carrier_variants || []).filter(v => Array.isArray(v.dimensions_cm) && v.dimensions_cm.length === 3 && v.dimensions_cm.every(n => Number(n) > 0));
}

function airlineResult(airline, rule) {
  const result = (status, cls, reason) => ({ status, cls, reason });
  const fail = (en, fa) => result('Not compatible', 'pv-bad', cabinText(en, fa));
  const wait = (en, fa) => result('Check', 'pv-warn', cabinText(en, fa));
  if (!rule) return wait('Policy not verified.', 'قوانین این ایرلاین تأیید نشده است.');
  if (!rule.cabin_allowed) return fail('Ordinary pets are not accepted in the cabin.', 'حیوان خانگی معمولی در کابین پذیرفته نمی‌شود.');
  if (!['dog','cat'].includes(String(pet?.species || '').toLowerCase())) return wait('This policy covers dogs and cats only.', 'این قوانین فقط برای سگ و گربه بررسی شده است.');
  const dest = String(trip?.destination_country || trip?.to || '').trim().toLowerCase();
  if (['united kingdom','great britain','uk','england','scotland','wales','london'].includes(dest)) return fail('Ordinary cabin pets are not accepted on standard commercial arrivals in Great Britain.', 'در پرواز تجاری معمول ورودی بریتانیای کبیر، حیوان خانگی معمولی در کابین پذیرفته نمی‌شود.');
  const weight = petWeight();
  if (!(weight > 0)) return wait('Pet weight is missing.', 'وزن حیوان وارد نشده است.');
  const breed = String(pet?.breed || '').toLowerCase().replace(/[-_]/g, ' ');
  const snub = (airline.restricted_breeds?.[String(pet?.species || '').toLowerCase()] || []).some(b => breed.includes(String(b).toLowerCase().replace(/-/g, ' ')));
  if (breedIsRestricted(breed, rule.breed_restrictions) || (snub && rule.cabin_snub_nosed_allowed === false)) return fail('This breed is excluded from the published cabin policy.', 'این نژاد طبق قوانین منتشرشده در کابین پذیرفته نمی‌شود.');
  const max = snub && Number(rule.cabin_snub_max_kg) > 0 ? Number(rule.cabin_snub_max_kg) : Number(rule.max_combined_weight_kg);
  const petMax = Number(rule.max_pet_weight_kg);
  if (petMax > 0 && weight > petMax) return fail('Pet weight exceeds the pet-only limit.', 'وزن خود حیوان از سقف مجاز بیشتر است.');
  if (max > 0 && weight >= max) return fail(`The pet alone is ${cabinNum(weight)} kg; the ${cabinNum(max)} kg limit also includes the carrier.`, `وزن خود حیوان ${cabinNum(weight)} کیلوگرم است؛ سقف ${cabinNum(max)} کیلوگرمی شامل وزن کیف هم می‌شود.`);
  const bag = Number(cabinCarrier.kg);
  if (max > 0 && bag > 0 && weight + bag > max + 1e-8) return fail('Pet + carrier exceeds the combined weight limit.', 'مجموع وزن حیوان و کیف بیشتر از حد مجاز است.');
  const variants = cabinVariants(rule);
  const selection = cabinAircraft.get(airline.id || airline.name);
  const variant = selection !== undefined && selection !== '' ? variants[Number(selection)] : null;
  const limits = variant?.dimensions_cm || [rule.carrier_length_cm,rule.carrier_width_cm,rule.carrier_height_cm];
  const own = [cabinCarrier.length,cabinCarrier.width,cabinCarrier.height].map(Number);
  const ownKnown = own.every(n => n > 0);
  const linear = Number(rule.carrier_max_linear_cm);
  if (ownKnown && linear > 0 && own.reduce((a,b)=>a+b,0) > linear) return fail('The sum of carrier dimensions exceeds the published limit.', 'مجموع طول، عرض و ارتفاع کیف از حد مجاز بیشتر است.');
  const fits = dims => own[2] <= dims[2] && ((own[0] <= dims[0] && own[1] <= dims[1]) || (own[0] <= dims[1] && own[1] <= dims[0]));
  if (ownKnown && (variant || !variants.length) && limits.every(n=>Number(n)>0) && !fits(limits)) return fail('Your carrier exceeds the published dimensions.', 'ابعاد کیف شما بیشتر از سایز مجاز است.');
  if (ownKnown && variants.length && !variant && !variants.some(v=>fits(v.dimensions_cm))) return fail('Your carrier exceeds every published aircraft/cabin variant.', 'ابعاد کیف شما با هیچ‌یک از گزینه‌های منتشرشدهٔ هواپیما یا کلاس تطابق ندارد.');
  const requiredType = variant?.label === 'Hard carrier' ? 'hard' : (rule.soft_carrier_required ? 'soft' : null);
  if (requiredType && cabinCarrier.type !== requiredType) return fail('Your carrier type does not match the selected policy.', 'نوع کیف شما با قانون انتخاب‌شده مطابقت ندارد.');
  if (!(bag > 0) || !ownKnown) return wait('Published carrier limits are shown below. Personal carrier fit has not been checked.', 'حد مجاز وزن و ابعاد کیف در همین کارت درج شده است. تطابق کیف شخصی بررسی نشده است.');
  if (variants.length && !variant) return wait('Select the aircraft or cabin below to finish the size check.', 'برای تکمیل بررسی سایز، نوع هواپیما یا کلاس را در همین کارت انتخاب کنید.');
  if (!limits.every(n=>Number(n)>0) && !(linear > 0)) return wait('The official carrier dimensions have not been verified.', 'سایز مجاز کیف در منبع رسمی هنوز تأیید نشده است.');
  if (!(max > 0) && !rule.no_numeric_weight_limit) return wait('A current numeric weight limit has not been verified.', 'سقف وزن معتبر برای این ایرلاین هنوز تأیید نشده است.');
  if (!cabinCarrier.comfortable) return wait('Confirm that your pet can move naturally inside the closed carrier.', 'توانایی ایستادن، چرخیدن و درازکشیدن طبیعی حیوان داخل کیف بسته را بررسی و تأیید کنید.');
  return result('Compatible', 'pv-ok', cabinText('Weight and carrier size meet the listed limits. Flight/route approval and pet-space reservation are separate.', 'وزن و سایز کیف با حد مجاز درج‌شده تطابق دارد. پذیرش مسیر و رزرو جای حیوان جداگانه است.'));
}

function renderCabinAirline(airline, rule, result) {
  const key = airline.id || airline.name;
  const variants = cabinVariants(rule);
  const limits = [rule?.carrier_length_cm,rule?.carrier_width_cm,rule?.carrier_height_cm];
  const row = (en, fa, value) => `<div class="pv-cabin-fact"><dt>${cabinText(en,fa)}</dt><dd>${value}</dd></div>`;
  const kg = n => cabinNum(n) + ' ' + cabinText('kg','کیلوگرم');
  const dims = variants.length ? variants.map(v=>`<div>${escapeHtml(v.label)}: <bdi dir="ltr">${cabinDims(v.dimensions_cm)}</bdi></div>`).join('') : limits.every(v=>Number(v)>0) ? `<bdi dir="ltr">${cabinDims(limits)}</bdi>` : Number(rule?.carrier_max_linear_cm)>0 ? cabinText('L + W + H ≤ ', 'مجموع طول + عرض + ارتفاع ≤ ') + cabinNum(rule.carrier_max_linear_cm) + ' ' + cabinText('cm','سانتی‌متر') : cabinText('Not verified', 'تأیید نشده');
  const label = result.cls === 'pv-ok' ? cabinText('✓ Weight & size OK','✓ وزن و سایز مناسب') : result.cls === 'pv-bad' ? cabinText('✕ Not suitable for cabin','✕ نامناسب برای کابین') : cabinText('○ More information needed','○ نیاز به تکمیل اطلاعات');
  return `<article class="pv-airline pv-cabin-card" id="pv-airline-${escapeHtml(key.replace(/[^a-z0-9]/gi,'-'))}" data-cabin-card>
    <strong>${escapeHtml(airline.name)}</strong><div><span class="pv-pill ${result.cls}">${label}</span></div>
    <dl>${row('Pet + carrier maximum','حداکثر وزن حیوان + کیف', Number(rule?.max_combined_weight_kg)>0 ? kg(rule.max_combined_weight_kg) : rule?.no_numeric_weight_limit ? cabinText('No numeric cap published; carrier fit required','سقف عددی منتشر نشده؛ جاگیری طبیعی در کیف الزامی است') : cabinText('Not verified','تأیید نشده'))}
    ${Number(rule?.max_pet_weight_kg)>0 ? row('Pet-only maximum','حداکثر وزن خود حیوان',kg(rule.max_pet_weight_kg)) : ''}
    ${Number(rule?.cabin_snub_max_kg)>0 ? row('Short-nosed pet + carrier maximum','سقف مجموع وزن برای نژاد پوزه‌کوتاه',kg(rule.cabin_snub_max_kg)) : ''}
    ${row('Carrier limit · L × W × H','سایز مجاز کیف · طول × عرض × ارتفاع',dims)}
    ${row('Your pet + carrier','وزن حیوان شما + کیف',kg(petWeight()) + ' + ' + (Number(cabinCarrier.kg)>0 ? kg(cabinCarrier.kg) + ' = <b>' + kg(petWeight()+Number(cabinCarrier.kg)) + '</b>' : cabinText('carrier weight missing','وزن کیف وارد نشده')))}
    ${row('Your carrier dimensions','ابعاد کیف شما',[cabinCarrier.length,cabinCarrier.width,cabinCarrier.height].every(v=>Number(v)>0) ? `<bdi dir="ltr">${cabinDims([cabinCarrier.length,cabinCarrier.width,cabinCarrier.height])}</bdi>` : cabinText('Not entered','وارد نشده'))}
    ${row('Carrier type','نوع کیف',rule?.soft_carrier_required ? cabinText('Soft-sided','نرم و انعطاف‌پذیر') : cabinText('See policy details','طبق جزئیات قانون'))}</dl>
    ${variants.length ? `<label>${cabinText('Your aircraft / cabin','هواپیما / کلاس شما')}<select data-cabin-aircraft="${escapeHtml(key)}"><option value="">${cabinText('Select an option','انتخاب کنید')}</option>${variants.map((v,i)=>`<option value="${i}" ${String(cabinAircraft.get(key))===String(i)?'selected':''}>${escapeHtml(v.label)}</option>`).join('')}</select></label>` : ''}
    <p>${escapeHtml(result.reason)}</p>
    <details><summary>${cabinText('Route, breed and booking details','جزئیات مسیر، نژاد و رزرو')}</summary><p>${escapeHtml(cabinText(airline.notes || '',airline.notes_fa || airline.notes || ''))}</p></details>
    <p class="pv-muted">${cabinText('Flight route / pet space: not booked or verified','مسیر پرواز / ظرفیت حیوان: رزرو یا تأیید نشده')}</p>
    ${rule?.source_url ? `<a href="${escapeHtml(rule.source_url)}" target="_blank" rel="noopener noreferrer">${cabinText('Official policy','قوانین رسمی ایرلاین')} ↗</a>` : ''}
    <small style="display:block">${cabinText('Source reviewed: ','تاریخ بررسی منبع: ')}${escapeHtml(airline.reviewed_on || '—')}</small>
  </article>`;
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
  readCabinCarrier();

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

    const reviewed = evaluatedAirlines.filter(({airline}) => airline.policy_status === 'reviewed');
    const rank = {'Compatible':0, 'Check':1, 'Not compatible':2};
    reviewed.sort((a,b)=>(rank[a.result.status] ?? 1)-(rank[b.result.status] ?? 1));
    airlineCards = reviewed.map(({airline,rule,result})=>renderCabinAirline(airline,rule,result)).join('');
    const unknown = evaluatedAirlines.filter(({airline})=>airline.policy_status !== 'reviewed');
    if (unknown.length) airlineCards += `<details class="pv-unverified-carriers" style="grid-column:1/-1"><summary>${cabinText('Unverified airlines — no eligibility result','ایرلاین‌های بررسی‌نشده — بدون نتیجهٔ پذیرش')} (${unknown.length})</summary><div class="pv-grid">${unknown.map(({airline})=>`<div class="pv-airline"><strong>${escapeHtml(airline.name)}</strong><p>${cabinText('Policy not verified','قوانین تأیید نشده')}</p></div>`).join('')}</div></details>`;
  }




  /* Source-reviewed checked-hold comparison for signed-in dashboard.
     We cannot determine eligibility without crate weight, dimensions and
     approval by the operating airline, so never mark this as compatible. */
  const holdCards = airlineData.filter(a => a.policy_status === "reviewed").map(a => {
    const h = a.hold_policy;
    const br = String(pet?.breed || '').toLowerCase().replace(/[-_]/g, ' ');
    const breedList = (a.restricted_breeds?.[String(pet?.species || 'dog').toLowerCase()] || []);
    const snub = br && breedList.some(x => br.includes(String(x).toLowerCase().replace(/-/g, ' ')));
    const gbArrival = ['great britain','united kingdom','uk','england','scotland','wales','london']
      .includes(String(destination || '').trim().toLowerCase());
    const rejected = gbArrival || h?.allowed === false || (h?.snub_nosed_restricted === true && snub);
    const label = gbArrival
      ? 'GB arrival: air cargo normally required, not checked baggage'
      : h?.allowed === false ? 'Not offered by this airline'
      : h?.allowed !== true ? 'Hold eligibility requires individual confirmation'
      : snub && h.snub_nosed_restricted ? 'This short-nosed breed is not accepted in the hold'
      : 'Hold option listed — airline and crate verification required';
    const source = /^https:\/\/[^\s]+$/i.test(h?.source || '') ? h.source : '';
    return `<div class="pv-airline" style="min-width:0">
      <strong>${escapeHtml(a.name)}</strong>
      <p><span class="pv-pill ${rejected ? 'pv-bad' : 'pv-warn'}">${escapeHtml(label)}</span></p>
      <div class="pv-muted">Pet: ${escapeHtml(String(pet?.name || 'your pet'))}, ${escapeHtml(String(petWeight() || '?'))} kg;
      combined weight with rigid crate is not known.</div>
      <div class="pv-muted">Hold published maximum: ${h?.max_combined_kg ? escapeHtml(h.max_combined_kg) + ' kg including crate' : h?.allowed ? 'confirm with airline' : 'n/a'}</div>
      <div class="pv-muted">IATA-style rigid transport crate and breed / route acceptance must be confirmed.</div>
      ${source ? `<a href="${escapeHtml(source)}" target="_blank" rel="noopener noreferrer">Official checked-hold policy →</a>` : ''}
    </div>`;
  }).join('');

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
            <strong>${airlineData.filter(a=>a.policy_status === 'reviewed').length}</strong>
            <span>${cabinText('Reviewed airline policies','قوانین ایرلاین‌های بررسی‌شده')}</span>
          </div>
          <div class="pv-summary-item">
            <strong>${airlineData.filter(a => {
              const r = getActiveRule(a);
              return airlineResult(a, r).status === 'Compatible';
            }).length}</strong>
            <span>${cabinText('Weight & size OK','وزن و سایز مناسب')}</span>
          </div>
          <div class="pv-summary-item">
            <strong>${airlineData.filter(a => {
              const r = getActiveRule(a);
              return a.policy_status === 'reviewed' && airlineResult(a, r).status === 'Check';
            }).length}</strong>
            <span>${cabinText('Missing carrier / policy details','نیاز به اطلاعات کیف یا قانون')}</span>
          </div>
        </div>

        <p class="pv-muted">${cabinText('Cabin weight and carrier-size checks only. No flight search or pet-space reservation is performed. L × W × H means length × width × height.', 'بررسی وزن و سایز کیف کابین؛ جست‌وجوی پرواز یا رزرو جای حیوان انجام نشده است. ترتیب ابعاد: طول × عرض × ارتفاع.')}</p>

        <div class="pv-grid">

          ${airlineCards}

        </div>

      </div>


      <div class="pv-card">
        <h3>Travel in the aircraft hold (checked pet baggage)</h3>
        <p class="pv-muted">Hold (AVIH) is separate from air cargo/freight. The options below are policy references only, not confirmed travel bookings. Short-nosed breeds and connections can be restricted.</p>
        <div class="pv-grid">${holdCards}</div>
        <p class="pv-muted">Only reviewed carriers have checked-hold policy details. Other airlines are also listed above with an explicit unknown-policy warning. Cabin/hold acceptance must be confirmed by the operating airline.</p><p><a href="/#policy-library" target="_self">Browse the full airline directory →</a></p>
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

            <button class="btn dark" id="newTrip">Plan a new trip</button>\n\n            ${renderEngine()}

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


  bindCabinControls();

  $('newTrip')?.addEventListener('click', () => openTrip());

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
    () => openTrip()
  );

  $('editTrip')?.addEventListener(
    'click',
    () => openTrip(true)
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


function dashboardAction(action) {
  show('dashboard');
  document.querySelectorAll('.side-nav button').forEach(button => {
    const active = button.dataset.dashboardAction === action;
    button.classList.toggle('side-active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  if (action === 'pets') { openPet(); return; }
  if (action === 'trip') { openTrip(); return; }
  if (action === 'documents') {
    if (!trip) { openTrip(); return; }
    const cards = document.querySelectorAll('#dashboardContent .pv-card');
    const target = [...cards].find(card => /Documents PawVago expects/.test(card.textContent));
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (action === 'places') {
    const content = $('dashboardContent');
    content.innerHTML = '<div class="dash-card"><h2>Destination places</h2><p>Services available for your current trip.</p>' +
      (trip ? renderServices() : '<p>Plan a trip to explore destination services.</p>') +
      '<button class="btn dark" id="placesTrip">Plan a new trip</button></div>';
    $('placesTrip').onclick = () => openTrip();
    return;
  }
  if (action === 'community') {
    $('dashboardContent').innerHTML = '<div class="dash-card"><h2>PawVago community</h2><p>Connect with PawVago and share your pet travel experience.</p><p><a href="https://www.facebook.com/profile.php?id=61596122516525" target="_blank" rel="noopener noreferrer">Facebook →</a></p><p><a href="https://www.instagram.com/pawvago.ai/" target="_blank" rel="noopener noreferrer">Instagram →</a></p></div>';
  }
}

function bindStaticEvents() {

  document.querySelectorAll('.side-nav button').forEach(button => {
    button.addEventListener('click', () => dashboardAction(button.dataset.dashboardAction));
  });
  document.querySelectorAll('[data-home-link]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      show('home');
      location.hash = '#top';
    });
  });


  ensureStyles();

  ensureTripModal();
  $('pvLanguage')?.addEventListener('change', () => setTimeout(() => { if ($('dashboardView')?.classList.contains('active')) render(); }, 0));


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


  // Watch Demo is managed by demo.js; no competing scroll action.


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


  $('switchAuth')?.addEventListener(
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

    // Return immediately: Supabase calls inside the auth callback can
    // wait on the same auth lock and freeze login/data loading.
    sb.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user || null;
      const changed = user?.id !== nextUser?.id;
      user = nextUser;
      if (!user) {
        pet = null;
        trip = null;
        pendingTrip = false;
      }
      if (changed || _event === 'INITIAL_SESSION' || _event === 'SIGNED_OUT') {
        setTimeout(() => refresh().catch(console.error), 0);
      }
    });

  }

}


/* =========================================================
   START
========================================================= */

ensureStyles();

bindStaticEvents();

refresh();

