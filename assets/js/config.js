/* ==========================================================================
   EDIT HERE — BBC MINES data layer

   This is the ONLY file that should ever contain a media URL or a PDF link.
   Nothing in index.html, products.html, app.js or motion.js hardcodes a
   media path — everything renders from the objects below.

   To go live:
   1. Drop real photography into assets/img/ and set the matching `src` here.
   2. Drop renamed PDFs into assets/reports/ (naming rules: see BLUEPRINT.md §3)
      and set the matching `href` + `size` here.
   3. Add client logos to CLIENTS (4+ entries run the marquee; 1–3 show a
      static row; 0 shows the "roster pending" note — see app.js).
   4. Fill in CONTACT.maps once the owner supplies the Google Maps link.

   An empty `src` renders the CSS placeholder wash (site.css §06), never a
   broken image icon. A `null` primary report renders a WhatsApp "on
   request" link, never a dead download button.
   ========================================================================== */

export const MEDIA = {
  hero:   { src: 'assets/img/hero2.jpg', alt: 'Aerial view of an open-cast mineral quarry with haul roads and mining equipment', w: 2400, h: 1600 },
  leases: { src: 'assets/img/lease.jpg', alt: 'BBC Mines lease workings in the Nagaur belt', w: 2400, h: 1350 },
  mineral: {
    chinaClay: { src: 'assets/img/china.jpg', alt: 'Macro texture of china clay (kaolin)', w: 1600, h: 2000 },
    ballClay:  { src: 'assets/img/ballc.jpg', alt: 'Macro texture of ball clay',           w: 1600, h: 2000 },
    feldspar:  { src: 'assets/img/feldspar.jpg', alt: 'Macro texture of potash feldspar',     w: 1600, h: 2000 },
    quartz:    { src: 'assets/img/quartz.jpg', alt: 'Macro texture of quartz lumps',        w: 1600, h: 2000 },
  },
};

// Client logos — add or remove freely. 4+ entries run the scrolling marquee;
// 1–3 render as a static centred row; 0 shows the "roster pending" note.
// `url` is optional — leave it empty and the logo renders without a link.
export const CLIENTS = [
  { name: 'Kajaria', logo: 'assets/img/clients/kajaria.svg', url: '' },
  { name: 'Simpolo', logo: 'assets/img/clients/simpolo.svg', url: '' },
  { name: 'Varmora', logo: 'assets/img/clients/varmora.svg', url: '' },
];

// Downloadable reports. `primary` renders as the main button;
// `additional` renders inside the disclosure. Empty array = "on request".
export const REPORTS = {
  chinaClay:      { primary: null, additional: [] },
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
    locality: 'Merta City',
    region: 'Rajasthan',
    postalCode: '341510',
    country: 'IN',
  },
  maps: '', // Google Maps link — [CONFIRM]
  whatsappPrefill: "Hello BBC Mines, I'd like a quote for ",
};
