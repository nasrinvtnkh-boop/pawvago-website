(() => {
  'use strict';

  const idle = window.requestIdleCallback || (cb => setTimeout(cb, 1));
  const nextFrame = cb => requestAnimationFrame(() => requestAnimationFrame(cb));

  function targetSection(button) {
    const card = button.closest('.pv-option');
    const title = (card?.querySelector('h4')?.textContent || '').toLowerCase();
    if (title.includes('car') || title.includes('road')) return document.querySelector('.pv-road');
    if (title.includes('flight') || title.includes('air')) return document.querySelector('.pv-engine .pv-card, .pv-support');
    return document.querySelector('.pv-support, .pv-road');
  }

  function handleJourneyAction(button) {
    if (button.dataset.pvBusy === '1') return;
    button.dataset.pvBusy = '1';
    const old = button.textContent;
    button.textContent = 'Opening details…';
    button.disabled = true;

    nextFrame(() => {
      const target = targetSection(button);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        setTimeout(() => target.focus({ preventScroll: true }), 350);
      }
      setTimeout(() => {
        button.textContent = old;
        button.disabled = false;
        button.dataset.pvBusy = '0';
      }, 450);
    });
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('.pv-btn');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    handleJourneyAction(button);
  }, true);

  function tuneRenderedUI() {
    document.querySelectorAll('.pv-btn').forEach(button => {
      button.removeAttribute('onclick');
      button.setAttribute('aria-label', button.textContent.trim());
    });

    document.querySelectorAll('.pv-road, .pv-support, .pv-engine > section').forEach(section => {
      section.style.contentVisibility = 'auto';
      section.style.containIntrinsicSize = '1px 700px';
    });
  }

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    idle(() => {
      queued = false;
      tuneRenderedUI();
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
  idle(tuneRenderedUI);
})();
