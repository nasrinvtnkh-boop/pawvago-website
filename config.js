window.PAWVAGO_CONFIG = {
  SUPABASE_URL: "https://zlwxnycvdihxnfsoobjl.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_xMRGDw5Z8nLRBDLOMFTCFw_Yu3yB7BV"
};

// Load the production UI/routing bridge after the main application has initialized.
window.addEventListener('load', () => {
  if (document.querySelector('script[data-pawvago-ui-fixes]')) return;
  const script = document.createElement('script');
  script.src = '/ui-fixes.js';
  script.dataset.pawvagoUiFixes = '1';
  document.body.appendChild(script);
});
