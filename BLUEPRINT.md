# BBC MINES — Website Blueprint

**Status:** Design + architecture spec. Not yet implemented.
**Implementer:** read §0 first, then build in the order given in §11.

---

## 0. How to use this document

This is a build spec, not a mood board. Everything in it is decided — palette
values, type scale, section order, motion parameters, copy, markup contracts.
Build what is written.

Three rules that override normal judgement calls:

1. **Never invent a fact about this business.** It is a real company with real
   customers. Any value written as `[TBC]` or `[CONFIRM]` is a placeholder the
   owner fills in. Ship it as a visible placeholder — do not substitute a
   plausible-looking number. Chemical assay values, tonnage, client names,
   certifications and export markets are all in this category.
2. **All image URLs and all PDF links live in one file** — `assets/js/config.js`
   (§8). Never hardcode a media URL into the HTML. The owner updates links by
   editing that one file.
3. **Motion is gated on `prefers-reduced-motion`** via `gsap.matchMedia()`. Every
   scroll animation registers inside the `no-preference` branch only. The site
   must be fully readable and navigable with all motion off.

---

## 1. Decisions locked

| Decision | Value |
| --- | --- |
| Pages | Two: `index.html` (Home), `products.html` (Products) |
| Location | New folder `bbc-mines/` in this repo, multi-file static site |
| Build step | None. Opens in a browser, serves from any static host |
| Motion | GSAP 3 + ScrollTrigger + SplitText + Lenis, via CDN |
| Brand name | **BBC MINES** |
| Domain | `bbcmines.com` — this **replaces** the existing live site |
| Founded | 2005. Phrased as "two decades" in prose. Never a hardcoded year count |
| Enquiries | No form. WhatsApp + `tel:` + `mailto:` only |
| Trust signal | **Own mining leases** — the only claim confirmed, so the only one built |
| Report codes | Internal lab IDs (`RD2`, `KM42`, `JKD`…). **Never shown publicly** |

### What is deliberately NOT on this site

Do not build these. They were considered and cut because the underlying claim is
unconfirmed. Building an empty trust block is worse than omitting it.

- No ISO / IEC / GST certification strip
- No "in-house laboratory" section — the lab reports are treated as
  documentation, with no claim about who ran the test
- No animated stat counters for tonnage, client count or export volume
- No contact form
- No blog, no careers page, no CMS

---

## 2. Positioning & message architecture

### The problem with the category

Every competitor in this space — IndiaMART storefronts, TradeIndia listings,
the dozen "leading manufacturer and supplier of industrial minerals" sites —
looks identical: blue gradients, an excavator stock photo, a specification table,
and a contact form nobody fills in. They are indistinguishable, so buyers choose
on price alone.

### The creative idea: *the material is the brand*

Kaolin, ball clay, feldspar and quartz are white, off-white, buff and translucent
materials. A white site is not an absence of design here — it is the product,
shown at a scale nobody in this category bothers with. The whole site is built
as an **editorial material archive**: extreme macro photography of mineral
texture, museum-catalogue typography, and technical documentation treated as the
hero content rather than as an afterthought.

The reference points are not other mining sites. They are material libraries,
architectural product catalogues and editorial photography books.

### The one differentiator that carries the site

**Mined, not traded.**

BBC Mines holds its own leases in the Nagaur belt. Most of the category are
intermediaries buying and reselling other people's material, which is why their
consistency varies batch to batch. This is the only confirmed differentiator, so
it does the heavy lifting — it appears in the hero sub-line, gets its own
full-bleed section, and shapes the FAQ answers.

### Message hierarchy

1. We mine it ourselves in Nagaur — same seam, same chemistry, every consignment
2. Four mineral families, graded for ceramic, sanitaryware, glass and refractory bodies
3. Two decades of supply relationships, since 2005
4. Every consignment is documented — analysis available before you commit

### Tone of voice

Spare, technical, confident. Short declarative sentences. Geological vocabulary
used precisely, never decoratively. No superlatives ("leading", "premier",
"world-class", "one-stop"), no exclamation marks, no "we strive to". If a
sentence would survive in a materials-science textbook, it is on-tone.

---

## 3. Information architecture

```
bbcmines.com/
├── /                       index.html
│   ├── #minerals           → the four mineral families
│   ├── #leases             → mined, not traded
│   ├── #applications       → industries served
│   ├── #clients            → logo carousel
│   ├── #about              → two decades
│   └── #contact
└── /products               products.html
    ├── #china-clay
    ├── #ball-clay
    ├── #feldspar           (contains Potash + Soda sub-blocks)
    ├── #quartz
    └── #faq
```

### Product taxonomy — how the PDFs get categorised

The owner's report files fall into four folders (`Clay`, `White Clay`,
`Feldspar`, `SODA`) which map onto the stated product line as **four mineral
families, with feldspar carrying two sub-grades**:

| Family | Also known as | Sub-grades | Source PDF folder |
| --- | --- | --- | --- |
| China Clay | Kaolin, White Clay, Hydrous Kaolin | — | `White Clay` |
| Ball Clay | Plastic Clay | — | `Clay` |
| Feldspar | — | Potash Feldspar (K-spar), Soda Feldspar (Na-spar) | `Feldspar`, `SODA` |
| Quartz | Silica | Lumps, grits, powder | *(none supplied yet)* |

Feldspar is one navigational entry with two spec blocks inside it. That matches
both how the owner describes the line ("Soda and Potash") and how the reports are
already filed.

### Report file naming

The internal codes are not customer-facing. Rename every PDF to a public,
search-legible filename before uploading — the filename is itself a ranking
signal and appears in the browser's download bar:

```
bbc-mines-china-clay-technical-data-sheet.pdf
bbc-mines-ball-clay-technical-data-sheet.pdf
bbc-mines-potash-feldspar-technical-data-sheet.pdf
bbc-mines-soda-feldspar-technical-data-sheet.pdf
bbc-mines-quartz-technical-data-sheet.pdf
bbc-mines-ball-clay-analysis-01.pdf   ← additional reports, numbered
```

Each mineral gets one **primary** data sheet plus an optional expandable list of
additional analyses. Display labels are generic ("Batch Analysis 01"), never the
internal code.

---

## 4. Design system

### 4.1 Colour

A warm bone canvas, not `#FFFFFF`. Pure white as a page background is the single
most reliable tell of a default template; used as an *elevated* surface against
bone, it reads as deliberate.

```css
:root {
  /* Canvas & surface */
  --bone:        #FAF8F5;   /* page background */
  --paper:       #FFFFFF;   /* cards, elevated panels, sticky nav pill */
  --ink:         #16130F;   /* headings, body text — warm near-black */

  /* Structure */
  --stone-200:   #F0ECE6;   /* section washes, table zebra */
  --stone-300:   #E5E0D8;   /* hairlines, borders, dividers */
  --stone-600:   #6E675C;   /* secondary text, captions — AA verified */

  /* Accent — raw sienna, derived from unwashed clay */
  --ochre:       #9A5B2D;   /* links, eyebrows, focus rings, rules */
  --ember:       #C8763A;   /* hover state only */

  /* Per-mineral identity tints — near-white, used as section wash + card key */
  --tint-china:    #F2F4F5;  /* porcelain, cool */
  --tint-ball:     #E9E1D3;  /* buff */
  --tint-feldspar: #F2E8E0;  /* pale blush */
  --tint-quartz:   #EAEFF0;  /* glacial */
}
```

**Contrast is verified, do not substitute values.** Against `--bone`:
`--ink` ≈ 17:1, `--stone-600` ≈ 5.3:1, `--ochre` ≈ 5.1:1 — all pass WCAG AA for
normal text. `--stone-300` is **decorative only**; never set it as a text colour.

No blue anywhere. No gradients except a single 4% ochre radial bloom behind the
hero mineral image.

### 4.2 Typography

Three families, each doing a distinct job.

| Role | Family | Source | Why |
| --- | --- | --- | --- |
| Display | **Fraunces** (variable) | Google Fonts | Variable optical-size axis means one file gives true high-contrast display hairlines at 10rem *and* stays readable at 1rem. Characterful without being a trend font. Set `WONK 0`, `SOFT 0` |
| Body / UI | **Switzer** | Fontshare | Refined neutral grotesk with warmth. Immediately reads more considered than Inter, which is now the default-template signal in the same way pure white is |
| Technical | **IBM Plex Mono** | Google Fonts | Grade codes, chemical formulae, eyebrow labels, table figures. Industrial character that suits assay data |

```css
--f-display: 'Fraunces', Georgia, 'Times New Roman', serif;
--f-body:    'Switzer', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--f-mono:    'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace;
```

Fallback: if Fontshare is unreachable, Switzer falls back to the system stack —
acceptable. Self-hosting all three in `assets/fonts/` is the preferred final
state; ship CDN first, note it as a follow-up.

**Fluid scale** — all `clamp()`, no breakpoint jumps:

```css
--t-display:  clamp(3.25rem, 10.5vw, 10.5rem);  /* hero H1 */
--t-h1:       clamp(2.5rem, 6vw, 5.5rem);       /* section openers */
--t-h2:       clamp(2rem, 4vw, 3.5rem);
--t-h3:       clamp(1.25rem, 1.6vw, 1.625rem);
--t-lead:     clamp(1.125rem, 1.4vw, 1.375rem); /* intro paragraphs */
--t-body:     1rem;
--t-small:    0.875rem;
--t-eyebrow:  0.75rem;
```

Display type: `font-weight: 300`, `letter-spacing: -0.03em`, `line-height: 0.92`.
Eyebrows: mono, uppercase, `letter-spacing: 0.18em`, `--ochre`.
Body: `line-height: 1.65`, `max-width: 68ch`.
All numeric tables: `font-variant-numeric: tabular-nums`.

### 4.3 Grid, spacing, radius

```css
--wrap:   1440px;                        /* max content width */
--gutter: clamp(1.25rem, 4vw, 5rem);
--col:    12;                            /* CSS grid, 12 columns */
--gap:    clamp(1rem, 2vw, 2rem);
```

Spacing scale (4px base): `4 8 12 16 24 32 48 64 96 128 192 256`.
Section vertical rhythm: `clamp(6rem, 12vw, 14rem)` top and bottom. Generous
whitespace is most of what makes this feel premium — resist compressing it.

Radius: `--r-sm: 4px`, `--r-md: 10px`, `--r-pill: 999px`. Images and image frames
stay **square** (`radius: 0`) — rounded photography reads consumer-app, not
editorial.

Elevation: no drop shadows on cards. Separation comes from `1px solid
var(--stone-300)` hairlines and the paper-on-bone value shift. One exception: the
floating nav pill and the WhatsApp FAB get
`box-shadow: 0 2px 24px rgb(22 19 15 / 0.08)`.

### 4.4 Imagery direction

Every image slot is a placeholder for now (§8). The art direction the owner
should shoot or source against:

- **Macro mineral texture** — fill-frame, raking side light, shot on white. The
  hero and each mineral panel. This is the signature asset class; it is what
  makes the site not look like a competitor's.
- **The leases** — wide, high-horizon landscape of the Nagaur workings. Desaturated,
  no golden-hour treatment. Documentary, not promotional.
- **Material in transit** — loaded tippers, jumbo bags, a stacked yard. Proof of
  operation.
- **Never**: stock excavators, handshakes, globes, gradient overlays with a
  circuit-board motif.

Before real images land, every `<img>` renders a CSS-only placeholder — a subtle
`--stone-200`→`--stone-300` diagonal wash with the slot name in mono at 40%
opacity. The site must look intentional in its placeholder state, because that is
the state the owner reviews it in.

Every image carries explicit `width`/`height` attributes so swapping in real
files costs zero CLS.

---

## 5. Motion system

Cinematic here means *weight and continuity* — things have mass, transitions
carry the eye — not "lots of stuff moves". Restraint is the premium signal.

### 5.1 Libraries

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js" defer></script>
```

Pin exact versions at build time — verify the current 3.x patch and Lenis 1.x
patch before shipping. GSAP including all plugins (ScrollTrigger, SplitText) is
free for commercial use. Note the Lenis package is `lenis`, **not** the
deprecated `@studio-freight/lenis`. Add `<link rel="preconnect">` to
`cdn.jsdelivr.net`.

### 5.2 Global easing & duration

```js
const EASE = { out: 'expo.out', inOut: 'power3.inOut', soft: 'power2.out' };
const DUR  = { fast: 0.4, base: 0.8, slow: 1.2, reveal: 1.4 };
```

Nothing animates faster than 0.3s or slower than 1.6s. One easing family
throughout — mixed easings are what make a site feel assembled rather than
designed.

### 5.3 The reduced-motion contract

```js
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  // every ScrollTrigger, pin, parallax and reveal registers here
  return () => { /* cleanup */ };
});
```

Outside that branch: no Lenis, no pins, no reveals. All elements sit at their
final state via CSS. The marquee becomes a static wrapped grid. The custom cursor
never initialises. Test this branch explicitly — it is not optional polish.

### 5.4 The pieces

**1 — Preloader.** Not a spinner. A 1px ochre rule draws left-to-right across the
top while the `BBC MINES` wordmark reveals from a mask; then a bone curtain wipes
upward to expose the hero. Hard cap 1.5s regardless of load state. `sessionStorage`
flag skips it on subsequent navigations within the session. Hero markup is in the
DOM underneath the whole time — the preloader is an overlay, so it must not delay
LCP.

**2 — Lenis smooth scroll.** `lerp: 0.085`, `wheelMultiplier: 1`,
**`syncTouch: false`**. Smooth-scroll on touch devices feels broken and fights the
platform; mobile uses native scrolling. Drive it from GSAP's ticker and call
`ScrollTrigger.update()` on Lenis `scroll`.

**3 — Hero, pinned.** ~160vh of pinned scroll. Across it: the full-bleed macro
mineral image scales `1.15 → 1.0` and its frame insets from full-bleed to a
contained rectangle; the display H1 scales down and settles toward the lower-left;
the four mineral names fade up as a horizontal index row. One continuous
timeline, `scrub: 1`.

**4 — Line reveals.** SplitText by `lines`, each line wrapped in
`overflow: hidden`, inner line `y: 110% → 0`, stagger `0.08`, `expo.out`,
`DUR.slow`. Applies to every section opener and lead paragraph. Re-split on
resize (debounced 250ms) or lines break mid-animation.

**5 — Image reveals.** `clip-path: inset(0 0 100% 0) → inset(0 0 0 0)` with the
inner `<img>` counter-scaling `1.2 → 1.0` over the same window. `power3.inOut`,
`DUR.reveal`.

**6 — Parallax.** Images inside `overflow: hidden` frames translate at ~0.85×
scroll speed; the inner `<img>` is pre-scaled `1.12` so no gap ever shows.

**7 — The horizontal mineral gallery.** The signature moment. Desktop: a pinned
section that scrolls the four mineral panels horizontally as the user scrolls
vertically, `scrub: 1`, pin duration = track width. Each panel is a full-height
macro image with the mineral name in display type, a one-line character
description, and its applications. Below 900px this becomes a native
`scroll-snap-type: x mandatory` carousel with no pin — do not attempt the pinned
version on mobile.

**8 — Client logo marquee.** Two rows, counter-directional, seamless. Duplicate
the track in the DOM and translate by `-50%` on a linear infinite loop. Logos
render at 45% opacity, greyscale; individual logo goes to full opacity and colour
on hover, and the row pauses. Reduced-motion: static 4-across grid.

**9 — Custom cursor.** A 10px ochre dot with a 36px trailing ring at ~0.15 lerp.
Over interactive elements the ring scales to 64px and displays a contextual label
— `VIEW`, `DOWNLOAD`, `WHATSAPP`. Gated on
`@media (hover: hover) and (pointer: fine)` and reduced-motion. Native cursor
stays visible over form controls and text.

**10 — Magnetic CTAs.** Primary buttons translate up to 8px toward the pointer
within an 80px radius, springing back on leave. Small effect, disproportionate
premium signal.

**11 — Sticky header.** Transparent over the hero. Past the hero it condenses
into a floating `--paper` pill with `backdrop-filter: blur(12px)`. Hides on
scroll-down, reappears on scroll-up.

**12 — Page transitions.** `@view-transition { navigation: auto; }` for Home ↔
Products — near-free and elegant where supported. Where it is not, a GSAP curtain
wipe: bone panel sweeps up to cover, navigate, sweeps down to reveal.

**13 — Section rules.** Horizontal hairlines draw in via `scaleX: 0 → 1`,
`transform-origin: left`, on enter. Cheap, and it gives every section a
consistent arrival beat.

---

## 6. Home page — section spec

Copy below is final unless marked. Build it as written.

### 6.1 Header

Wordmark `BBC MINES` (mono, letterspaced, or the supplied SVG) left. Right:
`Minerals` (→ `/products`), `Leases`, `Applications`, `Contact`, then a
WhatsApp pill CTA. Mobile: full-screen overlay menu, links stagger in, wipes from
the right.

### 6.2 Hero

```
Eyebrow   INDUSTRIAL MINERALS · SINCE 2005 · NAGAUR, RAJASTHAN

H1        The white earth of Rajasthan
          China Clay, Ball Clay, Feldspar & Quartz — mined in Nagaur since 2005

Body      Four mineral families, drawn from our own leases in the Nagaur belt and
          graded for the ceramic, sanitaryware, glass and refractory industries.

CTA       View the minerals  →     |     WhatsApp us
```

The H1 carries both lines in one element — the display line for the eye, the
keyword line for search:

```html
<h1 class="hero__h1">
  <span class="hero__display">The white earth of Rajasthan</span>
  <span class="hero__tail">China Clay, Ball Clay, Feldspar &amp; Quartz — mined in Nagaur since 2005</span>
</h1>
```

Background: full-bleed macro kaolin texture, `fetchpriority="high"`, AVIF with
WebP and JPEG fallbacks via `<picture>`.

### 6.3 Ticker strip

A 1px-ruled band, mono uppercase, scrolling right-to-left, infinite:

`CHINA CLAY (KAOLIN) — BALL CLAY — POTASH FELDSPAR — SODA FELDSPAR — QUARTZ —`

Cheap to build, sets the rhythm between hero and content, and reinforces the
product keywords immediately after the H1.

### 6.4 Statement

Single large serif paragraph, line-reveal, centred, max 60ch:

> For two decades we have worked a single stretch of the Nagaur mineral belt.
> The same seams, the same chemistry, consignment after consignment — which is
> the whole reason a ceramic body fires the same way in March as it did in
> January.

### 6.5 The Minerals — horizontal pinned gallery `#minerals`

Four panels. Each: macro image, name in display type, alt name in mono, character
line, applications, `Technical data →` linking to the matching Products anchor.

| Mineral | Character line |
| --- | --- |
| **China Clay** *(Kaolin)* | A soft, white hydrous aluminium silicate. High fusion temperature, chemically inert, bright on firing. The whiteness in whiteware. |
| **Ball Clay** *(Plastic Clay)* | Fine-grained and sedimentary — kaolinite with mica and quartz. The plasticity and green strength that let a body be thrown, cast and handled long before it sees a kiln. |
| **Feldspar** *(Potash & Soda)* | The flux. It lowers the vitrification point and forms the glassy phase that makes a fired body dense, hard and translucent. |
| **Quartz** *(Silica)* | Crystalline silica — the skeleton. It holds dimensional stability through firing and cooling, controls thermal expansion, and carries the body's hardness. |

### 6.6 Mined, not traded `#leases`

The differentiator section. Full-bleed lease photograph with parallax, overlaid
or adjacent editorial column.

```
Eyebrow   OUR OWN LEASES

H2        Mined, not traded.

Body      Most of this industry is intermediaries — buying material from whoever
          has it that month and passing it on. It is why consistency is the
          first thing buyers complain about.

          We hold our own leases in the Nagaur belt and work them ourselves.
          What reaches you came out of ground we control.
```

Three supporting points, hairline-separated, revealing on stagger:

1. **Our own ground** — Leases in the Nagaur belt, worked directly. `[CONFIRM: number of leases, village names]`
2. **One seam, one chemistry** — Material drawn from the same workings, so the analysis you approve is the analysis you receive.
3. **Direct dispatch** — From our yard to your plant. No intermediate handling, no substitution.

### 6.7 Applications `#applications`

High-value SEO section — this is what captures "ball clay for sanitaryware" class
queries. Grid of industry cards; hovering an industry highlights which minerals
serve it.

| Industry | Minerals |
| --- | --- |
| Sanitaryware | China Clay, Ball Clay, Feldspar, Quartz |
| Wall & Floor Tiles | Ball Clay, China Clay, Feldspar, Quartz |
| Tableware & Porcelain | China Clay, Ball Clay, Feldspar, Quartz |
| Refractories | Ball Clay, China Clay, Quartz |
| Glass | Quartz, Soda Feldspar |
| Glazes & Frits | Feldspar, Quartz, China Clay |
| Paints & Coatings | China Clay |
| Rubber & Plastics | China Clay |
| Electrical Porcelain | China Clay, Ball Clay, Feldspar, Quartz |
| Foundry & Abrasives | Quartz |

Opener: **H2** `What it becomes` / lead: `Our material leaves Nagaur as lumps and
powder. It arrives in your plant as bodies, glazes, glass and refractory linings.`

### 6.8 Clients `#clients`

```
Eyebrow   WHO WE SUPPLY
H2        Supplying the plants that supply India.
Body      Two decades of repeat relationships with ceramic, sanitaryware and
          glass manufacturers across the country.  [CONFIRM: named clients or
          "and select export markets"]
```

Two counter-directional marquee rows, 8–12 logo slots each, all placeholders
driven from `config.js`. Greyscale at 45%, colour on hover, row pauses on hover.

### 6.9 Two decades `#about`

Restrained editorial column, not a gimmick timeline. Three chapters:

- **2005 — The first lease.** The business begins working clay in the Nagaur belt.
- **Building the portfolio.** Ball clay and china clay are joined by feldspar and quartz as buyers ask for a fuller basket from one supplier.
- **Today.** Four mineral families, dispatched nationally from Merta City. `[CONFIRM: export markets — listings mention UAE, Oman, Bangladesh]`

Copy rule: prose says "two decades", never a computed year count.

### 6.10 Documentation teaser

```
Eyebrow   TECHNICAL DOCUMENTATION
H2        Know it before it ships.
Body      Analysis for every mineral we supply, available to download — so your
          body formulation is settled before a single tonne moves.
CTA       Minerals & documentation  →
```

### 6.11 Contact `#contact`

With no form, this section has to be excellent. Editorial contact card, not a
footer dump.

```
Eyebrow   ENQUIRIES
H2        Talk to us directly.
Body      Tell us the mineral, the grade and the tonnage. We will come back with
          availability, analysis and a landed price.
```

| | |
| --- | --- |
| **Shyam Khadav** | `+91 96724 54158` — call · WhatsApp |
| **B. R. Khadav** | `+91 99296 45421` — call · WhatsApp |
| **Office** | `+91 96678 29067` — call · WhatsApp |
| **Accounts** | `account@bbcmines.com` |
| **General** | `bbcmines_minerals@rediffmail.com` |
| **Works & office** | V/P Indawar, Tehsil Merta City, Nagaur, Rajasthan 341510, India |

WhatsApp links use prefilled text:
`https://wa.me/919672454158?text=Hello%20BBC%20Mines%2C%20I%27d%20like%20a%20quote%20for%20`
On a mineral-specific CTA, append the mineral name.

Address links to Google Maps. Static map image optional — no embedded iframe, it
costs a third-party script and a chunk of LCP for very little.

### 6.12 Footer

Large `BBC MINES` wordmark, thin ochre rule, four columns: Minerals / Company /
Contact / Legal. Repeat the full NAP block (name, address, phone) in text — it is
a local-SEO signal and must match the IndiaMART, TradeIndia and ExportersIndia
listings **character for character**. Copyright line uses a JS-injected current
year.

### 6.13 Floating WhatsApp

Bottom-right FAB, appears after the hero passes, hides when the contact section is
in view. `--ochre` circle, WhatsApp glyph, tooltip on hover.

---

## 7. Products page — section spec

### 7.1 Page hero

```
Eyebrow   MINERALS & TECHNICAL DOCUMENTATION
H1        Four minerals, fully documented.
Body      Typical analysis, physical properties, packaging and dispatch for every
          mineral family we work — with test reports to download.
```

Shorter than the Home hero, no pin. Breadcrumb: `Home / Minerals`.

### 7.2 Sticky mineral rail

Sticky sub-navigation under the header: `China Clay · Ball Clay · Feldspar ·
Quartz`. Scroll-spy marks the active section; each is the anchor target from the
Home gallery. On mobile it becomes a horizontally scrollable chip row.

### 7.3 Mineral block ×4

Identical structure per mineral, section wash tinted with that mineral's
`--tint-*`:

1. **Macro image** with parallax, square frame
2. **Name** in display type + alt names in mono (`KAOLIN · WHITE CLAY · HYDROUS KAOLIN`)
3. **Character paragraph** — reuse and extend §6.5 copy
4. **Typical chemical analysis** — table, tabular figures, `--stone-200` zebra:

   | Constituent | Typical % |
   | --- | --- |
   | SiO₂ | `[TBC]` |
   | Al₂O₃ | `[TBC]` |
   | Fe₂O₃ | `[TBC]` |
   | TiO₂ | `[TBC]` |
   | CaO | `[TBC]` |
   | MgO | `[TBC]` |
   | K₂O | `[TBC]` |
   | Na₂O | `[TBC]` |
   | LOI | `[TBC]` |

   **Every value ships as `[TBC]`.** The owner transcribes real figures from the
   lab reports. Do not populate these with typical industry values — a wrong
   assay figure on a supplier's website is a commercial liability. Render `[TBC]`
   in `--ochre` mono so it is unmissable in review.

   Caption beneath: *Typical values, not a specification. Consignment analysis
   supplied with despatch.*

5. **Physical properties** — form (lumps / powder), whiteness, mesh / particle
   size, moisture. All `[TBC]`.
6. **Applications** — chips, linking back to the Home applications section
7. **Packaging & dispatch** — `[CONFIRM]`: loose in tippers, 50kg HDPE bags,
   1 MT jumbo bags; despatch ex-works Merta City / FOR destination
8. **Documentation panel** — `--paper` panel, hairline border:
   - Primary: `Technical Data Sheet` — filename, `PDF`, file size, download icon
   - Expandable: `Additional analyses (n)` — disclosure listing further reports
     with generic labels
   - All links from `config.js`. A mineral with no PDFs yet renders
     `Documentation available on request →` as a WhatsApp link instead of a
     broken button.
9. **Mineral-specific CTA** — `Enquire about Ball Clay →`, WhatsApp prefilled
   with that mineral name

Feldspar renders two spec sub-blocks — **Potash Feldspar** and **Soda Feldspar** —
each with its own analysis table and documentation panel, under one section
heading and one anchor.

### 7.4 FAQ `#faq`

Accordion, `FAQPage` schema. This section does double duty: rich results in
Google, and it is the format LLM answer engines lift from most readily.

1. **What is your minimum order quantity?** `[CONFIRM]`
2. **Can I get a sample before ordering?** `[CONFIRM]`
3. **Do you supply lumps, powder or both?** `[CONFIRM per mineral]`
4. **How is the material packed and despatched?** `[CONFIRM]`
5. **Do you mine the material yourselves?** — Yes. BBC Mines holds and works its own leases in the Nagaur belt of Rajasthan, so material is drawn from the same workings rather than bought in from third parties.
6. **Where do you supply?** `[CONFIRM: domestic coverage + export markets]`
7. **What are your payment terms?** `[CONFIRM]`
8. **How quickly can you despatch?** `[CONFIRM]`

Answer style: lead with the direct answer in the first sentence, then qualify.
Answer-engine extraction takes the first sentence — bury it and you lose the
citation.

### 7.5 Enquiry band + footer

Full-bleed `--ink` band — the one dark moment on the site, which is exactly why
it converts. `Tell us what you need.` with the three phone numbers and both
emails. Footer identical to Home.

---

## 8. The data layer — `assets/js/config.js`

Single source of truth for everything the owner updates by hand. **No media URL
or PDF link appears anywhere else in the codebase.**

```js
export const MEDIA = {
  hero:            { src: '', alt: 'Macro texture of white kaolin clay', w: 2400, h: 1600 },
  leases:          { src: '', alt: 'BBC Mines lease workings in the Nagaur belt', w: 2400, h: 1350 },
  mineral: {
    chinaClay:     { src: '', alt: 'Macro texture of china clay (kaolin)',      w: 1600, h: 2000 },
    ballClay:      { src: '', alt: 'Macro texture of ball clay',                w: 1600, h: 2000 },
    feldspar:      { src: '', alt: 'Macro texture of potash feldspar',          w: 1600, h: 2000 },
    quartz:        { src: '', alt: 'Macro texture of quartz lumps',             w: 1600, h: 2000 },
  },
};

// Client logos — add or remove freely, the marquee reflows
export const CLIENTS = [
  { name: '', logo: '', url: '' },
  // …
];

// Downloadable reports. `primary` renders as the main button;
// `additional` renders inside the disclosure. Empty array = "on request".
export const REPORTS = {
  chinaClay: {
    primary:    { label: 'Technical Data Sheet', href: '', size: '' },
    additional: [ /* { label: 'Batch Analysis 01', href: '', size: '' } */ ],
  },
  ballClay:       { primary: null, additional: [] },
  potashFeldspar: { primary: null, additional: [] },
  sodaFeldspar:   { primary: null, additional: [] },
  quartz:         { primary: null, additional: [] },
};

export const CONTACT = {
  people: [
    { name: 'Shyam Khadav', phone: '+919672454158', label: 'Sales' },
    { name: 'B. R. Khadav', phone: '+919929645421', label: 'Sales' },
  ],
  office: '+919667829067',
  emails: ['account@bbcmines.com', 'bbcmines_minerals@rediffmail.com'],
  address: {
    street: 'V/P Indawar, Tehsil Merta City',
    locality: 'Merta City', region: 'Rajasthan',
    postalCode: '341510', country: 'IN',
  },
  maps: '',            // Google Maps link
  whatsappPrefill: "Hello BBC Mines, I'd like a quote for ",
};
```

Rendering rules the implementer must honour:

- An empty `src` renders the CSS placeholder, never a broken image icon
- A `null` primary report renders the "on request" WhatsApp link, never a dead button
- `CLIENTS` shorter than 4 hides the marquee section entirely
- Every phone number renders as `tel:` **and** `wa.me/` from the same value

Add a `<!-- EDIT HERE -->` banner comment at the top of the file.

---

## 9. SEO & answer-engine spec

Only two pages, so each has to carry more than usual.

### 9.1 Targets

**Home** — brand, entity and locality:
`bbc mines`, `industrial minerals supplier india`, `mineral supplier nagaur`,
`mines and minerals rajasthan`, `china clay supplier rajasthan`

**Products** — the commercial-intent terms that actually convert:
`china clay supplier india`, `kaolin manufacturer rajasthan`,
`ball clay supplier rajasthan`, `ball clay for ceramic industry`,
`potash feldspar lumps manufacturer`, `soda feldspar supplier for glass industry`,
`quartz lumps supplier india`, `china clay for sanitaryware`,
`kaolin supplier for tile manufacturers`

The application-mapped long-tails convert far better than the head terms and are
far less contested — which is why §6.7 and the per-mineral applications chips
exist as real content rather than decoration.

### 9.2 Metadata

```
Home
title       China Clay, Ball Clay & Feldspar Supplier in Rajasthan | BBC MINES
desc        BBC Mines supplies china clay, ball clay, feldspar and quartz from its
            own leases in the Nagaur belt, Rajasthan. Mining and grading industrial
            minerals for the ceramic, sanitaryware and glass industries since 2005.

Products
title       Industrial Minerals — Kaolin, Ball Clay, Feldspar & Quartz | BBC MINES
desc        Typical analysis, physical properties and downloadable test reports for
            china clay, ball clay, potash and soda feldspar, and quartz. Mined and
            graded in Nagaur, Rajasthan by BBC Mines.
```

Canonical on both. OG + Twitter cards with a designed 1200×630 `og-image.jpg`
(wordmark on macro kaolin). One `<h1>` per page; `<h2>` per major section.

### 9.3 Structured data

**Home** — `Organization` + `LocalBusiness`:

```jsonc
{
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "@id": "https://bbcmines.com/#organization",
  "name": "BBC Mines",
  "url": "https://bbcmines.com/",
  "foundingDate": "2005",
  "description": "Miner and supplier of china clay (kaolin), ball clay, feldspar and quartz from own leases in the Nagaur belt, Rajasthan, India.",
  "address": { "@type": "PostalAddress", "streetAddress": "V/P Indawar, Tehsil Merta City",
               "addressLocality": "Merta City", "addressRegion": "Rajasthan",
               "postalCode": "341510", "addressCountry": "IN" },
  "contactPoint": [
    { "@type": "ContactPoint", "telephone": "+91-96724-54158", "contactType": "sales", "name": "Shyam Khadav" },
    { "@type": "ContactPoint", "telephone": "+91-99296-45421", "contactType": "sales", "name": "B. R. Khadav" },
    { "@type": "ContactPoint", "telephone": "+91-96678-29067", "contactType": "customer service" }
  ],
  "email": "account@bbcmines.com",
  "sameAs": [ /* IndiaMART, TradeIndia, ExportersIndia listing URLs */ ]
}
```

`sameAs` matters more than it looks. Those directory listings already rank for
this business; pointing at them consolidates the entity rather than competing
with it.

**Products** — `BreadcrumbList` + an `ItemList` of `Product` nodes, each with
`name`, `description`, `category`, `manufacturer: {"@id": "…#organization"}`, and
`additionalProperty` `PropertyValue` entries for the analysis — populated only
once real assay values replace `[TBC]`. Plus `FAQPage` for §7.4.

### 9.4 Answer-engine optimisation

An increasing share of B2B supplier discovery now runs through AI answers rather
than a results page, and those systems reward different things than a classic
ranking does:

- **One unambiguous entity-defining sentence** early on the Home page:
  *"BBC Mines is a mining and mineral supply company based in Merta City, Nagaur,
  Rajasthan, working its own leases to produce china clay, ball clay, feldspar and
  quartz for the ceramic, sanitaryware, glass and refractory industries."*
- **Question-shaped H2/H3s** with the direct answer in the first sentence (§7.4)
- **Real tables** for specs — parsed far more reliably than styled `<div>` grids
- **Semantic HTML, no client-rendered content.** Everything in the served HTML.
  This is a static site, so it is free — do not regress it by moving copy into JS
- Explicit, plain statements of what is supplied, to whom, from where

### 9.5 Technical

- `sitemap.xml` (2 URLs), `robots.txt` with the sitemap reference
- `preconnect` to font CDNs and jsDelivr
- `fetchpriority="high"` on the hero image; `loading="lazy"` + `decoding="async"`
  on everything below the fold
- AVIF → WebP → JPEG via `<picture>`
- Explicit `width`/`height` on every image
- PDFs: descriptive filenames (§3), `Content-Disposition: inline`, listed in the
  sitemap so the data sheets rank on their own

### 9.6 Migration from the existing site

`bbcmines.com` is live today, so this is a replacement, not a launch. Before
cutover:

1. Crawl the existing site and export every indexed URL
2. Map each to `/` or `/products` (or a `#` anchor) as a **301**
3. Ship the map as `_redirects` (Netlify / Cloudflare Pages) or `vercel.json`
4. Keep the old `og-image` dimensions if any URLs are shared on WhatsApp
5. Submit the new sitemap in Search Console and watch coverage for two weeks

**This needs the old URL list from the owner or a crawl — it is not something to
guess.** Ship a `_redirects` stub with a `# TODO` header.

---

## 10. Performance, accessibility, support

### Budget

| Metric | Target |
| --- | --- |
| LCP | < 2.0s on 4G |
| CLS | < 0.02 |
| INP | < 200ms |
| Initial transfer | ≤ 500KB |
| GSAP + ScrollTrigger + SplitText + Lenis | ~120KB gz |
| Hero image | ≤ 150KB AVIF |
| Lighthouse | ≥ 95 Performance, 100 Accessibility, 100 SEO |

All scripts `defer`. Motion initialises on `DOMContentLoaded`. Fonts
`font-display: swap` with the two critical weights preloaded. Self-hosting fonts
is the preferred end state.

### Accessibility — WCAG 2.2 AA

- Skip link to `#main` as the first focusable element
- `:focus-visible` — 2px `--ochre` outline, 2px offset, never removed
- Semantic landmarks: `header`, `nav`, `main`, `section`, `footer`
- The horizontal gallery is keyboard-reachable; pinning must not trap focus
- Accordions: real `<details>`/`<summary>` or correct `aria-expanded` buttons
- The custom cursor never replaces the native one over text or controls
- Decorative images `alt=""`; mineral macros get descriptive alt from `config.js`
- Contrast per §4.1 — verified, do not substitute
- Full reduced-motion parity (§5.3)

### Support

Evergreen Chrome, Edge, Firefox, Safari 16+. iOS Safari 16+, Chrome Android.
View Transitions and `backdrop-filter` degrade gracefully. No IE, no polyfills.

---

## 11. File structure & build order

```
bbc-mines/
├── BLUEPRINT.md            ← this file
├── index.html
├── products.html
├── robots.txt
├── sitemap.xml
├── _redirects              ← stub, TODO from §9.6
└── assets/
    ├── css/site.css        ← single stylesheet, TOC comment block at top
    ├── js/
    │   ├── config.js       ← EDIT HERE: all media + PDF links
    │   ├── motion.js       ← GSAP / Lenis / ScrollTrigger
    │   └── app.js          ← nav, marquee, scrollspy, accordions, cursor
    ├── img/                ← placeholders until real photography lands
    ├── reports/            ← PDFs, renamed per §3
    └── brand/
        ├── logo.svg
        └── og-image.jpg
```

One stylesheet, not four — with no build step, every extra file is a blocking
request, and `@import` is worse. Section it with a table-of-contents comment.

### Build order

1. `site.css` — tokens, reset, typography, grid, the placeholder-image treatment
2. `config.js` with empty values, plus the render helpers
3. `index.html` — full static markup, all sections, **no motion**. Verify it reads
   correctly top to bottom as a plain document. This is also the reduced-motion
   experience, so it has to stand on its own
4. `products.html` — same discipline
5. `app.js` — nav, mobile menu, scrollspy, accordions, marquee, config rendering
6. `motion.js` — Lenis, then reveals, then parallax, then the pinned hero, then
   the horizontal gallery. In that order; the pins are the fragile part and are
   much easier to debug once everything else is stable
7. Schema, meta, sitemap, robots
8. Reduced-motion pass, keyboard pass, Lighthouse pass

Steps 3 and 4 producing a site that works completely with JavaScript disabled is
the load-bearing constraint. Motion is added on top of a working document, never
depended on to reveal content — a failed CDN must never leave a section
invisible. Set final visible states in CSS and have GSAP animate *from* an offset,
using `gsap.set()` at init only after the library has confirmably loaded.

---

## 12. Open items — needed from the owner

Blocking for launch, not for build. Build with placeholders; these swap in.

| # | Item | Blocks |
| --- | --- | --- |
| 1 | Real chemical analysis values per mineral | Products spec tables (`[TBC]`) |
| 2 | Photography — macro mineral textures, lease site, yard/dispatch | Every image slot |
| 3 | Client logos + permission to display | §6.8 marquee |
| 4 | PDFs, renamed per §3 | Documentation panels |
| 5 | Physical properties — form, whiteness, mesh, moisture | Products |
| 6 | Packaging & dispatch terms | Products, FAQ |
| 7 | MOQ, sample policy, payment terms, lead time | FAQ |
| 8 | Export markets — listings mention UAE, Oman, Bangladesh; confirm before publishing | §6.9, FAQ |
| 9 | Number and location of leases | §6.6 |
| 10 | Logo — vector, or brief a wordmark | Header, footer, og-image |
| 11 | Old `bbcmines.com` URL list | §9.6 redirect map |
| 12 | Google Maps link | Contact |
| 13 | Directory listing URLs for `sameAs` | Home schema |

---

## 13. Acceptance checklist

- [ ] No fabricated facts. Every unknown renders a visible `[TBC]` / `[CONFIRM]`
- [ ] All media and PDF links resolve from `config.js` alone
- [ ] Internal lab codes (`RD2`, `KM42`, `JKD`…) appear nowhere in the output
- [ ] Site is fully readable with JavaScript disabled
- [ ] Full parity under `prefers-reduced-motion: reduce`; no Lenis, no pins
- [ ] Keyboard-navigable throughout; focus never trapped in the pinned gallery
- [ ] Contrast values per §4.1 unmodified
- [ ] Horizontal gallery degrades to scroll-snap below 900px
- [ ] Lenis `syncTouch: false` — native scrolling on touch
- [ ] Empty report entries render "on request", never a dead button
- [ ] Empty image slots render the CSS placeholder, never a broken icon
- [ ] Every image has explicit `width`/`height`
- [ ] One `<h1>` per page, carrying both display and keyword lines
- [ ] Schema validates in the Rich Results Test
- [ ] NAP block matches the directory listings character for character
- [ ] Lighthouse ≥ 95 / 100 / 100
- [ ] No blue. No pure `#FFFFFF` page background. No rounded photography
