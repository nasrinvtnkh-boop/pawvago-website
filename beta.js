/* PawVago private beta. Email verification uses the existing Supabase Auth project.
   No service-role credentials, local email lists, or third-party trackers. */
(() => {
  'use strict';

  const form = document.getElementById('betaForm');
  if (!form) return;

  const emailField = document.getElementById('betaEmail');
  const consentField = document.getElementById('betaConsent');
  const notice = document.getElementById('betaNotice');
  const submit = form.querySelector('button[type="submit"]');
  const client = typeof sb !== 'undefined' ? sb : null;
  let inFlight = false;
  let verifying = false;

  function inform(message, isError = false) {
    notice.textContent = message;
    notice.dataset.kind = isError ? 'error' : 'success';
  }

  function betaData(source = 'website') {
    return {
      pawvago_beta_interested: true,
      pawvago_beta_consent: true,
      pawvago_beta_registered_at: new Date().toISOString(),
      pawvago_beta_source: source
    };
  }

  function campaignSource() {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('utm_source') || 'website';
    return /^[a-z0-9_-]{1,60}$/i.test(source) ? source : 'website';
  }

  async function markVerifiedSession(session) {
    if (new URLSearchParams(window.location.search).get('beta') !== 'confirmed') return;
    if (verifying || !session?.user) return;
    verifying = true;
    try {
      const current = session.user.user_metadata || {};
      const { error } = await client.auth.updateUser({
        data: {
          ...betaData(current.pawvago_beta_source || 'verified-link'),
          pawvago_beta_registered_at: current.pawvago_beta_registered_at || new Date().toISOString()
        }
      });
      if (error) throw error;
      inform('Email confirmed. Your beta interest is recorded. We will contact you about testing opportunities.');
      const url = new URL(window.location.href);
      url.searchParams.delete('beta');
      window.history.replaceState({}, '', url.pathname + url.search + '#beta');
    } catch (err) {
      inform('Sign-in succeeded, but we could not save your beta request. Please try the form again.', true);
    } finally {
      verifying = false;
    }
  }

  if (client && new URLSearchParams(window.location.search).get('beta') === 'confirmed') {
    client.auth.getSession()
      .then(({ data }) => markVerifiedSession(data.session))
      .catch(() => inform('We could not verify your sign-in. Please try again.', true));
    client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        // Defer Supabase requests outside its auth state change callback.
        setTimeout(() => { markVerifiedSession(session); }, 0);
      }
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (inFlight) return;
    const email = emailField.value.trim().toLowerCase();
    if (!emailField.checkValidity() || !consentField.checked) {
      form.reportValidity();
      return;
    }
    if (!client) {
      inform('Early-access signup is temporarily unavailable. Please contact contact@pawvago.com.', true);
      return;
    }

    inFlight = true;
    submit.disabled = true;
    submit.textContent = 'Submitting…';
    inform('');

    try {
      const { data: sessionData, error: sessionError } = await client.auth.getSession();
      if (sessionError) throw sessionError;
      const activeUser = sessionData.session?.user;
      if (activeUser) {
        if (activeUser.email?.toLowerCase() !== email) {
          inform('You are signed in with another email. Please use that address or log out first.', true);
          return;
        }
        const current = activeUser.user_metadata || {};
        const { error } = await client.auth.updateUser({
          data: {
            ...betaData(current.pawvago_beta_source || campaignSource()),
            pawvago_beta_registered_at: current.pawvago_beta_registered_at || new Date().toISOString()
          }
        });
        if (error) throw error;
        inform('You are on the beta interest list. We will contact you about testing opportunities.');
      } else {
        const redirect = new URL(window.location.href);
        redirect.search = '?beta=confirmed';
        redirect.hash = '#beta';
        const { error } = await client.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
            emailRedirectTo: redirect.href,
            data: betaData(campaignSource())
          }
        });
        if (error) throw error;
        inform('Check your inbox (and spam folder). Click the email link to verify your request. No password needed.');
      }
      form.reset();
    } catch (err) {
      inform(err?.message || 'We could not submit your request. Please try again later.', true);
    } finally {
      inFlight = false;
      submit.disabled = false;
      submit.textContent = 'Join the beta →';
    }
  });
})();
