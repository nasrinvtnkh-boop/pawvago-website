window.PAWVAGO_CONFIG = {
  SUPABASE_URL: "https://zlwxnycvdihxnfsoobjl.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_xMRGDw5Z8nLRBDLOMFTCFw_Yu3yB7BV"
};

// Load the multimodal trip-planning enhancement on this feature branch.
(() => {
  const script = document.createElement('script');
  script.src = 'multimodal-planner.js';
  script.async = false;
  document.head.appendChild(script);
})();
