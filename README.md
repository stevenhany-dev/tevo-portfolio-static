# tevo — Personal Portfolio

Steven Hany's personal portfolio site, implemented from the provided high-fidelity
Home/Desktop design. Built with plain HTML5, CSS3 and vanilla JavaScript — no
build step, no framework, no dependencies.

## File structure

```
/
├── index.html            Home
├── about.html             About
├── projects.html          Projects (all, filterable by category)
├── services.html          Services (all)
├── contact.html           Contact + FAQ
├── project-detail.html    Project case-study template (CareFlow example)
├── service-detail.html    Service detail template (UI/UX Design example)
├── css/
│   └── style.css          Full design system + all page styles
├── js/
│   └── script.js          Loader, nav, reveals, parallax, forms, accordion
├── assets/
│   ├── images/            Photos (hero + about portraits included)
│   ├── icons/              (reserved — icons are inline SVG in the HTML)
│   ├── logos/              favicon.svg
│   └── documents/          Put your CV PDF here (see below)
└── README.md
```

## How to preview it

No build tools needed. Either:
- Open `index.html` directly in a browser, or
- Run a tiny local server so relative paths behave exactly like production:
  `python3 -m http.server 8000` from this folder, then visit `localhost:8000`.

## What's real vs. placeholder

- **Hero photo & About photo** — cropped directly from your uploaded design file,
  so these are production-ready as-is.
- **Project card images** (CareFlow, Track Day Cut, NexLaw, etc.) — stock photo
  placeholders. Swap `assets/images/...` paths in each `<img>` with your real
  project screenshots/covers. Card titles/descriptions for the two projects
  that shared duplicate "Porsche 992 GT3 R" placeholder text in the original
  mockup were rewritten as distinct copy — update freely.
- **CV download button** (Hero → "Download CV") — points to
  `assets/documents/steven-hany-cv.pdf`, which doesn't exist yet. Drop your CV
  there with that exact filename, or update the `href` in `index.html`.
- **Contact form** — fully validated client-side (required fields, email
  format), with loading/success/error states. It does **not** send anywhere
  yet, since that needs a backend or a form service (e.g. Formspree, Resend,
  or your own endpoint). Search `data-contact-form` in `js/script.js` to wire
  up a real submit call.
- **Social links, phone, email** — pulled from the design (`steventevo4@gmail.com`,
  `+20 127 752 5665`) with placeholder `facebook.com` / `instagram.com` / etc.
  URLs — update the `href`s to your real profiles.

## Editing content

Everything is plain HTML — search for the text you want to change and edit it
directly. A few structural notes:

- **Nav / footer** are repeated on every page (no templating layer, since this
  is a static site). If you add a page, copy the header/footer markup from an
  existing page to keep them in sync.
- **Project cards** use the `.project-card` component — copy a whole
  `<article class="project-card">…</article>` block to add a new project.
- **Service cards** use `.service-card` the same way.
- **FAQ items** on `contact.html` and `service-detail.html` use `.faq-item` —
  copy a block and give the button/panel a unique `id` pair.

## Design tokens (`css/style.css`, top of file)

All colors, fonts, spacing and radii are CSS custom properties under `:root`.
Change a value once and it updates everywhere:

```css
--color-bg:      #0a0a0a;   /* page background */
--color-surface: #141414;   /* card fill */
--color-accent:  #00e6d3;   /* electric turquoise accent */
--font-display:  'Space Grotesk', ...;
--font-body:     'Inter', ...;
--font-script:   'Kaushan Script', cursive;   /* "That feel alive." + signature */
--container-margin: 80px;   /* adapts down at smaller breakpoints */
--grid-gutter:   20px;
```

> **Font note:** the source design's script accent and signature use a brush
> font that isn't identifiable pixel-for-pixel from a flat image. Kaushan
> Script (Google Fonts) was chosen as the closest open-source match to the
> screenshot. If you have the original font name from Figma, swap the
> `@import` and `--font-script` value in `style.css`.

## Responsive behavior

Breakpoints are handled with real layout changes, not just scaling:
- **≥1025px** — full desktop layout as designed.
- **835–1024px** — hero/about stack vertically, bento grid drops to 2 columns.
- **≤834px** — hamburger menu replaces the nav; `--container-margin` steps down.
- **≤480px** — single-column throughout, hero portrait shrinks, footer
  "LET'S WORK TOGETHER" wraps to multiple lines.

`prefers-reduced-motion` is respected site-wide — reveal/parallax/loader
animations are skipped for anyone with that OS setting on.

## Pages built from the design vs. extrapolated

Only the **Home** page had a high-fidelity design to implement pixel-for-pixel.
About, Projects, Services, Contact and the detail-page templates were built
using the same design system (colors, type, buttons, cards, spacing) for full
visual consistency, but their layouts are original — there was no dedicated
design file for them. If you get Figma designs for those pages later, send
them over and they can be swapped in without touching the design system.
