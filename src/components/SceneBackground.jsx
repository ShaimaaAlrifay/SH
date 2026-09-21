import { useEffect, useState } from 'react'
import Galaxy from './Galaxy'
import LightRays from './LightRays'
import './SceneBackground.css'

/* Two continuously-running WebGL shader animations (real-time
   requestAnimationFrame loops, no pause when off-screen or idle) with
   zero device-capability gating anywhere in this codebase — not tied to
   the existing `body.reduced` (prefers-reduced-motion) fallback, and not
   skipped on mobile. Both `mouseInteraction`/`followMouse` are also
   dead weight on a touch device (there's no persistent hover position to
   track). Reported live as the page "hanging" on phones — this check
   mirrors the same max-width:900px breakpoint already used everywhere
   else in this codebase to mean "mobile" (see .section-index), plus
   coarse-pointer and reduced-motion as extra signals, and skips mounting
   the WebGL canvases entirely below that line rather than trying to
   tune them down, since they're purely decorative (aria-hidden) and a
   plain dark background costs nothing. */
function useSkipHeavyBackground() {
  const [skip, setSkip] = useState(() => {
    if (typeof window === 'undefined') return false
    return (
      window.matchMedia('(max-width: 900px)').matches ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  })

  useEffect(() => {
    const queries = ['(max-width: 900px)', '(pointer: coarse)', '(prefers-reduced-motion: reduce)'].map((q) =>
      window.matchMedia(q),
    )
    const update = () => setSkip(queries.some((q) => q.matches))
    queries.forEach((q) => q.addEventListener('change', update))
    update()
    return () => queries.forEach((q) => q.removeEventListener('change', update))
  }, [])

  return skip
}

export default function SceneBackground() {
  const skipHeavyBackground = useSkipHeavyBackground()

  if (skipHeavyBackground) {
    return <div className="scene-bg" aria-hidden="true" />
  }

  return (
    <div className="scene-bg" aria-hidden="true">
      <Galaxy
        mouseRepulsion={false}
        mouseInteraction
        density={2.8}
        glowIntensity={0.1}
        saturation={0.25}
        hueShift={210}
        twinkleIntensity={0.25}
        rotationSpeed={0.03}
        starSpeed={0.2}
        speed={0.1}
      />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#BFD4EE"
          raysSpeed={0.6}
          lightSpread={1.2}
          rayLength={1.3}
          followMouse
          mouseInfluence={0.06}
          noiseAmount={0.25}
          distortion={0.05}
          pulsating={false}
          fadeDistance={0.7}
          saturation={0.35}
        />
      </div>
    </div>
  )
}
