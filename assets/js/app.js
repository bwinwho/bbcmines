/* ==========================================================================
   BBC MINES — app.js
   Nav, header behaviour, scrollspy, marquee, config-driven rendering, cursor.
   Scroll-triggered GSAP/Lenis motion lives in motion.js — this file has no
   GSAP dependency and must work even if the GSAP CDN fails to load.
   ========================================================================== */

import { MEDIA, CLIENTS, REPORTS, CONTACT } from './config.js';

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* -- Footer year -------------------------------------------------------- */

$$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

/* -- Mobile nav ----------------------------------------------------------
   Overlay menu: open/close, Escape to close, focus moves to close button,
   returns to the toggle on close. */

(function mobileNav() {
  const toggle = $('[data-nav-toggle]');
  const closeBtn = $('[data-nav-close]');
  const panel = $('[data-nav-mobile]');
  if (!toggle || !panel) return;

  function open() {
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add('is-open'));
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    (closeBtn || panel).focus();
  }

  function close() {
    panel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => { panel.hidden = true; }, 250);
    toggle.focus();
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? close() : open();
  });

  closeBtn?.addEventListener('click', close);

  panel.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') close();
  });
})();

/* -- Sticky header: condense + hide-on-scroll-down ----------------------- */

(function headerBehaviour() {
  const header = $('[data-header]');
  const hero = $('[data-hero]');
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;

  function update() {
    const y = window.scrollY;
    const condenseAt = hero ? hero.offsetHeight * 0.6 : 80;

    header.classList.toggle('is-condensed', y > condenseAt);

    if (y > condenseAt && y > lastY) {
      header.classList.add('is-hidden');
    } else {
      header.classList.remove('is-hidden');
    }

    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
})();

/* -- WhatsApp FAB: appears after hero, hides over #contact ---------------- */

(function waFab() {
  const fab = $('[data-wa-fab]');
  const hero = $('[data-hero]');
  const contact = $('#contact');
  if (!fab) return;

  if (!hero || typeof IntersectionObserver === 'undefined') {
    fab.classList.add('is-visible');
    return;
  }

  const heroObserver = new IntersectionObserver(([entry]) => {
    fab.classList.toggle('is-visible', !entry.isIntersecting);
  }, { rootMargin: '0px' });
  heroObserver.observe(hero);

  if (contact) {
    const contactObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) fab.classList.remove('is-visible');
    }, { threshold: 0.2 });
    contactObserver.observe(contact);
  }
})();

/* -- Mineral rail scrollspy (products.html) ------------------------------ */

(function scrollspy() {
  const rail = $('[data-mineral-rail]');
  if (!rail) return;
  const links = $$('a', rail);
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (typeof IntersectionObserver === 'undefined') return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`));
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach((s) => observer.observe(s));
})();

/* -- Config-driven media --------------------------------------------------
   Empty `src` = CSS placeholder wash stays as-is (default state).
   A real src swaps in an <img>, matching the frame's declared w/h so the
   swap costs zero CLS. */

function resolvePath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

$$('[data-media-key]').forEach((frame) => {
  const entry = resolvePath(MEDIA, frame.dataset.mediaKey);
  if (!entry || !entry.src) return;

  const img = document.createElement('img');
  img.src = entry.src;
  img.alt = entry.alt || '';
  img.width = entry.w;
  img.height = entry.h;
  img.loading = frame.closest('[data-hero]') ? 'eager' : 'lazy';
  img.decoding = 'async';
  if (frame.closest('[data-hero]')) img.fetchPriority = 'high';

  frame.prepend(img);
  frame.dataset.hasImage = 'true';
});

/* -- Config-driven client logos -------------------------------------------
   0 logos: keep the "roster to be added" note. Reduced motion: static
   left-aligned row. Otherwise a scrolling marquee: one row, or two
   counter-scrolling rows once there are 6+ clients. */

(function clientsMarquee() {
  const section = $('[data-clients-section]');
  if (!section) return;

  const marquee = $('[data-clients-marquee]', section);
  const empty = $('[data-clients-empty]', section);
  const grid = $('[data-clients-grid]', section);
  if (!marquee || !empty || !grid) return;

  if (CLIENTS.length === 0) {
    marquee.hidden = true;
    grid.hidden = true;
    empty.hidden = false;
    return;
  }

  empty.hidden = true;

  function makeLogo(client, decorative = false) {
    const el = document.createElement(client.url ? 'a' : 'span');
    el.className = 'client-logo';
    if (client.url) {
      el.href = client.url;
      el.target = '_blank';
      el.rel = 'noopener';
    }
    const img = document.createElement('img');
    img.src = client.logo;
    img.alt = decorative ? '' : client.name;
    img.loading = 'lazy';
    img.decoding = 'async';
    el.appendChild(img);
    if (decorative) {
      el.setAttribute('aria-hidden', 'true');
      if (client.url) el.tabIndex = -1;
    }
    return el;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    marquee.hidden = true;
    CLIENTS.forEach((client) => grid.appendChild(makeLogo(client)));
    grid.hidden = false;
    return;
  }

  const trackA = $('[data-marquee-track-a]', marquee);
  const trackB = $('[data-marquee-track-b]', marquee);

  // Each half of a track repeats the list until it has at least 8 logos, so
  // the -50% loop never shows a gap on wide screens even with few clients.
  const perHalf = Math.max(1, Math.ceil(8 / CLIENTS.length));

  function buildTrack(track, decorative) {
    const frag = document.createDocumentFragment();
    for (let half = 0; half < 2; half++) {
      for (let r = 0; r < perHalf; r++) {
        // Only the first pass is announced; repeats are aria-hidden.
        CLIENTS.forEach((client) =>
          frag.appendChild(makeLogo(client, decorative || half > 0 || r > 0)));
      }
    }
    track.appendChild(frag);
  }

  buildTrack(trackA, false);
  // A second counter-scrolling row only reads well with a real variety of logos.
  const rowB = trackB.closest('.marquee-row');
  if (CLIENTS.length >= 6) buildTrack(trackB, true);
  else rowB.hidden = true;

  marquee.hidden = false;
  grid.hidden = true;
})();

/* -- Config-driven documentation panels ------------------------------------
   Static HTML already ships the correct "on request" fallback for every
   mineral (REPORTS is empty by default). When the owner fills in REPORTS,
   this swaps the primary button + additional-analyses disclosure in. */

$$('[data-doc-panel]').forEach((panel) => {
  const key = panel.dataset.docPanel;
  const entry = REPORTS[key];
  if (!entry || !entry.primary) return;

  const mineralLabel = panel.closest('.spec-block')?.querySelector('.spec-block__label')?.textContent || 'this mineral';

  panel.innerHTML = '';

  const primaryRow = document.createElement('div');
  primaryRow.className = 'doc-panel__primary';
  primaryRow.innerHTML = `
    <a class="link-arrow" href="${entry.primary.href}" download>
      ${entry.primary.label}
    </a>
    <span class="doc-panel__meta">PDF${entry.primary.size ? ` &middot; ${entry.primary.size}` : ''}</span>
  `;
  panel.appendChild(primaryRow);

  if (entry.additional && entry.additional.length) {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = `Additional analyses (${entry.additional.length})`;
    details.appendChild(summary);

    const list = document.createElement('ul');
    list.className = 'doc-panel__additional';
    entry.additional.forEach((report) => {
      const li = document.createElement('li');
      li.innerHTML = `<a class="link-arrow" href="${report.href}" download>${report.label}</a><span class="doc-panel__meta">${report.size || 'PDF'}</span>`;
      list.appendChild(li);
    });
    details.appendChild(list);
    panel.appendChild(details);
  }

  void mineralLabel;
});

/* -- Custom cursor ---------------------------------------------------------
   Fine pointer + hover-capable devices only, and only with motion allowed.
   Native cursor is never hidden over text or form controls. */

(function customCursor() {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  if (!canHover || !motionOk) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);
  document.body.classList.add('has-custom-cursor');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function loop() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  const targets = [
    { sel: '[data-wa-link]', label: 'WHATSAPP' },
    { sel: 'a[download]', label: 'DOWNLOAD' },
    { sel: '.frame, .gallery-panel, a:not([data-wa-link]):not([download])', label: 'VIEW' },
  ];

  targets.forEach(({ sel, label }) => {
    $$(sel).forEach((el) => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('is-active');
        ring.dataset.label = label;
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('is-active');
        delete ring.dataset.label;
      });
    });
  });

  // Native cursor must stay visible over text and form controls.
  $$('input, textarea, select, [contenteditable]').forEach((el) => {
    el.addEventListener('mouseenter', () => { document.body.classList.remove('has-custom-cursor'); });
    el.addEventListener('mouseleave', () => { document.body.classList.add('has-custom-cursor'); });
  });
})();

/* -- Config-driven WhatsApp links ------------------------------------------
   Every wa.me link in the markup already works standalone (no-JS), built
   from the same phone numbers and prefill text as CONTACT below. This pass
   only keeps them in sync with config.js if the owner edits the prefill
   text or a phone number there — the mineral-specific suffix already
   present in each link's `text` param is preserved. */

(function syncWhatsAppLinks() {
  const knownNumbers = [CONTACT.office, ...CONTACT.people.map((p) => p.phone)];

  $$('[data-wa-link]').forEach((a) => {
    const url = new URL(a.href);
    const digits = url.pathname.replace('/', '');
    if (!knownNumbers.some((n) => n.replace('+', '') === digits)) return;

    const currentText = decodeURIComponent(url.search.replace('?text=', ''));
    const suffix = currentText.startsWith(CONTACT.whatsappPrefill)
      ? currentText.slice(CONTACT.whatsappPrefill.length)
      : '';

    url.search = `?text=${encodeURIComponent(CONTACT.whatsappPrefill + suffix)}`;
    a.href = url.toString();
  });
})();
