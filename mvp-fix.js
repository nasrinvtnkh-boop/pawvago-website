(() => {
  const $ = id => document.getElementById(id);
  const notice = (message, error = false) => {
    const el = $('authNotice');
    if (!el) return;
    el.textContent = message;
    el.className = error ? 'notice error' : 'notice success';
  };

  async function handleAuth(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const email = $('email')?.value?.trim();
    const password = $('password')?.value || '';
    if (!email || password.length < 6) {
      notice('Enter a valid email and a password of at least 6 characters.', true);
      return;
    }
    if (typeof sb === 'undefined' || !sb) {
      notice('Authentication service is not available. Please try again shortly.', true);
      return;
    }

    const button = $('authSubmit');
    if (button) button.disabled = true;
    notice('Connecting…');

    try {
      const isSignup = typeof mode !== 'undefined' && mode === 'signup';
      const result = isSignup
        ? await sb.auth.signUp({ email, password })
        : await sb.auth.signInWithPassword({ email, password });

      if (result.error) throw result.error;
      if (result.data?.user) user = result.data.user;

      if (isSignup && !result.data?.session) {
        notice('Account created. Check your email to confirm your account, then log in.');
        return;
      }

      // Supabase persists the refresh token in browser storage. This marker is
      // non-sensitive and only tells PawVago to restore the dashboard on return.
      localStorage.setItem('pawvago.rememberSession', '1');
      localStorage.setItem('pawvago.lastView', 'dashboard');

      if (typeof closeAuth === 'function') closeAuth();
      if (typeof loadUserData === 'function') await loadUserData();
      if (typeof loadTravelData === 'function') await loadTravelData();
      if (typeof refresh === 'function') await refresh();
      if (typeof show === 'function') show('dashboard');
    } catch (err) {
      console.error('PawVago auth:', err);
      notice(err?.message || 'Could not sign in. Please try again.', true);
    } finally {
      if (button) button.disabled = false;
    }
  }

  async function restoreSession() {
    if (typeof sb === 'undefined' || !sb) return;
    try {
      const { data, error } = await sb.auth.getSession();
      if (error) throw error;
      const session = data?.session;
      if (!session?.user) {
        localStorage.removeItem('pawvago.rememberSession');
        return;
      }

      user = session.user;
      if (typeof loadUserData === 'function') await loadUserData();
      if (typeof loadTravelData === 'function') await loadTravelData();
      if (typeof refresh === 'function') await refresh();

      if (localStorage.getItem('pawvago.rememberSession') === '1' && typeof show === 'function') {
        show('dashboard');
      }
    } catch (err) {
      console.error('PawVago session restore:', err);
    }
  }

  function wireDashboardActions() {
    const sideButtons = document.querySelectorAll('.side-nav button');
    sideButtons.forEach(button => {
      const text = button.textContent.toLowerCase();
      if (text.includes('plan a trip')) {
        button.type = 'button';
        button.onclick = () => typeof openTrip === 'function' && openTrip();
      } else if (text.includes('my pets')) {
        button.type = 'button';
        button.onclick = () => typeof openPet === 'function' && openPet();
      }
    });
  }

  function wireAuthButtons() {
    $('loginBtn')?.addEventListener('click', () => typeof auth === 'function' && auth('login'));
    $('signupBtn')?.addEventListener('click', () => typeof auth === 'function' && auth('signup'));
    $('heroSignup')?.addEventListener('click', () => typeof auth === 'function' && auth('signup'));
    $('ctaSignup')?.addEventListener('click', () => typeof auth === 'function' && auth('signup'));
    $('closeModal')?.addEventListener('click', () => typeof closeAuth === 'function' && closeAuth());
    $('closePet')?.addEventListener('click', () => typeof closePet === 'function' && closePet());

    $('switchAuth')?.addEventListener('click', () => {
      const next = (typeof mode !== 'undefined' && mode === 'signup') ? 'login' : 'signup';
      if (typeof auth === 'function') auth(next);
    });

    const form = $('authForm');
    if (form) form.addEventListener('submit', handleAuth, true);
    wireDashboardActions();
    restoreSession();
  }

  document.addEventListener('DOMContentLoaded', wireAuthButtons);
  const observer = new MutationObserver(wireDashboardActions);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Clear only PawVago's UI marker on an explicit logout. Supabase handles its
  // own credentials/token cleanup in app.js.
  document.addEventListener('click', event => {
    if (event.target?.closest?.('#logoutBtn')) {
      localStorage.removeItem('pawvago.rememberSession');
      localStorage.removeItem('pawvago.lastView');
    }
  }, true);
})();