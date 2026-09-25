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

### 2026-09-25 — Remaining Products placeholders hidden

**Area:** Products page

**Changed**
- Removed the Physical properties lists (all `[TBC]`, 5 minerals incl. Potash/Soda Feldspar) and the unconfirmed Packaging & dispatch blocks (`[CONFIRM]`).

**Why**
- SEO plan: the live site should show no review placeholders; the packaging text was an unconfirmed claim.

**Result**
- Zero `[TBC]`/`[CONFIRM]` on either page. Re-add each block when the owner supplies real values.

**Files / Systems**
- `products.html`

**Verification**
- Headless Chromium 1440px + 390px: no placeholder text rendered, no script errors.

**Status**
- IMPLEMENTED

---

### 2026-09-25 — SEO plan implemented: brand-first metadata, schema, placeholder cleanup

**Area:** Sitewide — `<head>` metadata, JSON-LD, hero copy, Products FAQ/analysis tables, deploy config

**Changed**
- Home/Products `<title>`, `og:title`, `twitter:title` reworded brand-first ("BBC Mines | …" / "… | BBC Mines"), following a review of why bbcminesindia.com currently outranks bbcmines.com for the search "bbc mines".
- Fixed `og:site_name` and the header/footer wordmark's typed text from "BBC MINES" to "BBC Mines" sitewide. The uppercase display is CSS `text-transform` only, so nothing visible changed except `.footer-wordmark`, which gained `text-transform: uppercase` so it keeps its look now that its typed text is mixed-case.
- Home hero: moved the eyebrow ("BBC Mines &middot; Industrial minerals since 2005 &middot; Nagaur, Rajasthan") inside the `<h1>` as its first line, and removed the second keyword line (`.hero__tail`) that used to sit under the display line. The brand-first eyebrow plus a new entity-defining sentence in the Statement section now carry that keyword coverage instead. Removed the now-dead `.hero__tail` CSS.
- Added an entity-defining sentence to Home's Statement section — the exact sentence `BLUEPRINT.md` §9.4 specified for answer-engine optimisation but that had never actually been added to the page.
- Home JSON-LD: added `alternateName` (`"BBC MINES"`, `"bbcmines"`), `logo` and `image` to the `Organization` block, and added a separate `WebSite` schema block. Generated `assets/brand/logo.png` (512&times;512 PNG, rendered from the existing `logo.svg`) for the new `logo` field. Did not add `legalName` or any `sameAs` entries — both need the owner to confirm first.
- Removed the two visible `[CONFIRM]` spans on Home (lease count in `#leases`, export markets in `#about`), keeping the sentences they sat in.
- Products: replaced all five "Typical chemical analysis" tables (China Clay, Ball Clay, Potash Feldspar, Soda Feldspar, Quartz — 45 `[TBC]` cells) with a one-line "Typical analysis available on request" WhatsApp fallback, matching the pattern the documentation panels already used. Physical properties and packaging/dispatch placeholders were deliberately left as-is — not part of this pass.
- Products FAQ: trimmed both the visible accordion and the `FAQPage` JSON-LD from 8 questions to the one BBC Mines can currently answer ("Do you mine the material yourselves?"). The other 7 go back in once the owner answers them.
- `config.js`: rewrote `MEDIA.hero.alt` — it described "white kaolin clay" but `hero2.jpg` is actually an open-cast quarry photo (haul roads, a dump truck, terraced rock). The new alt text describes what the image shows without claiming it is one of BBC Mines' own leases, which is unconfirmed.
- `sitemap.xml`: added `<lastmod>2026-09-25</lastmod>` to both URLs.
- Added `_headers` (repo root) so Cloudflare Pages can `X-Robots-Tag: noindex` the `bbcmines.pages.dev` copy, which was otherwise indexable and competing with the custom domain.

**Why**
- bbcmines.com currently ranks #2 for "bbc mines" behind bbcminesindia.com, which appears to own the address's unclaimed Google Business listing. This pass covers everything in the fix that is actually code: brand-first metadata/schema, and placeholder cleanup now that the site is live rather than pre-launch — a deliberate, narrow reversal of `BLUEPRINT.md`'s original "ship placeholders visibly" rule, which was written for pre-launch review, not for content the public and Google now see.

**Result**
- Both pages carry consistent "BBC Mines" branding in titles, OG/Twitter tags and JSON-LD, with `WebSite` schema and an extended `Organization` block. Products no longer shows unanswered placeholders in its FAQ or chemical analysis tables. A headless-browser pass (Playwright, against the repo's pinned Chromium build) confirmed both pages render with zero console/page errors at desktop and mobile widths, and that the pinned-hero motion in `motion.js` still targets the right elements after the markup change.
- Deliberately not done in this pass, because it isn't code: the DNS records at Wix, GitHub Pages' "Enforce HTTPS" checkbox, and Search Console/Bing Webmaster Tools setup (Phase 0 of the plan), plus everything that needs the owner directly — claiming the Google Business listing, reconciling the phone number it shows against the three on the site, IndiaMART/TradeIndia/ExportersIndia listings, and whether bbcminesindia.com is the same business (Phase 3). These are recorded for the owner in `human.md` §17. Four new per-mineral landing pages (Phase 4) were left for later since the plan marks that phase optional and sequenced after Phase 3.

**Files / Systems**
- `index.html`, `products.html`, `assets/js/config.js`, `assets/css/site.css`, `sitemap.xml`, `_headers` (new), `assets/brand/logo.png` (new)

**Verification**
- Playwright against the repo's pinned Chromium, both pages, 1440px and 390px viewports: zero `pageerror` events; all JSON-LD blocks parsed cleanly with Python's `json` module; screenshots confirmed the hero, Statement, leases/about, FAQ and analysis-table changes render as intended with no layout regressions.

**Status**
- IMPLEMENTED

---

### 2026-09-25 — Client logos become a scrolling strip

**Area:** Home — `#clients`

**Changed**
- Replaced the centred static row with a single-row marquee that repeats
  the logos to fill the loop, with faded edges; 2nd row only at 6+ clients.
- Regenerated the logo SVGs on a shared cap-height/baseline grid.
- Reduced-motion row is now left-aligned with the section text.

**Why**
- Owner feedback: logos looked mismatched in size, and the centred row
  clashed with the left-aligned heading.

**Result**
- Supersedes the "1–3 logos → static row" rule from the entry below.

**Files / Systems**
- `assets/js/app.js`, `assets/css/site.css` §14, `index.html`,
  `assets/img/clients/*.svg`

**Verification**
- Headless Chromium, 1440px and 390px, motion on and reduced.

**Status**
- IMPLEMENTED

---

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
