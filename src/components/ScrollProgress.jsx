import { useEffect, useRef } from 'react'
import './ScrollProgress.css'

/* A single thin line tracking scroll through the whole document — 0 at the
   top, 1 at the bottom. Direct style mutation via rAF, no React state, no
   easing: the fill should feel directly connected to the user's scroll. */
export default function ScrollProgress() {
  const fillRef = useRef(null)

  useEffect(() => {
    const fill = fillRef.current
    if (!fill) return undefined

    let max = 0
    let raf = null

    function measure() {
      max = document.documentElement.scrollHeight - window.innerHeight
      paint()
    }
    function paint() {
      raf = null
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      fill.style.transform = `scaleX(${progress})`
    }
    function onScroll() {
      if (raf == null) raf = requestAnimationFrame(paint)
    }
    function onResize() {
      if (raf == null) raf = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      if (raf != null) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress-track" />
      <div className="scroll-progress-fill" ref={fillRef} />
    </div>
  )
}
