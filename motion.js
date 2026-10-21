/* PawVago landing-page motion and responsive navigation. No dependencies. */
(() => {
  "use strict";
  const home = document.getElementById("homeView");
  const header = document.querySelector(".site-nav");
  const nav = header?.querySelector(".desktop-nav");
  if (!home || !header) return;

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
    window.matchMedia("(min-width: 901px)").addEventListener?.("change", e => {
      if (e.matches) closeMenu();
    });
  }

  // Reduced-motion users and older browsers get the full content without transitions.
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)) return;

  const groups = [
    [".proof-strip > div", 80],
    [".section-intro > div, .section-intro > p", 90],
    [".flow-grid > article", 110],
    [".feature-copy > .eyebrow, .feature-copy > h2, .feature-copy > p", 75],
    [".feature-items > div", 95],
    [".feature-visual", 0],
    [".preview-copy > .eyebrow, .preview-copy > h2, .preview-copy > p, .preview-copy > button", 75],
    [".preview-image-wrap", 0],
    [".mp-copy > .eyebrow, .mp-copy > h2, .mp-copy > p, .mp-highlights, .mp-action", 55],
    [".mp-stage", 0],
    [".vision-inner > .eyebrow, .vision-inner > h2, .vision-inner > p, .vision-pills", 85],
    [".final-cta > div, .final-cta > button", 85],
    [".contact-copy, .contact-actions", 90]
  ];
  const targets = [];
  groups.forEach(([selector, stagger]) => {
    home.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add("pv-reveal");
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
