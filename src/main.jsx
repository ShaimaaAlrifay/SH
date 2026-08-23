import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { assetUrl } from './lib/assetUrl'
import './style.css'
import App from './App.jsx'

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
