# BBC MINES — Human Guide

Project: BBC MINES marketing website
Platform: Static website (HTML/CSS/JS), no app/server component
Document Role: Plain-English project manual for the site owner
Last Verified: 2026-09-24
Verified Against: branch `claude/kind-davinci-rztkgw`, commit `dec6069`
Current Version Name: Not applicable
Current Version Code/Build: Not applicable
Status: Active

## 1. What This Project Is

This is the website for **BBC Mines**, a company that mines and supplies
industrial minerals — china clay (kaolin), ball clay, feldspar and quartz —
from its own leases in the Nagaur belt of Rajasthan, India, to ceramic,
sanitaryware, glass and refractory manufacturers. The company has operated
since 2005.

The site is built around one idea: **"Mined, not traded."** Most competitors
in this category buy and resell minerals from third parties, which is why
their material varies batch to batch. BBC Mines works its own leases
directly, so the same seam and chemistry supply every consignment. That
claim is the spine of the whole site.

There is no login, no app, no e-commerce checkout. It is a two-page
informational and lead-generation site: it explains what BBC Mines mines,
shows technical documentation, and routes every enquiry to a phone call or
WhatsApp message.

## 2. Current Release / State

- **Platform:** Static website, two pages
- **Version:** No versioning scheme is used for this site
- **Release status:** Live structure and design are built and largely
  populated with real photography and contact details; several factual
  sections are still placeholders awaiting figures from the owner (see
  §11–12 below)

## 3. Product Structure

| Page | Purpose |
| --- | --- |
| **Home** (`index.html`) | Brand introduction: the four mineral families, the "mined, not traded" story, industries served, client logos, company history, and a contact block |
| **Products** (`products.html`) | The technical reference: one detailed block per mineral (chemical analysis, physical properties, packaging, downloadable data sheets), plus an FAQ |

Within each page, major sections are anchored so they can be linked to
directly (e.g. `bbcmines.com/#leases`, `bbcmines.com/products.html#feldspar`).

## 4. How the Main Experience Works

A visitor lands on Home, sees a full-screen macro photograph of raw kaolin
clay behind the headline, and scrolls through: a short statement about
consistency, a horizontal gallery introducing the four minerals, the "mined
not traded" story with a photo of the lease site, an industries-served grid,
client logos, a short company history, and a contact block with direct phone
numbers and WhatsApp links (no contact form anywhere on the site — this was
a deliberate choice). From any mineral, a "Technical data" link jumps to
that mineral's full spec block on the Products page, where a visitor can
review typical chemical analysis and download a data sheet PDF (once real
PDFs are uploaded).

## 5. Major Features

### The four-mineral gallery (Home)
A horizontally scrolling showcase (on desktop) of China Clay, Ball Clay,
Feldspar and Quartz, each with a macro photo, character description, and
applications. On phones/tablets it becomes a swipeable strip instead of a
scroll-driven animation.

### Mined, not traded (Home)
A dedicated section making the company's central differentiator explicit —
that BBC Mines works its own leases rather than buying material from
whoever has it that month.

### Applications grid (Home)
Shows which industries (sanitaryware, tiles, tableware, glass, refractories,
etc.) each mineral serves — written for people searching for a specific use
case, not just the company name.

### Client logo marquee (Home)
Two rows of client logos scrolling in opposite directions. **Currently
empty** — no client logos have been added yet, so this section shows a
placeholder note instead of scrolling logos.

### Per-mineral technical data (Products)
For each mineral (Feldspar has two sub-grades: Potash and Soda), a block
with: a chemical analysis table, physical properties (form, whiteness, mesh
size, moisture), applications, packaging/dispatch info, and a downloadable
technical data sheet. **The chemical and physical values are currently
placeholders (`[TBC]`)** — they must be transcribed from the owner's real
lab reports before publishing.

### Documentation download
Each mineral has a "Technical Data Sheet" download button. If no PDF has
been uploaded for a mineral yet, the button is automatically replaced with
a "Documentation available on request" WhatsApp link instead of a broken
download.

### FAQ (Products)
An accordion of common buyer questions (MOQ, samples, packing, payment
terms, despatch time, supply regions). Most answers are still placeholders
pending the owner's input; one is answered ("Do you mine the material
yourselves?" — yes).

### WhatsApp / call / email enquiry
The site has no contact form by design. Every enquiry path is a direct
`tel:` link, `wa.me` WhatsApp link (with the mineral name pre-filled where
relevant), or `mailto:` link — plus a floating WhatsApp button that appears
after the hero and hides again near the contact section.

## 6. Settings / Controls

| Setting | What It Means | Default/Current Behavior |
| --- | --- | --- |
| Mineral/hero/lease photos | Which real photo shows in each image slot | Real photography is in place for the hero, all four minerals, and the leases photo |
| Client logos | Logos shown in the marquee | EMPTY — marquee is currently hidden, showing placeholder copy instead |
| Technical data sheet PDFs | Downloadable report per mineral | EMPTY for all five (China Clay, Ball Clay, Potash Feldspar, Soda Feldspar, Quartz) — each shows "available on request" |
| Google Maps link | Where the address links to | EMPTY — not yet set |
| Motion / scroll animation | The site's cinematic scroll effects (pinned hero, horizontal gallery, parallax, reveals) | ON by default; automatically turns OFF for any visitor whose device/browser has "reduce motion" enabled — the site is still fully readable either way |
| Contact numbers/emails | Phone numbers, WhatsApp numbers, and email addresses shown sitewide | Filled in and live (two named sales contacts, one office line, two emails) |

## 7. Data & Internet

The site needs internet access for:
- Loading its fonts (Google Fonts, Fontshare) and its motion libraries
  (GSAP, Lenis) from public CDNs
- WhatsApp, phone, and email links (these open the visitor's own
  app — the site itself makes no API calls)

There is no login, no user accounts, no database, and no server-side
component. All content is baked directly into the two HTML pages and served
as static files. If the font or animation CDNs are unreachable, the site
still displays and works correctly — fonts fall back to system fonts, and
scroll animation is simply skipped.

## 8. Offline vs Online

Not applicable — this is a public marketing site meant to be viewed online
in a browser. There is no offline mode, no app to install, and nothing that
requires a login.

## 9. Fresh Install / First Use

There is no "install" — a first-time visitor to `bbcmines.com` sees:
- A brief intro animation (a thin line drawing across the screen and the
  "BBC MINES" wordmark revealing) capped at 1.5 seconds, shown once per
  browser session
- The full animated scroll experience (pinned hero, horizontal mineral
  gallery, parallax) if their device doesn't have "reduce motion" turned on
- All real photography already in place, but an empty client-logo section
  and "documentation available on request" instead of PDF downloads, since
  those haven't been supplied yet

## 10. Data Persistence

The site remembers almost nothing about a visitor:
- The only thing it stores is a flag in the browser (cleared when the tab
  closes) that skips the intro animation on subsequent page loads within
  the same visit
- Nothing else is remembered — no accounts, no saved preferences, no
  tracking data stored by the site itself
- All the actual content (photos, prices, PDFs, client logos) is not
  visitor-specific — it's the same for everyone and only changes when the
  site owner updates the underlying files

## 11. Current Features by Status

**CORE (live and complete):**
- Home and Products pages, full navigation, mineral gallery, "mined not
  traded" story, applications grid, contact block, WhatsApp enquiry flow

**DORMANT (built, waiting on real content from the owner):**
- Client logo marquee (no logos supplied yet)
- Technical data sheet downloads (no PDFs uploaded yet)
- Chemical analysis tables and physical properties (`[TBC]` placeholders)
- FAQ answers (most are `[CONFIRM]` placeholders)
- Google Maps link (not set)

## 12. Removed / Deprecated Features

By deliberate decision, this site was built **without**:
- A contact form (WhatsApp/call/email only)
- Any certification badges (ISO/IEC/GST) — not claimed because not
  confirmed
- An "in-house laboratory" claim
- Animated statistic counters (tonnage, client count, export volume)
- A blog or careers page

None of these were built and then removed — they were considered during
planning and intentionally left out, documented in the project's design
spec (`BLUEPRINT.md` §1).

## 13. Known Limitations

- Several factual sections (lease count, named clients, export markets,
  chemical assays, MOQ, payment terms, packaging terms) are still visible
  placeholders in the live markup and need real figures from the owner
  before the site should be considered launch-ready.
- No PDFs or client logos have been uploaded yet, so those sections show
  their fallback states rather than real content.
- The site does not yet have a completed redirect plan from the old live
  `bbcmines.com` site — that migration mapping is an empty placeholder file
  pending a crawl of the old site's URLs.
- Internal lab report codes are intentionally never shown to the public.

## 14. Release Basics

- There is no version number, build number, or packaged release artifact
  for this project — the live site is simply whatever is currently
  published from this repository.
- The custom domain `bbcmines.com` is configured via a `CNAME` file in the
  project.
- Exactly how the site is deployed to that domain (which hosting provider,
  what triggers a deploy) could not be confirmed from the files in this
  repository alone — check with whoever manages the hosting account.

## 15. Project Vocabulary

| Term | Meaning |
| --- | --- |
| **Mined, not traded** | The site's core differentiator: BBC Mines works its own mineral leases directly, rather than buying and reselling material from other sources |
| **China Clay (Kaolin)** | One of the four mineral families supplied — a white hydrous aluminium silicate used for whiteness in ceramic bodies |
| **Ball Clay (Plastic Clay)** | A fine-grained sedimentary clay supplied for plasticity and green strength in ceramic forming |
| **Feldspar** | The "flux" mineral supplied in two sub-grades, Potash and Soda, that helps ceramic bodies vitrify (densify and harden) when fired |
| **Quartz (Silica)** | The crystalline mineral supplied for dimensional stability and hardness in fired ceramic bodies |
| **Nagaur belt** | The mineral-bearing region in Rajasthan, India, where BBC Mines holds its leases |
| **`[TBC]`** | "To be confirmed" — a visible placeholder on the Products page for a real figure (chemical analysis, physical property) not yet supplied |
| **`[CONFIRM]`** | A visible placeholder marking a factual claim (lease count, client names, export markets, FAQ answers) that needs the owner's confirmation before publishing |
| **Technical Data Sheet** | The downloadable PDF report for a given mineral's typical analysis |

## 16. Where To Look For More Detail

Technical architecture, file locations, and how the site's code is
organized: `CodeDoc/agent.md`

How the project got to its current state, and a record of major changes:
`CodeDoc/history.md`

The full original design and copy specification (design tokens, exact
copy, section-by-section build spec): `BLUEPRINT.md`
