import { useEffect, useRef } from 'react'

const PATH_LENGTH = 1000
const rectStyle = { x: '0.75px', y: '0.75px', width: 'calc(100% - 1.5px)', height: 'calc(100% - 1.5px)' }

export default function ProgressBorder() {
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
      fill.style.strokeDashoffset = String(PATH_LENGTH * (1 - progress))
    }
    /* scrollHeight forces a layout read, so it's only sampled on resize —
       scroll itself just reads scrollY (no reflow), which matters a lot on
       a page this scroll-animation-heavy */
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
    <svg className="progress-border" aria-hidden="true">
      <defs>
        <linearGradient id="pb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#315CFF" />
          <stop offset="17%" stopColor="#7C3AED" />
          <stop offset="34%" stopColor="#EC4899" />
          <stop offset="52%" stopColor="#FF6B5E" />
          <stop offset="68%" stopColor="#FF8A3D" />
          <stop offset="84%" stopColor="#F4C430" />
          <stop offset="100%" stopColor="#31C48D" />
        </linearGradient>
      </defs>
      <rect className="pb-track" style={rectStyle} pathLength={PATH_LENGTH} />
      <rect
        ref={fillRef}
        className="pb-fill"
        style={rectStyle}
        pathLength={PATH_LENGTH}
        strokeDasharray={PATH_LENGTH}
        strokeDashoffset={PATH_LENGTH}
      />
    </svg>
  )
}
