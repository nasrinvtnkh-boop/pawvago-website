window.PAWVAGO_CONFIG = {
  SUPABASE_URL: "https://zlwxnycvdihxnfsoobjl.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_xMRGDw5Z8nLRBDLOMFTCFw_Yu3yB7BV"
};

// Supabase warns against awaiting other Supabase calls directly inside an
// onAuthStateChange callback. The main app refreshes profile/trip data there,
// which can block sign-in on some browsers. Wrap callbacks so they run on the
// next event-loop tick, after the auth operation itself has completed.
(() => {
  const sdk = window.supabase;
  if (!sdk?.createClient || sdk.__pawvagoAuthPatched) return;

  const originalCreateClient = sdk.createClient.bind(sdk);
  sdk.createClient = (...args) => {
    const client = originalCreateClient(...args);
    const originalOnAuthStateChange = client.auth.onAuthStateChange.bind(client.auth);

    client.auth.onAuthStateChange = callback =>
      originalOnAuthStateChange((event, session) => {
        setTimeout(() => {
          Promise.resolve(callback(event, session)).catch(error =>
            console.error('PawVago auth-state refresh:', error)
          );
        }, 0);
      });

    return client;
  };
  sdk.__pawvagoAuthPatched = true;
})();

// Load the production UI/routing bridge after the main application has initialized.
window.addEventListener('load', () => {
  if (document.querySelector('script[data-pawvago-ui-fixes]')) return;
  const script = document.createElement('script');
  script.src = '/ui-fixes.js';
  script.dataset.pawvagoUiFixes = '1';
  document.body.appendChild(script);
});