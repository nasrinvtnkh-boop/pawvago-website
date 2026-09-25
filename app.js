const C = window.PAWVAGO_CONFIG || {};
const sb = C.SUPABASE_URL && !C.SUPABASE_URL.includes("YOUR_") && window.supabase
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
      <button class="close" id="closeTrip" type="button">×</button>

      <p class="eyebrow">TRIP PLANNER</p>

      <h2>Build your travel plan</h2>

      <p>
        Tell PawVago about your journey and we will create your first checklist.
      </p>

      <form id="tripForm">

        <label>
          Departure
          <input
            id="tripFrom"
            type="text"
            placeholder="e.g. Paris"
            required
          >
        </label>

        <label>
          Destination
          <input
            id="tripTo"
            type="text"
            placeholder="e.g. Dubai"
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
            placeholder="e.g. Air France"
          >
        </label>

        <button class="btn dark full" type="submit">
          Create my travel plan
        </button>

      </form>

      <div class="notice" id="tripNotice"></div>
    </div>
  `;

  document.body.appendChild(modal);

  $("closeTrip").onclick = closeTrip;
  $("tripForm").onsubmit = saveTrip;
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
    $("petName").value = pet.name || "";
    $("species").value = pet.species || "Dog";
    $("weight").value = pet.weight || "";
    $("breed").value = pet.breed || "";
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
    $("tripFrom").value = trip.from || "";
    $("tripTo").value = trip.to || "";
    $("tripDate").value = trip.date || "";
    $("tripAirline").value = trip.airline || "";
  }

  $("tripModal").classList.remove("hidden");
}


function closeTrip() {
  $("tripModal")?.classList.add("hidden");
}


function savePet(e) {
  e.preventDefault();

  pet = {
    name: $("petName").value.trim(),
    species: $("species").value,
    weight: $("weight").value,
    breed: $("breed").value.trim()
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
    from: $("tripFrom").value.trim(),
    to: $("tripTo").value.trim(),
    date: $("tripDate").value,
    airline: $("tripAirline").value.trim()
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
    const { data } = await sb.auth.getSession();
    user = data.session?.user || null;
  }

  const authActions = $("authActions");

  if (!authActions) return;

  authActions.innerHTML = user
    ? `<button class="btn dark" id="dashBtn">Dashboard</button>`
    : `
      <button class="btn ghost" id="loginBtn">
        Log in
      </button>

      <button class="btn dark" id="signupBtn">
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

  const email = $("email").value.trim();
  const password = $("password").value;

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

    if (mode === "signup" && !user) {

      $("authNotice").textContent =
        "Account created. Please check your email to confirm your account, then log in.";

      $("authNotice").className =
        "notice";

      return;
    }

  } else {

    user = { email };

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
    .forEach((x) =>
      x.classList.remove("active")
    );

  const target = $(view + "View");

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


function renderTrip() {

  if (!trip) {

    return `
      <div class="empty">

        <p>
          Your personalized checklist will appear here once trip details are added.
        </p>

        <button class="btn dark" id="trip">
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
        <strong>Travel date:</strong>
        ${escapeHtml(dateText)}
      </p>

      <p>
        <strong>Airline:</strong>
        ${escapeHtml(
          trip.airline || "To be confirmed"
        )}
      </p>

      <p>
        <strong>Pet:</strong>
        ${escapeHtml(petText)}
      </p>

      <div class="checklist">

        <div>✓ Pet profile</div>

        <div>✓ Route and travel date</div>

        <div>○ Airline pet rules</div>

        <div>○ Destination entry requirements</div>

        <div>○ Documents and deadlines</div>

        <div>○ Pet-friendly services</div>

      </div>

      <button class="btn outline" id="editTrip">
        Edit trip
      </button>

    </div>
  `;
}


function render() {

  const content = $("dashboardContent");

  if (!content) return;

  if (!user) {

    content.innerHTML = `
      <div class="empty">

        <h2>Your PawVago dashboard</h2>

        <p>
          Create an account to continue.
        </p>

        <button class="btn dark" id="dlogin">
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

      <h2>Welcome to PawVago</h2>

      <p>
        ${escapeHtml(user.email || "")}
      </p>

    </div>


    <div class="dash-card">

      <h2>Pet profile</h2>

      ${
        pet

          ? `
            <p>

              <b>
                ${escapeHtml(pet.name)}
              </b>

              ·
              ${escapeHtml(pet.species)}

              ·
              ${escapeHtml(pet.weight)}
              kg

              ${
                pet.breed
                  ? ` · ${escapeHtml(pet.breed)}`
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

      <h2>My travel plan</h2>

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
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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
    .querySelectorAll("[data-view]")
    .forEach((a) => {

      a.addEventListener(
        "click",
        (e) => {

          e.preventDefault();

          show(
            a.dataset.view
          );
        }
      );

    });
}


ensureTripModal();

bindStaticEvents();

refresh();
