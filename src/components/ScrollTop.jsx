import { useEffect, useRef } from 'react'
import './ScrollTop.css'

export default function ScrollTop() {
  const btnRef = useRef(null)

  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return undefined

    let raf = null
    function paint() {
      raf = null
      btn.classList.toggle('show', window.scrollY > window.innerHeight * 0.6)
    }
    function onScroll() {
      if (raf == null) raf = requestAnimationFrame(paint)
    }
    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (raf != null) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  function toTop() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <button className="scroll-top" ref={btnRef} onClick={toTop} aria-label="Back to top" type="button">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 19V5M12 5L6 11M12 5l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
