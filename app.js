const C = window.PAWVAGO_CONFIG || {};
const sb = C.SUPABASE_URL && !C.SUPABASE_URL.includes('YOUR_') && window.supabase
  ? supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY)
  : null;

const $ = id => document.getElementById(id);
let user = JSON.parse(localStorage.getItem('pawvago_user') || 'null');
let pet = JSON.parse(localStorage.getItem('pawvago_pet') || 'null');
let trip = JSON.parse(localStorage.getItem('pawvago_trip') || 'null');
let mode = 'signup';

const AIRLINES = [
  {
    name:'Vueling',
    cabin:true,
    totalKg:10,
    dims:'45 × 39 × 21 cm',
    booking:'Pet must be added to the booking',
    source:'Vueling official pet policy'
  },
  {
    name:'Lufthansa',
    cabin:true,
    totalKg:8,
    dims:'55 × 40 × 23 cm',
    booking:'Pet registration is subject to confirmation; recommend 72h+',
    source:'Lufthansa official pet policy'
  },
  {
    name:'Air France',
    cabin:true,
    totalKg:8,
    dims:'Airline-specific carrier requirements',
    booking:'Pet must be added to the booking; availability applies',
    source:'Air France official pet policy'
  }
];

const COUNTRY_ALIASES = {
  hungary:'Hungary',
  budapest:'Hungary',
  france:'France',
  paris:'France',
  spain:'Spain',
  madrid:'Spain',
  barcelona:'Spain',
  germany:'Germany',
  berlin:'Germany',
  italy:'Italy',
  rome:'Italy',
  milan:'Italy',
  portugal:'Portugal',
  lisbon:'Portugal',
  austria:'Austria',
  vienna:'Austria',
  poland:'Poland',
  warsaw:'Poland',
  belgium:'Belgium',
  brussels:'Belgium',
  netherlands:'Netherlands',
  amsterdam:'Netherlands',
  finland:'Finland',
  ireland:'Ireland',
  malta:'Malta',
  norway:'Norway',
  'northern ireland':'Northern Ireland',
  switzerland:'Switzerland',
  uk:'United Kingdom',
  'united kingdom':'United Kingdom',
  'czech republic':'Czechia',
  czechia:'Czechia',
  croatia:'Croatia',
  greece:'Greece'
};

function ensureStyles(){

  if($('pawvagoEngineStyles')) return;

  const s=document.createElement('style');

  s.id='pawvagoEngineStyles';

  s.textContent=`

  .pv-engine{
    display:grid;
    gap:18px;
    margin-top:18px
  }

  .pv-card{
    padding:20px;
    border:1px solid rgba(15,23,42,.1);
    border-radius:18px;
    background:#fff
  }

  .pv-card h3{
    margin:0 0 12px
  }

  .pv-grid{
    display:grid;
    grid-template-columns:
      repeat(auto-fit,minmax(230px,1fr));
    gap:12px
  }

  .pv-airline{
    padding:16px;
    border:1px solid rgba(15,23,42,.1);
    border-radius:14px
  }

  .pv-airline strong{
    font-size:1.05rem
  }

  .pv-pill{
    display:inline-block;
    padding:5px 9px;
    border-radius:999px;
    font-size:.78rem;
    font-weight:700;
    background:#eef2f7;
    margin-top:8px
  }

  .pv-ok{
    background:#dcfce7;
    color:#166534
  }

  .pv-warn{
    background:#fef3c7;
    color:#92400e
  }

  .pv-bad{
    background:#fee2e2;
    color:#991b1b
  }

  .pv-row{
    display:flex;
    gap:10px;
    align-items:flex-start;
    padding:10px 0;
    border-bottom:1px solid rgba(15,23,42,.07)
  }

  .pv-row:last-child{
    border-bottom:0
  }

  .pv-icon{
    width:25px;
    height:25px;
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    font-weight:800;
    flex:0 0 25px
  }

  .pv-muted{
    opacity:.68;
    font-size:.9rem
  }

  .pv-timeline{
    display:grid;
    gap:10px
  }

  .pv-timeline-item{
    padding:12px 14px;
    border-left:3px solid rgba(15,23,42,.18);
    background:#f8fafc;
    border-radius:0 10px 10px 0
  }

  .pv-timeline-item strong{
    display:block
  }

  .pv-disclaimer{
    font-size:.82rem;
    line-height:1.5;
    opacity:.7
  }

  .pv-searching{
    padding:16px;
    border-radius:14px;
    background:#f8fafc
  }

  `;

  document.head.appendChild(s);
}


function ensureTripModal(){

  ensureStyles();

  if($('tripModal')) return;

  const m=document.createElement('div');

  m.className='modal hidden';

  m.id='tripModal';

  m.innerHTML=`

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
        Where are you going?
      </h2>

      <p>
        PawVago will use your pet profile,
        destination and travel date to build
        your first travel plan.
      </p>

      <form id="tripForm">

        <label>
          Destination

          <input
            id="tripTo"
            required
            placeholder="e.g. Budapest"
          >

        </label>

        <label>
          Travel date

          <input
            id="tripDate"
            type="date"
            required
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

  document.body.appendChild(m);

  $('closeTrip').onclick=closeTrip;

  $('tripForm').onsubmit=saveTrip;
}


function auth(m){

  mode=m;

  $('authTitle').textContent=
    m==='signup'
      ? 'Create your account'
      : 'Welcome back';

  $('authSubtitle').textContent=
    m==='signup'
      ? 'Start building your pet travel plan.'
      : 'Log in to continue your PawVago journey.';

  $('authSubmit').textContent=
    m==='signup'
      ? 'Create account'
      : 'Log in';

  $('authNotice').textContent='';

  $('authModal').classList.remove('hidden');
}


function closeAuth(){

  $('authModal').classList.add('hidden');

}


function openPet(){

  if(pet){

    $('petName').value=
      pet.name||'';

    $('species').value=
      pet.species||'Dog';

    $('weight').value=
      pet.weight||'';

    $('breed').value=
      pet.breed||'';

  }

  $('petModal').classList.remove('hidden');

}


function closePet(){

  $('petModal').classList.add('hidden');

}


function openTrip(){

  ensureTripModal();

  if(!user){

    auth('login');

    return;

  }

  if(!pet){

    openPet();

    return;

  }

  if(trip){

    $('tripTo').value=
      trip.to||'';

    $('tripDate').value=
      trip.date||'';

  }

  $('tripModal').classList.remove('hidden');

}


function closeTrip(){

  $('tripModal')?.classList.add('hidden');

}


function savePet(e){

  e.preventDefault();

  pet={
    name:$('petName').value.trim(),
    species:$('species').value,
    weight:$('weight').value,
    breed:$('breed').value.trim()
  };

  localStorage.setItem(
    'pawvago_pet',
    JSON.stringify(pet)
  );

  closePet();

  render();

}


function saveTrip(e){

  e.preventDefault();

  trip={
    to:$('tripTo').value.trim(),
    date:$('tripDate').value,
    from:'France'
  };

  localStorage.setItem(
    'pawvago_trip',
    JSON.stringify(trip)
  );

  closeTrip();

  render();

}


async function submitAuth(e){

  e.preventDefault();

  const email=
    $('email').value.trim();

  const password=
    $('password').value;

  if(sb){

    const r=
      mode==='signup'

        ? await sb.auth.signUp({
            email,
            password
          })

        : await sb.auth.signInWithPassword({
            email,
            password
          });

    if(r.error){

      $('authNotice').textContent=
        r.error.message;

      $('authNotice').className=
        'notice error';

      return;

    }

    user=
      r.data.user||
      r.data.session?.user||
      null;

    if(
      mode==='signup' &&
      !user
    ){

      $('authNotice').textContent=
        'Account created. Check your email to confirm your account, then log in.';

      return;

    }

  }else{

    user={
      email
    };

    localStorage.setItem(
      'pawvago_user',
      JSON.stringify(user)
    );

  }

  await refresh();

  closeAuth();

  show('dashboard');

}


async function refresh(){

  if(sb){

    const {data}=
      await sb.auth.getSession();

    user=
      data.session?.user||
      null;

  }

  const a=
    $('authActions');

  if(!a) return;

  a.innerHTML=
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
    ()=>auth('login')
  );

  $('signupBtn')?.addEventListener(
    'click',
    ()=>auth('signup')
  );

  $('dashBtn')?.addEventListener(
    'click',
    ()=>show('dashboard')
  );

}


function countryFromDestination(value){

  const s=
    String(value||'')
      .trim()
      .toLowerCase();

  for(
    const [alias,country]
    of Object.entries(COUNTRY_ALIASES)
  ){

    if(
      s===alias ||
      s.includes(alias)
    ){

      return country;

    }

  }

  return null;

}


function isEU(country){

  return [
    'France',
    'Hungary',
    'Spain',
    'Germany',
    'Italy',
    'Portugal',
    'Austria',
    'Poland',
    'Belgium',
    'Netherlands',
    'Finland',
    'Ireland',
    'Malta',
    'Czechia',
    'Croatia',
    'Greece'
  ].includes(country);

}


function daysBetween(a,b){

  return Math.ceil(
    (
      new Date(a)-
      new Date(b)
    )/86400000
  );

}


function fmtDate(d){

  return new Date(
    d+'T00:00:00'
  ).toLocaleDateString(
    undefined,
    {
      day:'numeric',
      month:'short',
      year:'numeric'
    }
  );

}


function airlineResult(a){

  const w=
    Number(
      pet?.weight||0
    );

  if(!w){

    return {
      status:'Check',
      cls:'pv-warn',
      reason:
        'Add your pet weight to calculate compatibility.'
    };

  }


  if(a.name==='Vueling'){

    const remaining=
      10-w;

    return w<10

      ? {
          status:'Compatible',
          cls:'pv-ok',
          reason:
            `Up to ${Math.max(
              0,
              remaining
            ).toFixed(1)} kg remains for the carrier. Max carrier: 45 × 39 × 21 cm.`
        }

      : {
          status:'Not compatible',
          cls:'pv-bad',
          reason:
            'Pet alone reaches the 10 kg cabin limit.'
        };

  }


  if(a.name==='Lufthansa')

    return w<8

      ? {
          status:'Compatible',
          cls:'pv-ok',
          reason:
            `Carrier + pet must stay at or below 8 kg. Remaining carrier allowance: ${Math.max(
              0,
              8-w
            ).toFixed(1)} kg.`
        }

      : {
          status:'Not compatible',
          cls:'pv-bad',
          reason:
            'Pet weight leaves no practical carrier allowance under the 8 kg cabin limit.'
        };


  if(a.name==='Air France')

    return w<8

      ? {
          status:'Compatible',
          cls:'pv-ok',
          reason:
            `Cabin total must remain at or below 8 kg. Remaining carrier allowance: ${Math.max(
              0,
              8-w
            ).toFixed(1)} kg.`
        }

      : {
          status:'Not compatible',
          cls:'pv-bad',
          reason:
            'At 8 kg or more, the pet + carrier cannot meet the cabin threshold.'
        };


  return {
    status:'Check',
    cls:'pv-warn',
    reason:
      'Airline-specific rule needs verification.'
  };

}


function documentsFor(country){

  const eu=
    isEU(country);

  const special=[
    'Finland',
    'Ireland',
    'Malta',
    'Norway',
    'Northern Ireland'
  ].includes(country);

  if(eu){

    const docs=[
      'Microchip',
      'Valid rabies vaccination',
      'EU pet passport'
    ];

    if(special){

      docs.push(
        'Echinococcus treatment 24–120 hours before entry (dogs)'
      );

    }

    return docs;

  }

  return [

    'Microchip',

    'Rabies vaccination',

    'Destination-specific health certificate / import documents',

    'Check whether rabies antibody titration is required',

    'Check destination national rules'

  ];

}


function timelineFor(country,date){

  const out=[];

  const travel=
    new Date(
      date+'T00:00:00'
    );

  const add=
    (
      label,
      when,
      detail
    )=>{

      const d=
        when
          .toISOString()
          .slice(0,10);

      out.push({
        date:d,
        label,
        detail
      });

    };


  add(
    'Travel day',
    travel,
    'Flight / journey'
  );


  const special=[
    'Finland',
    'Ireland',
    'Malta',
    'Norway',
    'Northern Ireland'
  ].includes(country);


  if(special){

    const t=
      new Date(travel);

    t.setDate(
      t.getDate()-2
    );

    add(
      'Echinococcus treatment window opens',
      t,
      'For dogs entering the listed destinations, treatment must be administered 24–120 hours before entry.'
    );

  }


  const rabies=
    new Date(travel);

  rabies.setDate(
    rabies.getDate()-21
  );

  add(
    'Rabies timing checkpoint',
    rabies,
    'If this is a primary rabies vaccination, the EU requires at least 21 days before travel.'
  );


  const booking=
    new Date(travel);

  booking.setDate(
    booking.getDate()-7
  );

  add(
    'Airline pet booking check',
    booking,
    'Confirm pet space and route-specific acceptance with the airline.'
  );


  return out.sort(
    (a,b)=>
      a.date.localeCompare(b.date)
  );

}


function renderEngine(){

  if(!trip) return '';

  const country=
    countryFromDestination(
      trip.to
    );

  const docs=
    documentsFor(country);

  const timeline=
    timelineFor(
      country,
      trip.date
    );


  const airlineCards=
    AIRLINES
      .map(a=>{

        const r=
          airlineResult(a);

        return `

          <div class="pv-airline">

            <strong>
              ${escapeHtml(a.name)}
            </strong>

            <br>

            <span
              class="pv-pill ${r.cls}"
            >
              ${r.status}
            </span>

            <p>
              ${escapeHtml(r.reason)}
            </p>

            <div class="pv-muted">
              Carrier rule:
              ${escapeHtml(a.dims)}
            </div>

            <div class="pv-muted">
              ${escapeHtml(a.booking)}
            </div>

          </div>

        `;

      })
      .join('');


  const docRows=
    docs
      .map(d=>`

        <div class="pv-row">

          <span
            class="pv-icon pv-warn"
          >
            ○
          </span>

          <div>

            <strong>
              ${escapeHtml(d)}
            </strong>

            <div class="pv-muted">
              PawVago will verify the document status from your pet records or uploaded documents.
            </div>

          </div>

        </div>

      `)
      .join('');


  const timeRows=
    timeline
      .map(x=>`

        <div class="pv-timeline-item">

          <strong>
            ${fmtDate(x.date)}
            —
            ${escapeHtml(x.label)}
          </strong>

          <span class="pv-muted">
            ${escapeHtml(x.detail)}
          </span>

        </div>

      `)
      .join('');


  return `

    <div class="pv-engine">


      <div class="pv-card">

        <h3>
          Airlines matching your pet
        </h3>

        <p class="pv-muted">

          Based on
          ${escapeHtml(
            pet?.name||'your pet'
          )}

          (
          ${escapeHtml(
            pet?.weight||'?'
          )}
          kg
          ).

          This is airline-rule compatibility,
          not live seat availability.

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

          ${
            country

              ? `Route detected:
                 ${escapeHtml(trip.from)}
                 →
                 ${escapeHtml(country)}.`

              : `Destination country not confidently detected yet; national rules need verification.`
          }

        </p>

        ${docRows}

      </div>


      <div class="pv-card">

        <h3>
          Smart timeline
        </h3>

        <div class="pv-timeline">

          ${timeRows}

        </div>

      </div>


      <div class="pv-card">

        <h3>
          Carrier recommendation
        </h3>

        <p>

          Choose a soft,
          airline-approved carrier.

          For Vueling the maximum is

          <strong>
            45 × 39 × 21 cm
          </strong>

          and the combined pet + carrier weight is

          <strong>
            10 kg
          </strong>.

          For a
          ${escapeHtml(
            pet?.weight||'?'
          )}
          kg pet, the theoretical remaining
          weight allowance is

          <strong>
            ${Math.max(
              0,
              10-Number(
                pet?.weight||0
              )
            ).toFixed(1)}
            kg
          </strong>.

        </p>

        <p class="pv-disclaimer">

          PawVago should verify the exact
          operating carrier, route and current
          airline policy before a booking is made.

        </p>

      </div>


    </div>

  `;

}


function render(){

  const content=
    $('dashboardContent');

  if(!content) return;


  if(!user){

    content.innerHTML=`

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

    $('dlogin').onclick=
      ()=>auth('login');

    return;

  }


  content.innerHTML=`

    <div class="dash-card">

      <h2>
        Welcome to PawVago
      </h2>

      <p>
        ${escapeHtml(
          user.email||''
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
                pet.weight
              )}

              kg

              ${
                pet.breed

                  ? `· ${escapeHtml(
                      pet.breed
                    )}`

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
              Change destination/date
            </button>

          `

          : `

            <div class="empty">

              <p>
                Tell PawVago where and when
                you are travelling. The app will
                generate airline compatibility,
                documents and a timeline automatically.
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


function show(view){

  document
    .querySelectorAll('.view')
    .forEach(
      x=>
        x.classList.remove(
          'active'
        )
    );

  const t=
    $(view+'View');

  if(t)
    t.classList.add(
      'active'
    );

  if(view==='dashboard')
    render();

  window.scrollTo({
    top:0,
    behavior:'smooth'
  });

}


function escapeHtml(v){

  return String(v??'')

    .replaceAll(
      '&',
      '&amp;'
    )

    .replaceAll(
      '<',
      '&lt;'
    )

    .replaceAll(
      '>',
      '&gt;'
    )

    .replaceAll(
      '"',
      '&quot;'
    )

    .replaceAll(
      "'",
      '&#039;'
    );

}


function bindStaticEvents(){

  ensureTripModal();

  $('loginBtn')?.addEventListener(
    'click',
    ()=>auth('login')
  );

  $('signupBtn')?.addEventListener(
    'click',
    ()=>auth('signup')
  );

  $('heroSignup')?.addEventListener(
    'click',
    ()=>auth('signup')
  );

  $('ctaSignup')?.addEventListener(
    'click',
    ()=>auth('signup')
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

  $('logoutBtn')?.addEventListener(
    'click',
    async()=>{

      if(sb)
        await sb.auth.signOut();

      user=null;

      localStorage.removeItem(
        'pawvago_user'
      );

      await refresh();

      show('home');

    }
  );


  document
    .querySelectorAll(
      '[data-view]'
    )
    .forEach(
      a=>

        a.addEventListener(
          'click',
          e=>{

            e.preventDefault();

            show(
              a.dataset.view
            );

          }
        )

    );

}


ensureStyles();

bindStaticEvents();

refresh();
