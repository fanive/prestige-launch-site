/* PRESTIGE launch site. No dependency. Everything here is an enhancement:
   the pages read fully with JavaScript off. */
(() => {
  'use strict';
  const doc = document, root = doc.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Preview helper: ?vh=900 renders a very tall window as if it were 900px high.
  const previewVh = new URLSearchParams(location.search).get('vh');
  if (previewVh) {
    root.style.setProperty('--vh100', previewVh + 'px');
    doc.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; img.decoding = 'sync'; });
  }

  // Theme: follows the system; the button overrides and remembers (try/catch: storage can be blocked).
  try {
    const saved = localStorage.getItem('prestige-theme');
    if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  } catch (_) {}
  doc.querySelector('.theme-toggle')?.addEventListener('click', () => {
    const dark = root.dataset.theme === 'dark' ||
      (!root.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('prestige-theme', root.dataset.theme); } catch (_) {}
  });

  // Header: a line appears once the page scrolls.
  const header = doc.querySelector('.site-header');
  const onScroll = () => header?.classList.toggle('is-scrolled', scrollY > 8);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu.
  const menu = doc.querySelector('.menu-toggle'), panel = doc.querySelector('.mobile-nav');
  const closeMenu = () => {
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    menu.setAttribute('aria-expanded', 'false');
    doc.body.style.overflow = '';
  };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    doc.body.style.overflow = open ? 'hidden' : '';
  });
  panel?.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  matchMedia('(min-width: 1181px)').addEventListener('change', closeMenu);

  // Reveal on scroll, once.
  const reveals = [...doc.querySelectorAll('.reveal')];
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 60}ms`; io.observe(el); });
  }

  // Sticky story: the phone on the right follows the step in the middle of the screen.
  const story = doc.querySelector('.story');
  if (story && 'IntersectionObserver' in window) {
    const steps = [...story.querySelectorAll('.step')];
    const layers = [...story.querySelectorAll('.story__stage .layer')];
    const activate = (index) => {
      steps.forEach((s, i) => s.classList.toggle('is-active', i === index));
      layers.forEach((l, i) => {
        if (i === index) l.removeAttribute('data-off'); else l.setAttribute('data-off', '');
      });
    };
    activate(0);
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activate(steps.indexOf(entry.target));
      }
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    steps.forEach((s) => io.observe(s));
  }

  // Gallery: arrows scroll by one phone; the track also scrolls by touch, wheel and keyboard.
  const track = doc.querySelector('.gallery__track');
  if (track) {
    const step = () => (track.querySelector('.gallery__item')?.getBoundingClientRect().width || 300) + 30;
    doc.querySelector('[data-gallery=prev]')?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
    doc.querySelector('[data-gallery=next]')?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));
  }

  // Legal pages: highlight the section being read in the contents.
  const links = [...doc.querySelectorAll('.toc a')];
  if (links.length && 'IntersectionObserver' in window) {
    const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((a) => a.classList.remove('is-active'));
        byId.get(entry.target.id)?.classList.add('is-active');
      }
    }, { rootMargin: '-20% 0px -70% 0px' });
    doc.querySelectorAll('.legal section[id]').forEach((s) => io.observe(s));
  }
})();
