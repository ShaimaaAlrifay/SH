import { useEffect, useLayoutEffect, useState } from 'react'
import './Loader.css'

// Shown long enough to absorb the real startup cost this page has — custom
// web fonts loading, GSAP/ScrollTrigger measuring its ~10 pinned sections,
// and the two background WebGL canvases compiling their shaders — instead
// of letting the visitor see that happen as a janky, half-ready page.
// `document.fonts.ready` and the window `load` event are real readiness
// signals, not guesses; MIN_DISPLAY_MS only exists so a fast load doesn't
// flash the loader on and off in the same frame, which reads as a glitch
// rather than an intentional loading state.
const MIN_DISPLAY_MS = 500
const FADE_MS = 450

export default function Loader() {
  const [ready, setReady] = useState(false)
  const [mounted, setMounted] = useState(true)

  useLayoutEffect(() => {
    document.body.classList.add('is-loading')
  }, [])

  useEffect(() => {
    const start = performance.now()
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve()
    const pageLoaded = new Promise((resolve) => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', resolve, { once: true })
    })

    Promise.all([fontsReady, pageLoaded]).then(() => {
      const elapsed = performance.now() - start
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed)
      setTimeout(() => setReady(true), remaining)
    })
  }, [])

  useEffect(() => {
    if (!ready) return undefined
    document.body.classList.remove('is-loading')
    const t = setTimeout(() => setMounted(false), FADE_MS)
    return () => clearTimeout(t)
  }, [ready])

  if (!mounted) return null

  return (
    <div className={`loader${ready ? ' loader-done' : ''}`} aria-hidden="true">
      <div className="loader-mark">
        <span className="loader-name">Shaimaa Alrifay</span>
        <div className="loader-bar">
          <div className="loader-bar-fill" />
        </div>
      </div>
    </div>
  )
}
