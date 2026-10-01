import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { assetUrl } from './lib/assetUrl'
import './style.css'
import App from './App.jsx'

// This page is one long GSAP ScrollTrigger-driven sequence pinned to a
// custom `.stage`/`#track` layout, not a normal document — reloading
// mid-scroll left the browser's own scroll-position memory (the default
// `history.scrollRestoration: 'auto'`) dropping the visitor back into the
// middle of the story instead of its actual start, and often before
// ScrollTrigger had even measured its pin boundaries yet, which could
// show a visibly wrong frame for a moment. `manual` + an explicit
// top-of-page jump, done before React even mounts, makes every load
// (fresh visit, reload, or back/forward) always start the sequence from
// the beginning, matching how a one-shot scroll narrative like this one
// is meant to be entered.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}
window.scrollTo(0, 0)

// --sketch / --notes are consumed as background-image url()s in style.css,
// but plain CSS has no access to Vite's base path — set them here instead,
// so they resolve correctly under the GitHub Pages subpath (base:"/SH/").
document.documentElement.style.setProperty('--sketch', `url("${assetUrl('assets/img/sketch.webp')}")`)
document.documentElement.style.setProperty('--notes', `url("${assetUrl('assets/img/notes.webp')}")`)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
