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

      if (result.data?.user) {
        user = result.data.user;
      }

      if (isSignup && !result.data?.session) {
        notice('Account created. Check your email to confirm your account, then log in.');
        return;
      }

      if (typeof closeAuth === 'function') closeAuth();
      if (typeof loadUserData === 'function') await loadUserData();
      if (typeof render === 'function') render();
      location.hash = '#dashboard';
    } catch (err) {
      console.error('PawVago auth:', err);
      notice(err?.message || 'Could not sign in. Please try again.', true);
    } finally {
      if (button) button.disabled = false;
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
  }

  document.addEventListener('DOMContentLoaded', wireAuthButtons);
  const observer = new MutationObserver(wireDashboardActions);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
