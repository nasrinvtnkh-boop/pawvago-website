const C = window.PAWVAGO_CONFIG || {};

const sb =
  C.SUPABASE_URL &&
  !C.SUPABASE_URL.includes("YOUR_") &&
  window.supabase
    ? supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY)
    : null;

const $ = (id) => document.getElementById(id);

let user = JSON.parse(localStorage.getItem("pawvago_user") || "null");
let pet = JSON.parse(localStorage.getItem("pawvago_pet") || "null");
let trip = JSON.parse(localStorage.getItem("pawvago_trip") || "null");

let mode = "signup";


function ensureTripModal() {

  if ($("tripModal")) return;

  const modal = document.createElement("div");

  modal.className = "modal hidden";
  modal.id = "tripModal";

  modal.innerHTML = `
    <div class="modal-box">

      <button
        class="close"
        id="closeTrip"
        type="button"
      >×</button>

      <p class="eyebrow">
        TRIP PLANNER
      </p>

      <h2>
        Build your travel plan
      </h2>

      <p>
        Enter your journey details and PawVago will run a first travel-readiness check.
      </p>

      <form id="tripForm">

        <label>
          Departure
          <input
            id="tripFrom"
            type="text"
            placeholder="e.g. Nantes"
            required
          >
        </label>

        <label>
          Destination
          <input
            id="tripTo"
            type="text"
            placeholder="e.g. Budapest"
            required
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

        <label>
          Airline
          <input
            id="tripAirline"
            type="text"
            placeholder="e.g. Vueling"
            required
          >
        </label>

        <hr>

        <p class="eyebrow">
          PET TRAVEL CHECK
        </p>

        <label>
          Carrier weight (kg)
          <input
            id="carrierWeight"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 1.2"
          >
        </label>

        <label>
          Carrier dimensions (cm)
          <input
            id="carrierDimensions"
            type="text"
            placeholder="e.g. 45 × 39 × 21"
          >
        </label>

        <label>
          Microchip
          <select id="microchipStatus">
            <option value="unknown">
              Not checked yet
            </option>
            <option value="yes">
              Yes — verified
            </option>
            <option value="no">
              No
            </option>
          </select>
        </label>

        <label>
          Rabies vaccination
          <select id="rabiesStatus">
            <option value="unknown">
              Not checked yet
            </option>
            <option value="yes">
              Yes — valid
            </option>
            <option value="no">
              No / expired
            </option>
          </select>
        </label>

        <label>
          EU pet passport
          <select id="passportStatus">
            <option value="unknown">
              Not checked yet
            </option>
            <option value="yes">
              Yes — valid
            </option>
            <option value="no">
              No
            </option>
          </select>
        </label>

        <button
          class="btn dark full"
          type="submit"
        >
          Run readiness check
        </button>

      </form>

      <div
        class="notice"
        id="tripNotice"
      ></div>

    </div>
  `;

  document.body.appendChild(modal);

  addReadinessStyles();

  $("closeTrip").onclick = closeTrip;

  $("tripForm").onsubmit = saveTrip;
}


function addReadinessStyles() {

  if ($("pawvagoReadinessStyles")) return;

  const style = document.createElement("style");

  style.id = "pawvagoReadinessStyles";

  style.textContent = `

    .readiness-box {
      margin: 20px 0;
      padding: 20px;
      border: 1px solid rgba(15,23,42,.10);
      border-radius: 18px;
      background: #fff;
    }

    .readiness-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 14px;
    }

    .readiness-head h3 {
      margin: 0;
    }

    .readiness-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 42px;
      height: 32px;
      padding: 0 10px;
      border-radius: 999px;
      background: #eef2f7;
      font-weight: 700;
    }

    .readiness-list {
      display: grid;
      gap: 10px;
    }

    .readiness-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 0;
      border-bottom: 1px solid rgba(15,23,42,.07);
    }

    .readiness-row:last-child {
      border-bottom: 0;
    }

    .readiness-row small {
      display: block;
      margin-top: 3px;
      opacity: .68;
    }

    .readiness-icon {
      width: 28px;
      height: 28px;
      flex: 0 0 28px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
    }

    .readiness-icon.ok {
      background: #dcfce7;
      color: #166534;
    }

    .readiness-icon.warn {
      background: #fef3c7;
      color: #92400e;
    }

    .readiness-icon.bad {
      background: #fee2e2;
      color: #991b1b;
    }

    .readiness-note {
      margin-top: 14px;
      padding: 12px 14px;
      border-radius: 12px;
      background: #f8fafc;
      font-size: .9rem;
      line-height: 1.5;
    }

    .source-note {
      margin-top: 10px;
      padding: 12px 14px;
      border-radius: 12px;
      background: #f1f5f9;
      font-size: .9rem;
      line-height: 1.5;
    }

  `;

  document.head.appendChild(style);
}


function auth(m) {

  mode = m;

  $("authTitle").textContent =
    m === "signup"
      ? "Create your account"
      : "Welcome back";

  $("authSubtitle").textContent =
    m === "signup"
      ? "Start building your pet travel plan."
      : "Log in to continue your PawVago journey.";

  $("authSubmit").textContent =
    m === "signup"
      ? "Create account"
      : "Log in";

  $("authNotice").textContent = "";

  $("authNotice").className = "notice";

  $("authModal").classList.remove("hidden");
}


function closeAuth() {

  $("authModal").classList.add("hidden");

}


function openPet() {

  if (pet) {

    $("petName").value =
      pet.name || "";

    $("species").value =
      pet.species || "Dog";

    $("weight").value =
      pet.weight || "";

    $("breed").value =
      pet.breed || "";
  }

  $("petModal").classList.remove("hidden");
}


function closePet() {

  $("petModal").classList.add("hidden");

}


function openTrip() {

  ensureTripModal();

  if (!user) {

    auth("login");

    return;
  }

  if (!pet) {

    openPet();

    return;
  }

  if (trip) {

    $("tripFrom").value =
      trip.from || "";

    $("tripTo").value =
      trip.to || "";

    $("tripDate").value =
      trip.date || "";

    $("tripAirline").value =
      trip.airline || "";

    $("carrierWeight").value =
      trip.carrierWeight || "";

    $("carrierDimensions").value =
      trip.carrierDimensions || "";

    $("microchipStatus").value =
      trip.microchip || "unknown";

    $("rabiesStatus").value =
      trip.rabies || "unknown";

    $("passportStatus").value =
      trip.passport || "unknown";
  }

  $("tripModal").classList.remove("hidden");
}


function closeTrip() {

  $("tripModal")?.classList.add("hidden");

}


function savePet(e) {

  e.preventDefault();

  pet = {

    name:
      $("petName").value.trim(),

    species:
      $("species").value,

    weight:
      $("weight").value,

    breed:
      $("breed").value.trim()

  };

  localStorage.setItem(
    "pawvago_pet",
    JSON.stringify(pet)
  );

  closePet();

  render();
}


function saveTrip(e) {

  e.preventDefault();

  trip = {

    from:
      $("tripFrom").value.trim(),

    to:
      $("tripTo").value.trim(),

    date:
      $("tripDate").value,

    airline:
      $("tripAirline").value.trim(),

    carrierWeight:
      $("carrierWeight").value,

    carrierDimensions:
      $("carrierDimensions").value.trim(),

    microchip:
      $("microchipStatus").value,

    rabies:
      $("rabiesStatus").value,

    passport:
      $("passportStatus").value

  };

  localStorage.setItem(
    "pawvago_trip",
    JSON.stringify(trip)
  );

  closeTrip();

  render();
}


async function refresh() {

  if (sb) {

    const { data } =
      await sb.auth.getSession();

    user =
      data.session?.user || null;
  }

  const authActions =
    $("authActions");

  if (!authActions) return;

  authActions.innerHTML =
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

  $("loginBtn")?.addEventListener(
    "click",
    () => auth("login")
  );

  $("signupBtn")?.addEventListener(
    "click",
    () => auth("signup")
  );

  $("dashBtn")?.addEventListener(
    "click",
    () => show("dashboard")
  );
}


async function submitAuth(e) {

  e.preventDefault();

  const email =
    $("email").value.trim();

  const password =
    $("password").value;

  if (sb) {

    const result =
      mode === "signup"

        ? await sb.auth.signUp({
            email,
            password
          })

        : await sb.auth.signInWithPassword({
            email,
            password
          });

    if (result.error) {

      $("authNotice").textContent =
        result.error.message;

      $("authNotice").className =
        "notice error";

      return;
    }

    user =
      result.data.user ||
      result.data.session?.user ||
      null;

    if (
      mode === "signup" &&
      !user
    ) {

      $("authNotice").textContent =
        "Account created. Please check your email to confirm your account, then log in.";

      $("authNotice").className =
        "notice";

      return;
    }

  } else {

    user = {
      email
    };

    localStorage.setItem(
      "pawvago_user",
      JSON.stringify(user)
    );
  }

  await refresh();

  closeAuth();

  show("dashboard");
}


function show(view) {

  document
    .querySelectorAll(".view")
    .forEach(
      (x) =>
        x.classList.remove("active")
    );

  const target =
    $(view + "View");

  if (target) {

    target.classList.add("active");

  }

  if (view === "dashboard") {

    render();

  }

  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}


function parseDimensions(value) {

  if (!value) return null;

  const nums =
    String(value)
      .replace(/,/g, ".")
      .match(
        /\d+(?:\.\d+)?/g
      );

  if (
    !nums ||
    nums.length < 3
  ) {

    return null;

  }

  return nums
    .slice(0, 3)
    .map(Number);

}


function isVueling() {

  return String(
    trip?.airline || ""
  )
    .toLowerCase()
    .includes("vueling");

}function readinessForTrip() {

  const vueling =
    isVueling();

  const petWeight =
    Number(pet?.weight || 0);

  const carrierWeight =
    Number(trip?.carrierWeight || 0);

  const totalWeight =
    petWeight + carrierWeight;

  const dimensions =
    parseDimensions(
      trip?.carrierDimensions
    );

  const dimensionsOk =
    vueling &&
    dimensions
      ? dimensions[0] <= 45 &&
        dimensions[1] <= 39 &&
        dimensions[2] <= 21
      : null;

  const weightOk =
    vueling
      ? petWeight > 0 &&
        totalWeight <= 10
      : null;

  const microchipOk =
    trip?.microchip === "yes";

  const rabiesOk =
    trip?.rabies === "yes";

  const passportOk =
    trip?.passport === "yes";


  const checks = [

    {
      label: "Pet profile",
      ok: !!pet,
      warning: !pet,
      detail: pet
        ? `${pet.name || "Pet"} · ${pet.species || "Pet"} · ${pet.weight || "?"} kg`
        : "Add your pet profile"
    },

    {
      label: "Microchip",
      ok: microchipOk,
      warning: !microchipOk,
      detail:
        microchipOk
          ? "Verified"
          : "Verify before travel"
    },

    {
      label: "Rabies vaccination",
      ok: rabiesOk,
      warning: !rabiesOk,
      detail:
        rabiesOk
          ? "Marked valid"
          : "Check validity and dates"
    },

    {
      label: "EU pet passport",
      ok: passportOk,
      warning: !passportOk,
      detail:
        passportOk
          ? "Marked valid"
          : "Verify passport"
    },

    {
      label:
        vueling
          ? "Vueling weight limit"
          : "Airline weight limit",

      ok:
        vueling
          ? weightOk === true
          : null,

      warning:
        vueling
          ? weightOk === null
          : true,

      detail:

        vueling

          ? weightOk === true

            ? `${totalWeight.toFixed(1)} kg / 10 kg`

            : weightOk === false

              ? `${totalWeight.toFixed(1)} kg exceeds 10 kg`

              : "Add carrier weight"

          : "Airline-specific rule needs verification"
    },


    {
      label:
        vueling
          ? "Carrier dimensions"
          : "Carrier requirements",

      ok:
        vueling
          ? dimensionsOk === true
          : null,

      warning:
        vueling
          ? dimensionsOk === null
          : true,

      detail:

        vueling

          ? dimensionsOk === true

            ? "Within 45 × 39 × 21 cm"

            : dimensionsOk === false

              ? "Exceeds 45 × 39 × 21 cm"

              : "Enter carrier dimensions"

          : "Check airline requirements"
    },


    {
      label:
        "Destination requirements",

      ok: null,

      warning: true,

      detail:
        "Official destination rules need verification"
    }

  ];


  const hardFailures =
    checks.filter(
      (c) =>
        c.ok === false &&
        !c.warning
    ).length;


  const needsAttention =
    checks.some(
      (c) => c.warning
    ) ||
    hardFailures > 0;


  return {

    checks,

    status:
      needsAttention
        ? "Needs attention"
        : "Ready to review",

    vueling,

    totalWeight,

    dimensionsOk

  };

}


function renderReadiness() {

  const r =
    readinessForTrip();


  const rows =
    r.checks
      .map((c) => {

        const icon =
          c.ok === true
            ? "✓"
            : c.ok === false
              ? "!"
              : "○";


        const cls =
          c.ok === true
            ? "ok"
            : c.ok === false &&
              !c.warning
              ? "bad"
              : "warn";


        return `

          <div class="readiness-row">

            <span
              class="readiness-icon ${cls}"
            >
              ${icon}
            </span>

            <div>

              <strong>
                ${escapeHtml(c.label)}
              </strong>

              <small>
                ${escapeHtml(c.detail)}
              </small>

            </div>

          </div>

        `;

      })
      .join("");


  return `

    <div class="readiness-box">

      <div class="readiness-head">

        <div>

          <p class="eyebrow">
            TRAVEL READINESS
          </p>

          <h3>
            ${escapeHtml(r.status)}
          </h3>

        </div>

        <span class="readiness-badge">

          ${
            r.checks.filter(
              c => c.ok === true
            ).length
          }

          /

          ${r.checks.length}

        </span>

      </div>


      <div class="readiness-list">

        ${rows}

      </div>


      <div class="readiness-note">

        <strong>
          PawVago check:
        </strong>

        This is a preliminary readiness check.
        Final eligibility must be verified with the airline
        and the official destination requirements.

      </div>


      ${
        r.vueling

          ? `

            <div class="source-note">

              Vueling cabin limit:

              <strong>
                10 kg including pet and carrier
              </strong>

              and maximum carrier dimensions:

              <strong>
                45 × 39 × 21 cm
              </strong>.

            </div>

          `

          : ""

      }

    </div>

  `;

}


function renderTrip() {

  if (!trip) {

    return `

      <div class="empty">

        <p>
          Your personalized checklist will appear here once trip details are added.
        </p>

        <button
          class="btn dark"
          id="trip"
        >
          Start a trip
        </button>

      </div>

    `;

  }


  const petText = pet

    ? `${pet.name} · ${pet.species} · ${pet.weight} kg`

    : "Pet profile not added";


  const dateText = trip.date

    ? new Date(
        `${trip.date}T00:00:00`
      ).toLocaleDateString()

    : "Date not set";


  return `

    <div class="trip-summary">

      <h3>

        ${escapeHtml(trip.from)}

        →

        ${escapeHtml(trip.to)}

      </h3>


      <p>

        <strong>
          Travel date:
        </strong>

        ${escapeHtml(dateText)}

      </p>


      <p>

        <strong>
          Airline:
        </strong>

        ${escapeHtml(
          trip.airline ||
          "To be confirmed"
        )}

      </p>


      <p>

        <strong>
          Pet:
        </strong>

        ${escapeHtml(petText)}

      </p>


      ${renderReadiness()}


      <div class="checklist">

        <div>
          ✓ Pet profile
        </div>

        <div>
          ✓ Route and travel date
        </div>

        <div>
          ○ Airline rules
        </div>

        <div>
          ○ Destination requirements
        </div>

        <div>
          ○ Documents and deadlines
        </div>

        <div>
          ○ Pet-friendly services
        </div>

      </div>


      <button
        class="btn outline"
        id="editTrip"
      >
        Edit trip
      </button>

    </div>

  `;

}


function render() {

  const content =
    $("dashboardContent");

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

    $("dlogin").onclick =
      () => auth("login");

    return;

  }


  content.innerHTML = `

    <div class="dash-card">

      <h2>
        Welcome to PawVago
      </h2>

      <p>
        ${escapeHtml(
          user.email || ""
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
                  ? ` · ${escapeHtml(
                      pet.breed
                    )}`
                  : ""
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
                Add your pet before creating a travel plan.
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
        My travel plan
      </h2>

      ${renderTrip()}

    </div>

  `;


  $("add")?.addEventListener(
    "click",
    openPet
  );

  $("edit")?.addEventListener(
    "click",
    openPet
  );

  $("trip")?.addEventListener(
    "click",
    openTrip
  );

  $("editTrip")?.addEventListener(
    "click",
    openTrip
  );

}


function escapeHtml(value) {

  return String(value ?? "")

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}


function bindStaticEvents() {

  ensureTripModal();


  $("loginBtn")?.addEventListener(
    "click",
    () => auth("login")
  );


  $("signupBtn")?.addEventListener(
    "click",
    () => auth("signup")
  );


  $("heroSignup")?.addEventListener(
    "click",
    () => auth("signup")
  );


  $("ctaSignup")?.addEventListener(
    "click",
    () => auth("signup")
  );


  $("heroDemo")?.addEventListener(
    "click",
    () => {

      document
        .querySelector("#how")
        ?.scrollIntoView({
          behavior: "smooth"
        });

    }
  );


  $("closeModal")?.addEventListener(
    "click",
    closeAuth
  );


  $("closePet")?.addEventListener(
    "click",
    closePet
  );


  $("authForm")?.addEventListener(
    "submit",
    submitAuth
  );


  $("petForm")?.addEventListener(
    "submit",
    savePet
  );


  $("logoutBtn")?.addEventListener(
    "click",
    async () => {

      if (sb) {

        await sb.auth.signOut();

      }

      user = null;

      localStorage.removeItem(
        "pawvago_user"
      );

      await refresh();

      show("home");

    }
  );


  document
    .querySelectorAll(
      "[data-view]"
    )
    .forEach(
      (a) => {

        a.addEventListener(
          "click",
          (e) => {

            e.preventDefault();

            show(
              a.dataset.view
            );

          }
        );

      }
    );

}


ensureTripModal();

bindStaticEvents();

refresh();
