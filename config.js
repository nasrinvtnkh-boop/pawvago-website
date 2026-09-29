window.PAWVAGO_CONFIG = {
  SUPABASE_URL: "https://zlwxnycvdihxnfsoobjl.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_xMRGDw5Z8nLRBDLOMFTCFw_Yu3yB7BV"
};

// Load the MVP interaction fixes once. The multimodal planner itself is loaded by index.html.
(() => {
  const script = document.createElement('script');
  script.src = 'mvp-fix.js';
  script.defer = true;
  document.head.appendChild(script);
})();
