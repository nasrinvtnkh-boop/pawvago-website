/* PawVago landing-page motion and responsive navigation. No dependencies. */
(() => {
  "use strict";
  const home = document.getElementById("homeView");
  const header = document.querySelector(".site-nav");
  const nav = header?.querySelector(".desktop-nav");
  if (!home || !header) return;

  // Deep links continue to work even though the long travel tool is closed by default.
  const travelTools = document.getElementById("travel-tools");
  if (travelTools) {
    const summary = travelTools.querySelector("summary");
    const showHashTarget = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      const target = document.getElementById(hash);
      if (!target || !travelTools.contains(target) || target === travelTools) return;
      if (!travelTools.open) travelTools.open = true;
      window.requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "instant", block: "start" });
      });
    };
    window.addEventListener("hashchange", showHashTarget);
    showHashTarget();

    const closeButton = travelTools.querySelector(".pvj-explorer-close");
    closeButton?.addEventListener("click", () => {
      travelTools.open = false;
      summary?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block: "start"
      });
      summary?.focus({ preventScroll: true });
    });
  }

  const updateHeader = () => header.classList.toggle("pv-scrolled", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Keyboard-accessible mobile menu using the existing real navigation links.
  if (nav) {
    nav.id = "pv-main-menu";
    const toggle = document.createElement("button");
    toggle.className = "pv-menu-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Open navigation menu");
    toggle.setAttribute("aria-controls", nav.id);
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = "<span></span><span></span><span></span>";
    header.appendChild(toggle);
    const closeMenu = () => {
      nav.classList.remove("pv-mobile-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation menu");
    };
    toggle.addEventListener("click", () => {
      const open = !nav.classList.contains("pv-mobile-open");
      nav.classList.toggle("pv-mobile-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && nav.classList.contains("pv-mobile-open")) {
        closeMenu();
        toggle.focus();
      }
    });
    document.addEventListener("click", e => {
      if (!header.contains(e.target)) closeMenu();
    });
    window.matchMedia("(min-width: 1181px)").addEventListener?.("change", e => {
      if (e.matches) closeMenu();
    });
  }

  // Scroll guide and a useful back-to-top control. Only the current home view shows them.
  // The progress bar is decorative; assistive technology can ignore it.
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const guide = document.createElement("div");
  guide.className = "pv-scroll-guide";
  guide.setAttribute("aria-hidden", "true");
  document.body.appendChild(guide);

  const toTop = document.createElement("button");
  toTop.className = "pv-back-to-top";
  toTop.type = "button";
  toTop.setAttribute("aria-label", "Back to top of page");
  toTop.title = "Back to top";
  toTop.innerHTML = '<span aria-hidden="true">↑</span>';
  toTop.hidden = true;
  document.body.appendChild(toTop);
  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });

  let scrollTicking = false;
  function paintScroll() {
    scrollTicking = false;
    const isHome = home.classList.contains("active");
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = Math.max(0, Math.min(1, window.scrollY / maxScroll));
    guide.style.transform = "scaleX(" + ratio.toFixed(4) + ")";
    guide.hidden = !isHome || reducedMotion;
    toTop.hidden = !isHome || window.scrollY < 640;
  }
  function scheduleScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(paintScroll);
  }
  window.addEventListener("scroll", scheduleScroll, { passive: true });
  window.addEventListener("resize", scheduleScroll, { passive: true });
  new MutationObserver(scheduleScroll).observe(home, { attributes: true, attributeFilter: ["class"] });
  paintScroll();

  // Reduced-motion users and older browsers get the full content without entrance transitions.
  if (reducedMotion || !("IntersectionObserver" in window)) return;

  const groups = [
    [".proof-strip > div", 80],
    [".pvj-heading > div", 105, "slide"],
    [".pvj-shell", 0, "zoom"],
    [".pvj-library-top", 0],
    [".pvj-rule-cards > *", 85],
    [".pvj-faq > div", 65],
    [".section-intro > div, .section-intro > p", 90],
    [".flow-grid > article", 110],
    [".feature-copy > .eyebrow, .feature-copy > h2, .feature-copy > p", 75],
    [".feature-items > div", 95],
    [".feature-visual", 0, "zoom"],
    [".preview-copy > .eyebrow, .preview-copy > h2, .preview-copy > p, .preview-copy > button", 75],
    [".preview-image-wrap", 0, "zoom"],
    [".mp-copy > .eyebrow, .mp-copy > h2, .mp-copy > p, .mp-highlights, .mp-action", 55],
    [".mp-stage", 0, "zoom"],
    [".vision-inner > .eyebrow, .vision-inner > h2, .vision-inner > p, .vision-pills", 85],
    [".final-cta > div, .final-cta > button", 85],
    [".contact-copy, .contact-actions", 90]
  ];
  const targets = [];
  groups.forEach(([selector, stagger, effect]) => {
    home.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add("pv-reveal");
      if (effect === "slide") el.classList.add(i % 2 ? "pv-enter-right" : "pv-enter-left");
      if (effect === "zoom") el.classList.add("pv-enter-zoom");
      el.style.setProperty("--pv-delay", Math.min(i * stagger, 280) + "ms");
      targets.push(el);
    });
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("pv-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: .08, rootMargin: "0px 0px -20px 0px" });
  targets.forEach(el => observer.observe(el));
})();
