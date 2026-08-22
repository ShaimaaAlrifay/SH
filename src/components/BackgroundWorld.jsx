import { useEffect, useRef } from 'react'
import './BackgroundWorld.css'

/* The BACK layer: quiet atmosphere only (no baked-in artwork) — the red
   thread is drawn entirely in code by RedThread, so nothing here should
   compete with it. Extremely subtle mouse drift keeps the scene alive. */
export default function BackgroundWorld() {
  const atmoRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (reduced || isTouch) return undefined

    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      raf = null
    function tick() {
      cx += (tx - cx) * 0.05
      cy += (ty - cy) * 0.05
      atmoRef.current.style.transform = `translate3d(${cx * 8}px,${cy * 5}px,0)`
      raf = Math.abs(tx - cx) > 0.0005 || Math.abs(ty - cy) > 0.0005 ? requestAnimationFrame(tick) : null
    }
    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="bg-world" aria-hidden="true">
      <div className="bg-world-atmo" ref={atmoRef} />
      <div className="bg-world-grain" />
      <div className="bg-world-vig" />
    </div>
  )
}
