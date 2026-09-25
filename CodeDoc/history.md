# BBC MINES — Project History

Project: BBC MINES marketing website
Platform: Static HTML/CSS/JS
Document Role: Chronological project memory (decisions, changes, releases)
Last Verified: 2026-09-25
Verified Against: branch `claude/kind-davinci-rztkgw`, commit `dec6069`
Current Version Name: Not applicable
Current Version Code/Build: Not applicable
Status: Active

## How To Read This File

- Newest entries first.
- Only meaningful changes are recorded (architecture, features, content
  milestones, decisions) — not every commit.
- Current architecture lives in `CodeDoc/agent.md`.
- Current product behavior lives in `CodeDoc/human.md`.
- This file explains how and why the current state evolved.
- Reconstructed from `git log` (20 commits total, all timestamps from git
  commit metadata) — no dates are invented.

## Current Milestone

Current state (as of 2026-09-24): the two-page static site is fully built
and structurally complete, with real photography in place for the hero,
all four minerals, and the leases section. It is not yet launch-ready — key
factual content (chemical assays, lease count, client names, export
markets, FAQ answers, PDF data sheets, client logos, Google Maps link, and
the old-site redirect map) is still placeholder or empty, pending input
from the site owner. The custom domain `bbcmines.com` has been bound via a
`CNAME` file, but no activity has been recorded since that domain binding.

## Timeline

### 2026-09-25 — Client logos added (Kajaria, Simpolo, Varmora)

**Area:** Home — `#clients` ("Who we supply")

**Changed**
- Added outlined vector SVG versions of three owner-supplied client logos
  in `assets/img/clients/` and listed them in `CLIENTS` in `config.js`.
- Changed the display rule in `app.js`: 0 logos → "roster pending" note,
  1–3 logos → static centred row, 4+ → marquee. It used to be "fewer than
  4 hides everything".
- Logos render as muted ink silhouettes at rest and switch to full brand
  colour on hover/focus.
- Fixed a CSS bug where `.clients-grid` was `display: none` even when
  unhidden, so the reduced-motion logo grid could never appear.
- Removed the `[CONFIRM: named clients…]` placeholder from the clients lead
  copy, because the owner has now named clients.

**Why**
- The owner supplied client logos. Three logos can't fill a seamless
  marquee on wide screens, so they show as a still row.

**Result**
- Home shows Kajaria, Simpolo and Varmora in one row. The marquee turns on
  automatically once a 4th logo is added. Logo `url`s are left empty
  (not confirmed), so the logos show without links.

**Files / Systems**
- `assets/img/clients/*.svg`, `assets/js/config.js`, `assets/js/app.js`,
  `assets/css/site.css` §14, `index.html`

**Verification**
- Headless Chromium at 1440px (normal and reduced motion) and 390px: all
  three logos load, the row wraps on mobile, hover shows colour, and there
  are no script errors.

**Status**
- IMPLEMENTED

---

### 2026-09-22 18:26 — Custom domain bound via CNAME

**Area:** Deployment/domain

**Changed**
- Added a `CNAME` file at the repo root containing `bbcmines.com`.

**Why**
- To bind the custom domain to whichever static host serves this
  repository (commonly a GitHub Pages convention).

**Result**
- The repository now declares its production domain. The actual hosting
  provider and deploy trigger are not otherwise recorded in this
  repository — see `CodeDoc/agent.md` §14.

**Files / Systems**
- `CNAME`

**Verification**
- Not applicable (config file only).

**Status**
- SHIPPED

---

### 2026-08-06 23:39–23:40 — Final hero image swapped in, config.js updated

**Area:** Home hero imagery

**Changed**
- Uploaded a new hero photo (originally named
  `ChatGPT Image Aug 6, 2026, 11_39_08 PM.jpg`), renamed it to `hero2.jpg`,
  and pointed `MEDIA.hero.src` in `config.js` at it.

**Why**
- Earlier hero candidates (`hero.jpg`, `Hero.jpg`) were superseded by a
  better/final macro shot.

**Result**
- `hero2.jpg` is the current live hero image. `hero.jpg` and `Hero.jpg`
  remain in `assets/img/` but are no longer referenced anywhere — see
  Legacy/Dead systems in `CodeDoc/agent.md` §16.

**Files / Systems**
- `assets/img/hero2.jpg`, `assets/js/config.js`

**Verification**
- Not recorded (manual content session).

**Status**
- SHIPPED

---

### 2026-08-06 23:05–23:14 — Real mineral, lease, and feldspar photography added

**Area:** Home + Products imagery

**Changed**
- Uploaded real macro photography for china clay (initially `ball.jpg`,
  renamed to `china.jpg`), ball clay (`ballc.jpg`), feldspar (initially
  `feldspar.png`, then superseded by `feldspar.jpg`), quartz
  (`quartz.jpg`), and the lease workings (`lease.jpg`).
- Updated `MEDIA` entries in `config.js` (`assets/js/config.js`, two
  successive edits) to point at the final filenames.

**Why**
- Replacing the CSS-only placeholder wash with real product/site
  photography, per the config-driven media contract set out in
  `BLUEPRINT.md` §8.

**Result**
- All four mineral panels and the leases section render real photos
  instead of placeholders. `feldspar.png` remains in `assets/img/` unused
  after `feldspar.jpg` became the live source.

**Files / Systems**
- `assets/img/china.jpg`, `assets/img/ballc.jpg`, `assets/img/feldspar.jpg`,
  `assets/img/quartz.jpg`, `assets/img/lease.jpg`, `assets/js/config.js`

**Verification**
- Not recorded (manual content session).

**Status**
- SHIPPED

---

### 2026-08-06 22:50–23:02 — Early hero image candidates uploaded and wired in

**Area:** Home hero imagery

**Changed**
- Uploaded `Hero.jpg` (6.8MB, capitalized filename) and then `hero.jpg`,
  updating `MEDIA.hero.src` in `config.js` twice ("Update hero image
  source", then "Fix image source for hero") to point at each in turn.

**Why**
- Iterating on the hero image before settling on the final version.

**Result**
- Superseded later the same evening by `hero2.jpg` (see above). Both files
  are now DEAD/unreferenced — see `CodeDoc/agent.md` §16.

**Files / Systems**
- `assets/img/Hero.jpg`, `assets/img/hero.jpg`, `assets/js/config.js`

**Verification**
- Not recorded.

**Status**
- SUPERSEDED

---

### 2026-08-06 17:29 — `_redirects` clean-URL rule removed

**Area:** Deployment config

**Changed**
- Removed a `/products` clean-URL rewrite rule (4 lines) from `_redirects`,
  leaving only the migration-redirect-map TODO stub described in
  `BLUEPRINT.md` §9.6.

**Why**
- Not recorded in the commit; the site's actual products page is served at
  `/products.html`, not a clean `/products` URL, so the rewrite rule likely
  conflicted with the site's real link structure (nav links point to
  `products.html` throughout both HTML files).

**Result**
- `_redirects` currently contains only the unfilled migration-redirect TODO
  header — zero live redirect rules.

**Files / Systems**
- `_redirects`

**Verification**
- Not recorded.

**Status**
- SHIPPED

---

### 2026-08-06 17:05 — Site moved from `bbc-mines/` subfolder to repo root

**Area:** Repository layout

**Changed**
- Moved every site file (HTML, `assets/`, `robots.txt`, `_redirects`,
  `BLUEPRINT.md`) out of a `bbc-mines/` subfolder to the repository root.

**Why**
- `BLUEPRINT.md` §1 originally specified a `bbc-mines/` subfolder location,
  but static hosting for a root-domain site (`bbcmines.com`) generally
  expects `index.html` at the repository root.

**Result**
- Current, correct layout: `index.html`, `products.html`, `assets/`, etc.
  all live directly at the repo root.

**Files / Systems**
- Whole-repo file move; no content changes.

**Verification**
- Not recorded.

**Status**
- SHIPPED

---

### 2026-08-06 17:01 — Initial site build per BLUEPRINT.md

**Area:** Whole project — initial implementation

**Changed**
- Built the entire two-page static site from the `BLUEPRINT.md` spec in one
  commit: `index.html`, `products.html`, `assets/css/site.css` (1431
  lines), `assets/js/config.js`, `assets/js/app.js`, `assets/js/motion.js`,
  `robots.txt`, `_redirects` (initial version), `assets/brand/logo.svg`,
  `assets/brand/og-image.jpg`, and README stub files in `assets/img/` and
  `assets/reports/`.

**Why**
- To implement the design/build specification already committed as
  `BLUEPRINT.md` — the "material is the brand" concept, the config-driven
  media/reports/contact data layer, the GSAP/Lenis motion system gated on
  `prefers-reduced-motion`, and the full section-by-section copy for both
  pages, all as specified in that document.

**Result**
- A working static site with all structure and copy in place, using CSS
  placeholder washes for every image slot and "on request" fallbacks for
  every report link (no real media/PDFs existed yet at this point).

**Files / Systems**
- Entire site (originally under `bbc-mines/`, later moved to root — see
  above)

**Verification**
- Not recorded (no automated tests exist in this project — see
  `CodeDoc/agent.md` §17).

**Status**
- IMPLEMENTED

---

### 2026-08-06 22:12 — BLUEPRINT.md committed

**Area:** Design/planning documentation

**Changed**
- Added `BLUEPRINT.md`, a ~993-line build specification covering
  positioning, information architecture, design system (color, type,
  grid), the full GSAP/Lenis motion spec, section-by-section copy for both
  pages, the `config.js` data contract, SEO/structured-data targets,
  performance/accessibility budgets, and file structure.

**Why**
- To lock every design and copy decision before implementation, per its
  own stated rule: "This is a build spec, not a mood board... Build what is
  written."

**Result**
- Became — and remains — the authoritative source for design intent on
  this project. The subsequent same-day commit ("Build BBC MINES site per
  BLUEPRINT.md") implemented it directly.

**Files / Systems**
- `BLUEPRINT.md`

**Verification**
- Not applicable (planning document).

**Status**
- SHIPPED

---

### Date Unknown — Historical Reconstruction: pre-repository site

`BLUEPRINT.md` §9.6 states that `bbcmines.com` was a **live, existing
site** at the time this rebuild began, and that the new build is a
*replacement*, not a first launch. No information about that prior site
(its structure, URLs, or technology) exists in this repository — the
`_redirects` migration map intended to preserve its SEO value via 301s has
never been filled in. This is recorded here only because it materially
affects how the current site should be launched (see `CodeDoc/agent.md`
§14, migration note).
