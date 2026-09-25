# BBC MINES — Agent Guide

Project: BBC MINES marketing website
Platform: Static HTML/CSS/JS (no framework, no build step)
Document Role: Technical operating manual for AI coding agents
Last Verified: 2026-09-25
Verified Against: branch `claude/kind-davinci-rztkgw` (client logos change)
Current Version Name: Not applicable (no version scheme in this repo)
Current Version Code/Build: Not applicable
Status: Active

CodeDoc accelerates orientation. Current source must still be inspected before making changes.

---

## 1. Project Snapshot

BBC MINES is the two-page marketing site for BBC Mines, an industrial-minerals
mining and supply company based in Merta City, Nagaur, Rajasthan, India. The
site is a **zero-dependency static build**: plain HTML, one CSS file, and
vanilla JS ES modules. There is no `package.json`, no bundler, no framework,
and no build step — the repo is served as-is from any static host.

- **Pages:** `index.html` (Home), `products.html` (Products)
- **Languages:** HTML5, CSS3, JavaScript (ES modules, browser-native, no transpilation)
- **External runtime libraries (CDN, `defer`):** GSAP 3.13.0, GSAP ScrollTrigger, GSAP SplitText, Lenis 1.1.18 — all loaded via `<script>` tags in `<head>`, not npm
- **Fonts (CDN):** Fraunces + IBM Plex Mono (Google Fonts), Switzer (Fontshare)
- **Domain:** `bbcmines.com` (set via `CNAME`)
- **Build system:** None. Editing a file and deploying it *is* the build.
- **Design/copy spec:** `BLUEPRINT.md` — a 950+ line, section-numbered build
  spec that is the origin of every design token, copy block, and behavioral
  rule in the site. Treat it as authoritative for *intent*; treat the current
  HTML/CSS/JS as authoritative for *current behavior* when the two disagree.

## 2. Agent Golden Rules

- **Read `BLUEPRINT.md` before changing design, copy, or motion behavior.**
  It encodes deliberate decisions (color values, easing curves, section
  order, what was cut and why) that are easy to accidentally regress.
- **Never hardcode a media URL or PDF link in HTML.** Every image and report
  link must be added to `assets/js/config.js` and referenced via
  `data-media-key` / `data-doc-panel` attributes. This is a hard rule stated
  in `BLUEPRINT.md` §0 and enforced by convention throughout the codebase.
- **Never invent a business fact.** Chemical assay values, lease counts,
  client names, export markets, MOQ, payment terms, etc. are unknown. They
  render as visible `[TBC]` (products.html, 65 instances) or `[CONFIRM: ...]`
  (index.html, 2 instances; products.html, 18 instances). Do not replace a
  placeholder with a plausible-looking number — only the site owner can
  supply real values.
- **Internal lab report codes (e.g. `RD2`, `KM42`, `JKD`) must never appear
  in public-facing text, filenames, or commit messages.**
- **The site must work with JavaScript fully disabled.** `index.html` and
  `products.html` are complete, readable documents on their own; `app.js`
  and `motion.js` only enhance them. Never move content that JS renders
  into the only source of truth — static HTML stays the baseline.
- **Motion must fully respect `prefers-reduced-motion`.** All GSAP/Lenis
  code in `motion.js` runs inside a single `gsap.matchMedia()` branch gated
  on `(prefers-reduced-motion: no-preference)`. Do not add motion code
  outside that branch.
- **`motion.js` must degrade to a no-op if the GSAP CDN fails.** It checks
  `typeof window.gsap === 'undefined'` at the top and returns early.
  `app.js` has no GSAP dependency at all and must keep working independently.
- **Smallest viable diff.** This is a small, hand-curated codebase (three JS
  files, one CSS file, two HTML pages). Do not introduce a bundler, a
  framework, or a package manager unless explicitly asked.

## 3. Architecture at a Glance

```
Page load
→ static HTML renders immediately (placeholders visible if config is empty)
→ CSS applies final visual state (motion.js has nothing to do yet)
→ app.js runs (no external deps): nav, header, WhatsApp FAB, scrollspy,
  config-driven media/marquee/doc-panel rendering, custom cursor
→ GSAP/ScrollTrigger/SplitText/Lenis load (CDN, deferred)
→ motion.js runs: if GSAP loaded AND prefers-reduced-motion allows it,
  registers preloader, Lenis smooth scroll, line reveals, image reveals,
  parallax, pinned hero, horizontal mineral gallery, magnetic CTAs
```

Data flow for anything visual/downloadable:

```
assets/js/config.js (MEDIA / CLIENTS / REPORTS / CONTACT)
→ imported by app.js
→ app.js queries DOM elements carrying data-media-key / data-doc-panel /
  data-clients-* attributes
→ app.js injects <img> tags, marquee tracks, or documentation panel markup
→ empty config values render pre-built CSS/HTML fallbacks (placeholder
  wash, "on request" link, hidden marquee) — never a broken image/link
```

## 4. Project / File Map

| Area | Primary Files | Responsibility | Risk/Notes |
| --- | --- | --- | --- |
| Design/copy spec | `BLUEPRINT.md` | Source of truth for all design tokens, copy, motion spec, SEO targets, file structure | Read before any visual/copy change |
| Home page markup | `index.html` | All Home sections: hero, ticker, statement, minerals gallery, leases, applications, clients, about, docs teaser, contact, footer | Contains 2 `[CONFIRM:...]` placeholders (leases §6.6, export markets §6.9) |
| Products page markup | `products.html` | Products hero, sticky mineral rail, 4 mineral spec blocks (feldspar has 2 sub-blocks), FAQ, enquiry band | Contains 65 `[TBC]` (chemical/physical values) and 18 `[CONFIRM]` (FAQ, packaging) — do not fill with guessed values |
| Data layer | `assets/js/config.js` | **Single source of truth** for every media URL, PDF link, client logo, and contact detail | The only file allowed to contain a media/PDF path |
| Non-motion behavior | `assets/js/app.js` | Mobile nav, sticky/hiding header, WhatsApp FAB visibility, mineral-rail scrollspy, config-driven `<img>`/marquee/doc-panel rendering, custom cursor, WhatsApp link sync | No GSAP dependency — must work if the GSAP CDN is blocked |
| Motion | `assets/js/motion.js` | Preloader, Lenis smooth scroll, SplitText line reveals, image clip-path reveals, parallax, pinned hero, horizontal mineral gallery, magnetic CTAs, section-rule draw-ins | All registered inside one `prefers-reduced-motion: no-preference` matchMedia branch; no-ops if GSAP fails to load |
| Styling | `assets/css/site.css` | The single stylesheet (1431 lines), sectioned with an explicit TOC comment at the top (26 numbered sections) | One file by design (no build step ⇒ no `@import`/bundling); keep the TOC in sync if adding a section |
| Media assets | `assets/img/` | Photography referenced from `config.js`; client logo SVGs live in `assets/img/clients/` | Contains orphaned files not referenced anywhere: `Hero.jpg` (6.8MB, capitalized, unused), `hero.jpg` (unused — `hero2.jpg` is the live hero), `feldspar.png` (unused — `feldspar.jpg` is live) |
| Report PDFs | `assets/reports/` | Technical data sheets, referenced from `config.js` `REPORTS` | Currently empty except `README.txt` — no PDFs uploaded yet, so every documentation panel renders "on request" |
| Brand assets | `assets/brand/` | `logo.svg`, `og-image.jpg` | — |
| SEO/deploy config | `robots.txt`, `sitemap.xml`, `_redirects`, `CNAME` | Crawling, 2-URL sitemap, redirect-map stub, custom domain binding | `_redirects` is an unfilled TODO stub (see §7 below) |

Do NOT list every file when orienting — this table is the map. If a change
touches media, links, or contact info, it belongs in `config.js`, not HTML.

## 5. System Ownership / Sources of Truth

| Concern | Owner | Main Consumers | Do Not Duplicate In |
| --- | --- | --- | --- |
| Media URLs (hero, mineral macros, leases photo) | `MEDIA` object in `config.js` | `app.js` (`data-media-key` rendering) | HTML `<img src>`, inline styles |
| PDF/report links | `REPORTS` object in `config.js` | `app.js` (`data-doc-panel` rendering) | HTML |
| Client logos | `CLIENTS` array in `config.js` | `app.js` (`clientsMarquee`: static row or marquee) | HTML |
| Contact details (phones, emails, address, WhatsApp prefill) | `CONTACT` object in `config.js` | `app.js` (`syncWhatsAppLinks`), structured data in both HTML `<head>`s | Any hardcoded phone/email outside `config.js` and the JSON-LD blocks |
| Design tokens (color, type scale, spacing, radius) | CSS custom properties in `site.css` §01 | Every selector in `site.css` | Inline styles, other stylesheets |
| Motion timing/easing constants | `EASE` / `DUR` objects in `motion.js` | All `motion.js` functions | `app.js` (has no motion) |
| Page `<h1>`/meta/JSON-LD | Each page's own `<head>` | Search engines, social previews | — (each page owns its own; `CONTACT` values must still match) |

**Note:** `CONTACT` in `config.js` and the JSON-LD `contactPoint` blocks
embedded in `index.html`'s `<head>` currently hold the same phone numbers
independently — a contact change requires updating both.

## 6. Feature Architecture

### Config-driven media (`app.js`)
- Purpose: swap CSS-only image placeholders for real `<img>` tags without
  editing HTML.
- Files: `assets/js/config.js` (data), `assets/js/app.js` (`resolvePath` +
  the `data-media-key` loop), `assets/css/site.css` §06 (placeholder wash).
- Flow: any element with `data-media-key="mineral.chinaClay"` (dot-path into
  `MEDIA`) gets an `<img>` prepended if `MEDIA.mineral.chinaClay.src` is
  non-empty; otherwise the CSS placeholder wash stays visible.
- Edge case: hero images get `fetchpriority="high"` and `loading="eager"`;
  everything else lazy-loads.

### Config-driven documentation panels (`app.js`)
- Purpose: render a "Technical Data Sheet" download button (plus an
  `additional analyses` `<details>` disclosure) once real PDFs exist, or
  leave the static "on request" fallback already baked into the HTML.
- Files: `config.js` `REPORTS`, `app.js` (`data-doc-panel` loop),
  `products.html` (5 `data-doc-panel` slots: `chinaClay`, `ballClay`,
  `potashFeldspar`, `sodaFeldspar`, `quartz`).
- Current state: all 5 `REPORTS` entries have `primary: null` — every
  panel is currently showing the "on request" fallback.

### Client logos (`app.js`)
- Purpose: show client brands on Home (`#clients`).
- Files: `config.js` `CLIENTS`, `app.js` (`clientsMarquee`), `site.css` §14,
  logo files in `assets/img/clients/` (`kajaria.svg`, `simpolo.svg`,
  `varmora.svg`).
- Rule: 0 entries → `data-clients-empty` note; 1–3 entries (or
  reduced motion) → static centred row (`data-clients-grid`, flex, wraps on
  mobile); 4+ entries → two counter-directional marquee rows (fewer than 4
  can't fill a seamless loop on wide screens). The empty note and the row
  are both `hidden` in static HTML, so with JS disabled the section shows
  only its heading and lead copy.
- Current state: 3 clients (Kajaria, Simpolo, Varmora) → static row.
- Styling: logos are SVGs in brand colour; `.client-logo` flattens them to
  an ink silhouette (`filter: brightness(0)`, `opacity: 0.5`) at rest and
  restores full colour on hover/focus. New logos should be transparent-
  background SVGs (or PNGs) with no baked-in coloured box, or the
  silhouette will render as a solid block.
- `url` is optional: empty → logo renders as a `<span>`, not a dead `#` link.
- Marquee duplicates (second copy in each track, all of row B) are
  `aria-hidden` so each client is announced once.

### Reduced-motion contract (`motion.js`)
- Purpose: full parity between the animated experience and a fully static
  one for users who set `prefers-reduced-motion: reduce`.
- Everything in `motion.js` after the `gsap.matchMedia()` call is scoped to
  the `no-preference` branch. Final visible states are set in CSS, not JS,
  so a failed CDN or reduced-motion preference never hides content.

### WhatsApp enquiry flow
- Purpose: the site's only conversion path (no contact form by design —
  see `BLUEPRINT.md` §1).
- Files: `config.js` `CONTACT.whatsappPrefill`/`people`/`office`, HTML
  `data-wa-link` anchors (pre-built `wa.me/<number>?text=...` links, work
  without JS), `app.js` (`syncWhatsAppLinks` keeps the prefill text and
  known numbers in sync with `config.js` if edited), `site.css` §19
  (floating WhatsApp FAB).

## 7. Data Sources & External Systems

| System | Technology | Supplies | Persistence/Fallback | Notes |
| --- | --- | --- | --- | --- |
| GSAP + plugins | CDN script (`cdn.jsdelivr.net`) | Scroll-driven motion | No-op if CDN unreachable (`motion.js` returns early) | Pinned at `3.13.0` |
| Lenis | CDN script | Smooth scroll | Skipped if `window.Lenis` undefined | Pinned at `1.1.18`; `syncTouch: false` so touch devices use native scroll |
| Google Fonts / Fontshare | CDN stylesheet | Fraunces, IBM Plex Mono, Switzer | Falls back to system font stack if unreachable | `font-display: swap` |
| WhatsApp (`wa.me`) | Static link, no API | Primary enquiry channel | N/A — plain links, no JS required | Numbers/prefill text from `config.js` `CONTACT` |
| Google Maps | Static link (currently empty) | Address link in Contact section | `CONTACT.maps` is `''` — link target is unset | Owner-supplied `[CONFIRM]` item |
| Netlify/Cloudflare Pages redirects | `_redirects` file | 301 migration map from the old live site | File is a TODO stub with **zero entries** | Needs a crawl of the existing `bbcmines.com` per `BLUEPRINT.md` §9.6 |
| GitHub Pages (inferred) | `CNAME` file | Custom domain binding for `bbcmines.com` | UNVERIFIED — no `.github/workflows` found in this repo, so the actual deploy mechanism could not be confirmed from source | Could not confirm from current repository |

There is no database, no backend API, and no authentication anywhere in
this project — it is a fully static, client-rendered-enhancement site.

## 8. Settings / Configuration Contract

| Setting | Symbol/Key | Default | Effective Behavior | Persistence |
| --- | --- | --- | --- | --- |
| Hero/mineral/lease images | `MEDIA.*.src` in `config.js` | Filled with real filenames under `assets/img/` | Non-empty → real `<img>`; empty → CSS placeholder | File-based (git) |
| Client logos | `CLIENTS` array | 3 entries (Kajaria, Simpolo, Varmora) | 0 → empty note; 1–3 → static row; 4+ → marquee | File-based |
| Report/PDF links | `REPORTS.<mineral>` | All `{ primary: null, additional: [] }` | `null` primary → "Documentation available on request" WhatsApp link instead of a download button | File-based |
| Contact info | `CONTACT` | Real phone numbers/emails/address filled in; `maps: ''` | Drives `tel:`/`wa.me` links and WhatsApp prefill text sitewide | File-based |
| Motion | `prefers-reduced-motion` OS/browser setting | Browser default (usually `no-preference`) | Gates all of `motion.js`; `no-preference` → full animated experience, `reduce` → static final states + static client grid | Not app-persisted (reads live OS/browser media query each load) |
| Preloader skip | `sessionStorage['bbc-preloaded']` | Unset on first visit | Preloader animation plays once per browser session, then is skipped on subsequent navigations | `sessionStorage` (survives in-tab navigation, cleared on tab close) |
| Effective vs. stored: | — | — | A blank `MEDIA.*.src`/`REPORTS.*.primary` is a **deliberate stored state** (real assets not yet supplied), not a bug — the fallback rendering is the currently correct effective behavior. | — |

## 9. State / Persistence / Cache Model

- **No client-side database, no localStorage-backed app state, no cache
  layer.** The only browser storage used is `sessionStorage['bbc-preloaded']`
  (`motion.js`), which:
  - Survives in-page navigation within the same tab/session.
  - Does **not** survive a new tab or browser restart (session-scoped).
  - Has no server counterpart; purely a "don't replay the intro animation"
    flag.
- All other "state" (which images show, which reports are downloadable,
  which contact numbers are live) is **build-time state**: it lives in
  `assets/js/config.js` and changes only when that file is edited and
  redeployed. There is no runtime data fetching.

## 10. Critical Runtime Architecture

**Scroll-pinned motion sequencing (`motion.js`)** is the one genuinely
fragile system in this codebase:

- The pinned hero (`initPinnedHero`) and the horizontal mineral gallery
  (`initHorizontalGallery`) both use `ScrollTrigger` with `pin: true` and
  `scrub`. Pin-based ScrollTrigger sequences are sensitive to layout shifts
  — anything that changes element height/width after the trigger is created
  (e.g. late-loading fonts, images without explicit `width`/`height`) can
  desync the pin.
- The horizontal gallery is further gated inside its own
  `gsap.matchMedia('(min-width: 900px)')` branch — below 900px it is
  intentionally *not* pinned and instead relies on CSS
  `scroll-snap-type: x mandatory` (native carousel). Do not try to force
  the pinned version below that breakpoint (explicitly called out as a
  known trap in `BLUEPRINT.md` §5.4.7).
- `SplitText` line reveals re-split on a debounced `resize` listener
  (250ms) specifically because un-resplit lines break mid-animation on
  viewport changes — if you touch `initLineReveals()`, preserve the
  resplit-on-resize behavior.
- Ownership boundary: `motion.js` never creates content, only animates
  what `app.js`/HTML already rendered. If a future change needs new
  animated content, add the static markup/behavior in HTML/`app.js` first,
  then animate it from `motion.js`.

## 11. Reliability / Fallback Contracts

- **No JS → still a complete site.** All copy, structure, and navigation
  are in the static HTML. `app.js`/`motion.js` only add interactivity and
  motion.
- **GSAP CDN down → `motion.js` no-ops entirely**, page still fully usable
  (per `typeof window.gsap === 'undefined'` guard at the top of the file).
- **`prefers-reduced-motion: reduce` → zero Lenis, zero pins, zero
  parallax.** Content sits at final CSS-defined states. The static client
  row replaces the marquee.
- **Empty `config.js` values never produce a broken UI element:** empty
  image `src` → placeholder wash (never a broken-image icon); `null` report
  → "on request" WhatsApp link (never a dead download button); empty
  `CLIENTS` → "roster pending" note; 1–3 clients → static row (never a
  marquee loop too short to be seamless).
- **No retry/backoff logic exists** because the site makes no network calls
  beyond static asset and CDN fetches.

## 12. Build Variants / Environments

No variants or environments exist in this project. There is one build
(the checked-out source itself, served as-is) and no environment-specific
configuration, flags, or `.env` files.

## 13. Build / Test Commands

There is no package manager, build tool, or test suite in this repository.

```bash
# Preview locally — any static file server works, e.g.:
python3 -m http.server 8000
# then open http://localhost:8000/index.html

# No install step, no build step, no test command exist.
```

Manual verification checklist (from `BLUEPRINT.md` §13, still relevant when
changing this site): JavaScript-disabled readability, `prefers-reduced-motion`
parity, keyboard navigation (focus never trapped in the pinned gallery),
Lighthouse Performance ≥95 / Accessibility 100 / SEO 100.

## 14. Release / Distribution Rules

- **Version source:** none — there is no version number anywhere in this
  project (no `package.json`, no version meta tag).
- **Production artifact:** the repository itself; there is no build output
  directory. Whatever is committed to the deployed branch is what serves.
- **Domain binding:** `CNAME` file at repo root pins the custom domain
  `bbcmines.com`.
- **Deployment mechanism:** UNVERIFIED. The presence of `CNAME` suggests
  GitHub Pages; the presence of `_redirects` suggests Netlify or Cloudflare
  Pages. No `.github/workflows/` directory exists in this repo, so the
  actual deploy trigger could not be confirmed from source — ask the owner
  or check the hosting provider's dashboard before assuming either.
- **Migration note:** `bbcmines.com` is described in `BLUEPRINT.md` §9.6 as
  a *live, existing site being replaced* by this build. The `_redirects`
  file is a **TODO stub with no entries** — do not treat the current
  `_redirects` as a completed migration map.
- No signing, no secrets, no credentials are present in this repository.

## 15. High-Risk / Frozen Areas

| System | Why High Risk | Modification Rule |
| --- | --- | --- |
| `assets/js/config.js` contact/media/report contract | Every other file assumes this exact shape (`MEDIA`, `CLIENTS`, `REPORTS`, `CONTACT`) and these exact key names (`chinaClay`, `ballClay`, `potashFeldspar`, `sodaFeldspar`, `quartz`) | Do not rename keys without updating every `data-media-key`/`data-doc-panel` reference in both HTML files |
| Pinned ScrollTrigger sequences (hero, horizontal gallery) in `motion.js` | Easy to desync via layout shift; the 900px breakpoint split between pinned/carousel is deliberate | Test both above and below 900px, and with `prefers-reduced-motion: reduce`, after any change |
| `[TBC]` / `[CONFIRM]` placeholders in `products.html`/`index.html` | Represent real, currently-unknown business facts (chemical assays, lease counts, MOQ, etc.) | Never replace with a guessed or "typical industry" value — this is explicitly called out in `BLUEPRINT.md` §7.3 as a commercial liability risk |
| Design tokens in `site.css` §01 (color contrast values) | Contrast ratios are pre-verified against WCAG AA (documented in `BLUEPRINT.md` §4.1) | Do not substitute color values without re-verifying contrast |

## 16. Legacy / Dead / Dormant Systems

| System | Status | Why It Exists | Can It Be Removed? |
| --- | --- | --- | --- |
| `assets/img/Hero.jpg` (6.8MB, capitalized filename) | DEAD | Orphaned upload; not referenced by `config.js` or any HTML/CSS | Yes, once confirmed unneeded — large unused binary in the repo |
| `assets/img/hero.jpg` | DEAD | Superseded by `hero2.jpg`, which is the value currently set in `MEDIA.hero.src` | Yes, if confirmed unneeded |
| `assets/img/feldspar.png` | DEAD | Superseded by `feldspar.jpg`, which is the value currently set in `MEDIA.mineral.feldspar.src` | Yes, if confirmed unneeded |
| `_redirects` migration map | DORMANT | Stub created per `BLUEPRINT.md` §9.6, waiting on a crawl of the old live site that has not happened yet | No — needed before cutover replaces the live `bbcmines.com` |
| `CLIENTS` marquee (4+ logos) | DORMANT | Built and functional, but only 3 clients are configured, so the static row renders instead | No — activates automatically at 4+ logos |
| `REPORTS` documentation panels | DORMANT | Built and functional, but every entry is `null` pending renamed PDFs in `assets/reports/` | No — intended pre-launch state |
| GSAP/Lenis CDN motion layer | CURRENT | Active, primary interaction layer per `BLUEPRINT.md` §5 | N/A |

## 17. Known Architectural Limitations

- **Single CSS file (1431 lines) by design** — there is no CSS build step,
  so splitting it would add extra blocking requests rather than reduce
  them. Keep using the numbered TOC comment block at the top when adding
  sections.
- **No automated tests of any kind.** All verification is manual (browser,
  Lighthouse, keyboard, reduced-motion toggle).
- **Deploy mechanism is unconfirmed from source** (see §14) — changes that
  depend on a specific host's behavior (e.g. `_redirects` semantics) should
  be validated against whichever host is actually in use.
- **Two independent copies of contact/JSON-LD data**: `CONTACT` in
  `config.js` and the `contactPoint` block in each HTML `<head>`'s JSON-LD
  are not programmatically linked — both must be updated by hand together.

## 18. Agent Change Checklist

Before editing:
- Identify whether the change is design/copy (check `BLUEPRINT.md` first),
  data (`config.js`), behavior (`app.js`), motion (`motion.js`), or styling
  (`site.css`).
- If touching `config.js`, check every `data-media-key`/`data-doc-panel`
  consumer in both HTML files.
- If touching motion, check both the `>=900px` and `<900px` gallery paths
  and the reduced-motion branch.

After editing:
- Load the affected page in a browser with JS enabled and disabled.
- Toggle `prefers-reduced-motion: reduce` (DevTools rendering emulation) and
  re-check.
- Verify no new media/PDF path was hardcoded outside `config.js`.
- Verify no `[TBC]`/`[CONFIRM]` placeholder was replaced with a guessed
  value.
- Update `CodeDoc/history.md` (and `agent.md`/`human.md` if the change is
  architectural or user-visible) per the maintenance contract in §19.

## 19. Documentation Maintenance Contract

Update `agent.md` when: architecture changes, file/system ownership
changes, important file locations move, the build/deploy story changes, or
a persistence/config contract changes (e.g. new `config.js` top-level key).

Do NOT update it for trivial visual tweaks, copy edits within existing
placeholders, or routine asset swaps that don't change the config contract.
