window.PAWVAGO_CONFIG = {
  SUPABASE_URL: "https://zlwxnycvdihxnfsoobjl.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_xMRGDw5Z8nLRBDLOMFTCFw_Yu3yB7BV"
};

// Load progressive product-quality layers. The multimodal planner itself is loaded by index.html.
(() => {
  ['mvp-fix.js', 'data-quality.js'].forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    document.head.appendChild(script);
  });
})();
