/* ==========================================================================
   BBC MINES — motion.js
   GSAP / ScrollTrigger / SplitText / Lenis. Everything here registers only
   inside the `(prefers-reduced-motion: no-preference)` matchMedia branch —
   see BLUEPRINT.md §5.3. Outside it, content sits at the final visible
   state already set by site.css; nothing in this file may be required for
   a section to be readable.

   If the GSAP CDN fails to load, `window.gsap` is undefined and this whole
   file is a no-op — the page underneath is already a complete document.
   ========================================================================== */

const EASE = { out: 'expo.out', inOut: 'power3.inOut', soft: 'power2.out' };
const DUR = { fast: 0.4, base: 0.8, slow: 1.2, reveal: 1.4 };

function whenReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

whenReady(() => {
  if (typeof window.gsap === 'undefined') return;

  const gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(window.SplitText);

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const cleanups = [];

    cleanups.push(initPreloader());
    const lenis = initLenis();
    cleanups.push(initLineReveals());
    cleanups.push(initImageReveals());
    cleanups.push(initParallax());
    cleanups.push(initSectionRules());
    if (document.querySelector('[data-hero]')) cleanups.push(initPinnedHero());
    if (document.querySelector('[data-gallery]')) cleanups.push(initHorizontalGallery());
    cleanups.push(initMagneticCTAs());

    return () => {
      lenis?.destroy();
      cleanups.forEach((fn) => typeof fn === 'function' && fn());
    };
  });

  /* -- 1. Preloader ------------------------------------------------------- */

  function initPreloader() {
    if (sessionStorage.getItem('bbc-preloaded')) return () => {};

    const overlay = document.createElement('div');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText = `
      position:fixed; inset:0; z-index:1000; background:var(--bone);
      display:flex; align-items:center; justify-content:center;
    `;
    const rule = document.createElement('div');
    rule.style.cssText = 'position:absolute; top:0; left:0; height:1px; width:0; background:var(--ochre);';
    const word = document.createElement('div');
    word.textContent = 'BBC MINES';
    word.style.cssText = `
      font-family:var(--f-mono); letter-spacing:0.2em; font-size:1rem;
      overflow:hidden; clip-path:inset(0 100% 0 0);
    `;
    overlay.append(rule, word);
    document.body.appendChild(overlay);

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('bbc-preloaded', '1');
        overlay.remove();
      },
    });
    tl.to(rule, { width: '100%', duration: 0.6, ease: EASE.inOut })
      .to(word, { clipPath: 'inset(0 0% 0 0)', duration: 0.5, ease: EASE.out }, '-=0.2')
      .to(overlay, { yPercent: -100, duration: 0.6, ease: EASE.inOut, delay: 0.15 });

    // Hard cap regardless of load state.
    gsap.delayedCall(1.5, () => { if (overlay.isConnected) tl.progress(1); });

    return () => overlay.remove();
  }

  /* -- 2. Lenis smooth scroll ---------------------------------------------- */

  function initLenis() {
    if (typeof window.Lenis === 'undefined') return null;

    const lenis = new window.Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      syncTouch: false,
    });

    lenis.on('scroll', () => window.ScrollTrigger && window.ScrollTrigger.update());

    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return lenis;
  }

  /* -- 4. Line reveals ------------------------------------------------------ */

  function initLineReveals() {
    if (!window.SplitText) return () => {};
    const splits = [];
    const triggers = [];

    function split() {
      splits.forEach((s) => s.revert());
      splits.length = 0;

      document.querySelectorAll('.reveal-lines').forEach((el) => {
        const s = new window.SplitText(el, { type: 'lines', linesClass: 'line' });
        s.lines.forEach((line) => {
          line.style.overflow = 'hidden';
          const inner = document.createElement('span');
          inner.className = 'line-inner';
          inner.style.display = 'inline-block';
          while (line.firstChild) inner.appendChild(line.firstChild);
          line.appendChild(inner);
        });
        splits.push(s);

        const inners = s.lines.map((l) => l.querySelector('.line-inner'));
        gsap.set(inners, { yPercent: 110 });

        const trigger = gsap.to(inners, {
          yPercent: 0,
          duration: DUR.slow,
          ease: EASE.out,
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
        triggers.push(trigger);
      });
    }

    split();

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(split, 250);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      triggers.forEach((t) => t.scrollTrigger && t.scrollTrigger.kill());
      splits.forEach((s) => s.revert());
    };
  }

  /* -- 5. Image reveals ------------------------------------------------------ */

  function initImageReveals() {
    const triggers = [];
    document.querySelectorAll('.frame').forEach((frame) => {
      if (frame.closest('[data-hero]')) return; // hero handled by the pin timeline

      gsap.set(frame, { clipPath: 'inset(0 0 100% 0)' });
      const img = frame.querySelector('img');
      if (img) gsap.set(img, { scale: 1.2, transformOrigin: 'center' });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: frame, start: 'top 88%' },
      });
      tl.to(frame, { clipPath: 'inset(0 0 0% 0)', duration: DUR.reveal, ease: EASE.inOut });
      if (img) tl.to(img, { scale: 1, duration: DUR.reveal, ease: EASE.inOut }, '<');

      triggers.push(tl);
    });

    return () => triggers.forEach((t) => t.scrollTrigger && t.scrollTrigger.kill());
  }

  /* -- 6. Parallax ------------------------------------------------------------ */

  function initParallax() {
    const triggers = [];
    document.querySelectorAll('.frame img').forEach((img) => {
      if (img.closest('[data-hero]')) return;
      gsap.set(img, { scale: 1.12 });
      const tween = gsap.to(img, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: img.closest('.frame'), start: 'top bottom', end: 'bottom top', scrub: true },
      });
      triggers.push(tween);
    });
    return () => triggers.forEach((t) => t.scrollTrigger && t.scrollTrigger.kill());
  }

  /* -- 13. Section rules -------------------------------------------------------- */

  function initSectionRules() {
    const triggers = [];
    document.querySelectorAll('hr, .footer-rule').forEach((rule) => {
      gsap.set(rule, { scaleX: 0, transformOrigin: 'left' });
      const tween = gsap.to(rule, {
        scaleX: 1,
        duration: DUR.base,
        ease: EASE.out,
        scrollTrigger: { trigger: rule, start: 'top 90%' },
      });
      triggers.push(tween);
    });
    return () => triggers.forEach((t) => t.scrollTrigger && t.scrollTrigger.kill());
  }

  /* -- 3. Pinned hero ------------------------------------------------------------ */

  function initPinnedHero() {
    const hero = document.querySelector('[data-hero]');
    const frame = hero.querySelector('.frame');
    const img = frame?.querySelector('img');
    const display = hero.querySelector('.hero__display');
    const index = hero.querySelector('.hero-index');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=60%',
        scrub: 1,
        pin: true,
      },
    });

    if (img) tl.fromTo(img, { scale: 1.15 }, { scale: 1, ease: 'none' }, 0);
    tl.fromTo(frame, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(6% 6% 6% 6%)', ease: 'none' }, 0);
    tl.fromTo(display, { scale: 1 }, { scale: 0.78, transformOrigin: 'left bottom', ease: 'none' }, 0);
    if (index) tl.fromTo(index, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, ease: 'none' }, 0.5);

    return () => tl.scrollTrigger && tl.scrollTrigger.kill();
  }

  /* -- 7. Horizontal mineral gallery ---------------------------------------------- */

  function initHorizontalGallery() {
    let trigger;

    mm.add('(min-width: 900px)', () => {
      const section = document.querySelector('[data-gallery]');
      const track = document.querySelector('[data-gallery-track]');
      if (!section || !track) return () => {};

      const distance = () => track.scrollWidth - window.innerWidth;

      trigger = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      return () => trigger.scrollTrigger && trigger.scrollTrigger.kill();
    });

    return () => trigger?.scrollTrigger && trigger.scrollTrigger.kill();
  }

  /* -- 10. Magnetic CTAs -------------------------------------------------------------- */

  function initMagneticCTAs() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};

    const radius = 80;
    const listeners = [];

    document.querySelectorAll('.btn--primary').forEach((btn) => {
      function onMove(e) {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > radius) return;
        const strength = 1 - dist / radius;
        gsap.to(btn, { x: dx * 0.3 * strength, y: dy * 0.3 * strength, duration: 0.3, ease: EASE.soft });
      }
      function onLeave() {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      }
      document.addEventListener('mousemove', onMove);
      btn.addEventListener('mouseleave', onLeave);
      listeners.push(() => document.removeEventListener('mousemove', onMove));
    });

    return () => listeners.forEach((fn) => fn());
  }
});
