(() => {
  document.documentElement.classList.add('js');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav-menu]');
  if (navToggle) navToggle.hidden = false;
  // The existing theme owns toggling. Complete keyboard and dismissal behavior.
  const closeNav = () => {
    nav?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  };
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav?.classList.contains('is-open')) {
      closeNav();
      navToggle?.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeNav();
  });
  nav?.addEventListener('click', (event) => { if (event.target.closest('a')) closeNav(); });

  document.querySelectorAll('[data-evidence-tabs]').forEach((root) => {
    const controls = root.querySelector('[role="tablist"]');
    const tabs = [...controls.querySelectorAll('[role="tab"]')];
    const activate = (tab, focus = false) => {
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(item.getAttribute('aria-controls'));
        panel.hidden = !selected;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', item.id);
        panel.tabIndex = 0;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', (event) => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); activate(tabs[next], true); }
      });
    });
    controls.hidden = false;
    activate(tabs[0]);
  });

  document.querySelectorAll('[data-model-player]').forEach((root) => {
    const video = root.querySelector('[data-model-video]');
    const status = root.querySelector('[data-model-status]');
    const error = root.querySelector('[data-model-error]');
    const controls = root.querySelector('.model-controls');
    const buttons = [...root.querySelectorAll('[data-video-src]')];
    status.hidden = false;
    let selectedLabel = '';
    let request = 0;
    controls.hidden = false;
    buttons.forEach((button) => button.addEventListener('click', async () => {
      const current = ++request;
      selectedLabel = button.textContent.replace(/^Load /, '');
      error.hidden = true;
      video.pause();
      video.src = button.dataset.videoSrc;
      video.load();
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      status.textContent = `Loading ${selectedLabel}…`;
      try { await video.play(); }
      catch (reason) {
        if (current === request && reason.name !== 'AbortError' && !video.error) {
          status.textContent = 'Use the video play button to begin. You can pause or scrub through the view.';
        }
      }
    }));
    video.addEventListener('loadeddata', () => { status.textContent = `Showing ${selectedLabel}. Use the video controls to pause, replay, or move through the view.`; });
    video.addEventListener('error', () => { error.hidden = false; status.textContent = 'Animation unavailable.'; });
  });
})();
