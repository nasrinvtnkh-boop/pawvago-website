/* Isolated, accessible mobile UI preview. Sample data only; no backend calls. */
(() => {
  const root = document.getElementById("mobile-app");
  if (!root) return;
  const panels = Array.from(root.querySelectorAll("[data-mp-panel]"));
  const tabs = Array.from(root.querySelectorAll("[data-mp-tab]"));
  const scroller = root.querySelector("#mpPhoneContent");
  const show = (name) => {
    if (!panels.some(panel => panel.dataset.mpPanel === name)) return;
    panels.forEach(panel => { panel.hidden = panel.dataset.mpPanel !== name; });
    tabs.forEach(tab => {
      const selected = tab.dataset.mpTab === name;
      tab.classList.toggle("mp-tab-active", selected);
      if (selected) tab.setAttribute("aria-current", "page");
      else tab.removeAttribute("aria-current");
    });
    if (scroller) scroller.scrollTop = 0;
  };
  root.querySelectorAll("[data-mp-tab], [data-mp-go]").forEach(button => {
    button.addEventListener("click", () => show(button.dataset.mpTab || button.dataset.mpGo));
  });
  show("home");
})();
