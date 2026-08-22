# Shaimaa Alrifay — Portfolio

A single-page, scroll-driven portfolio built with React + Vite. GSAP's ScrollTrigger drives
a cinematic scene: a phone/tablet/laptop "stage" that animates in and out as you scroll,
synced to short statements about how ideas become products.

## Structure

```
index.html                        — Vite entry HTML (fonts, meta tags, <div id="root">)
src/main.jsx                      — mounts <App/>, imports the global stylesheet
src/App.jsx                       — assembles every section, owns the scroll-animation scope
src/style.css                     — all styles (ported 1:1 from the original design)
src/components/
  Stage.jsx                       — the devices, scroll-track type/statements, chapters
  Outro.jsx                       — closing screen with social/resume links
  MoodToggle.jsx                  — dark/light theme switch (top-right)
  RunningMark.jsx                 — running "01 / Idea" chapter marker (bottom-left)
  Areep.jsx                       — the "peek inside" project-teaser overlay
  Footer.jsx, Cursor.jsx          — footer credit, custom cursor
  SceneBackground.jsx             — picks the WebGL background by theme
  GradientWaves.jsx               — light/colorful-mode background (ogl/WebGL)
  LightRays.jsx                   — dark-mode background (ogl/WebGL)
src/hooks/
  useScrollAnimations.js          — the full GSAP ScrollTrigger timeline (ported from vanilla JS)
  useMoodToggle.js                — theme state, persisted to localStorage
src/config/links.js               — social/resume link constants (edit these)
public/assets/                    — images (webp) + resume PDF, served as static files
backup/                           — prior versions kept for reference:
  static-site/                    — the plain HTML/CSS/JS version (pre-React)
  "Shaimaa Portfolio (1) - original single-file.html" — the very first, all-inline export
```

## Before deploying

Fill in the placeholders in [src/config/links.js](src/config/links.js):

- `LINKEDIN_URL`, `GITHUB_URL`, `X_URL`, `EMAIL_ADDRESS` are still literal placeholder
  strings — the header/footer links currently go nowhere useful.
- `RESUME_PDF` points to `/assets/Shaimaa-Alrifay-Resume.pdf`, which is already in
  `public/assets/`.

## Running locally

```
npm install
npm run dev       # dev server with hot reload
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

## Notes on the port

- GSAP is a normal npm dependency now (`gsap`, `@gsap/react`) instead of a CDN `<script>` tag.
- The scroll animation targets elements by `id`/class selector exactly like the original
  vanilla script, scoped via `gsap.context()` to the app's root element — this kept the
  ~300-line timeline choreography (10 scroll-linked "beats") intact and low-risk to port.
- `react-router-dom` is installed and ready for when more pages get added, though the site
  is currently a single route.
