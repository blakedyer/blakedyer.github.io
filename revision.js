(() => {
  document.documentElement.classList.add('js');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav-menu]');
  if (navToggle) navToggle.hidden = false;
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

  // One purposeful interaction: reveal geometry beneath photographic texture.
  document.querySelectorAll('[data-surface-compare]').forEach((root) => {
    const input = root.querySelector('input[type="range"]');
    const update = () => {
      root.style.setProperty('--mesh-reveal', `${input.value}%`);
      input.setAttribute('aria-valuetext', `${input.value}% mesh, ${100 - Number(input.value)}% photographic texture`);
    };
    root.querySelector('.compare-controls').hidden = false;
    root.querySelector('figcaption').textContent += ' Drag the slider or use the arrow keys.';
    input.addEventListener('input', update);
    update();
  });
  document.querySelectorAll('[data-outcrop-video]').forEach((video) => {
    const showError = () => { video.parentElement.querySelector('.media-error').hidden = false; };
    video.addEventListener('error', showError);
    video.querySelectorAll('source').forEach((source) => source.addEventListener('error', showError));
  });
  // A direct album link should also reveal the collapsed archive.
  const revealAnchor = () => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (target?.matches('details')) target.open = true;
    const parent = target?.closest('details');
    if (parent) parent.open = true;
  };
  window.addEventListener('hashchange', revealAnchor);
  revealAnchor();
})();
