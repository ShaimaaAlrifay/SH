import { useEffect, useRef, useState } from 'react'
import './LineSidebar.css'

const FALLOFF = {
  linear: (t) => t,
  smooth: (t) => t * t * (3 - 2 * t),
}

export default function LineSidebar({
  items = [],
  accentColor = '#a855f7',
  textColor = '#c4c4c4',
  markerColor = '#6c6c6c',
  showIndex = false,
  showMarker = false,
  proximityRadius = 100,
  maxShift = 30,
  falloff = 'smooth',
  markerLength = 60,
  markerGap = 0,
  tickScale = 0.5,
  scaleTick = false,
  itemGap = 20,
  fontSize = 1.1,
  smoothing = 100,
  defaultActive = -1,
  activeIndex,
  onItemClick,
  className = '',
}) {
  const rootRef = useRef(null)
  const itemRefs = useRef([])
  const [active, setActive] = useState(defaultActive)

  useEffect(() => {
    if (typeof activeIndex === 'number') setActive(activeIndex)
  }, [activeIndex])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const curve = FALLOFF[falloff] || FALLOFF.linear
    const current = new Array(items.length).fill(0)
    const target = new Array(items.length).fill(0)
    let pointerY = null
    let raf = null
    let lastT = null

    function computeTargets() {
      for (let i = 0; i < items.length; i++) {
        let hover = 0
        if (pointerY != null) {
          const el = itemRefs.current[i]
          if (el) {
            const box = el.getBoundingClientRect()
            const rootBox = root.getBoundingClientRect()
            const centerY = box.top - rootBox.top + box.height / 2
            const dist = Math.abs(pointerY - centerY)
            if (dist < proximityRadius) hover = curve(1 - dist / proximityRadius)
          }
        }
        target[i] = Math.max(hover, i === active ? 1 : 0)
      }
    }

    function apply(instant) {
      for (let i = 0; i < items.length; i++) {
        const el = itemRefs.current[i]
        if (!el) continue
        current[i] = instant ? target[i] : current[i]
        el.style.setProperty('--effect', String(current[i]))
      }
    }

    if (reduced) {
      computeTargets()
      apply(true)
      return undefined
    }

    function tick(t) {
      const dt = lastT == null ? 16 : t - lastT
      lastT = t
      const alpha = 1 - Math.exp(-dt / Math.max(1, smoothing))
      let moving = false
      for (let i = 0; i < items.length; i++) {
        current[i] += (target[i] - current[i]) * alpha
        if (Math.abs(target[i] - current[i]) > 0.001) moving = true
        const el = itemRefs.current[i]
        if (el) el.style.setProperty('--effect', String(current[i]))
      }
      raf = moving ? requestAnimationFrame(tick) : null
    }
    function ensureLoop() {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    function onMove(e) {
      const rootBox = root.getBoundingClientRect()
      pointerY = e.clientY - rootBox.top
      computeTargets()
      ensureLoop()
    }
    function onLeave() {
      pointerY = null
      computeTargets()
      ensureLoop()
    }

    computeTargets()
    ensureLoop()
    root.addEventListener('pointermove', onMove, { passive: true })
    root.addEventListener('pointerleave', onLeave, { passive: true })
    return () => {
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, active, proximityRadius, falloff, smoothing])

  const rootStyle = {
    '--accent-color': accentColor,
    '--text-color': textColor,
    '--marker-color': markerColor,
    '--marker-length': `${markerLength}px`,
    '--marker-gap': `${markerGap}px`,
    '--tick-scale': tickScale,
    '--max-shift': `${maxShift}px`,
    '--item-gap': `${itemGap}px`,
    '--font-size': `${fontSize}rem`,
    '--smoothing': `${smoothing}ms`,
  }

  return (
    <nav
      className={`line-sidebar${showMarker ? ' line-sidebar--markers' : ''}${scaleTick ? ' line-sidebar--scale-tick' : ''} ${className}`.trim()}
      style={rootStyle}
      ref={rootRef}
      aria-label="Section index"
    >
      <ul className="line-sidebar__list">
        {items.map((label, i) => (
          <li className="line-sidebar__item" key={label} ref={(el) => (itemRefs.current[i] = el)}>
            <button
              type="button"
              onClick={() => {
                setActive(i)
                onItemClick?.(i, label)
              }}
            >
              <span className="line-sidebar__label">
                {label}
                {showIndex && <span className="line-sidebar__index">{String(i + 1).padStart(2, '0')}</span>}
              </span>
              {showMarker && <span className="line-sidebar__marker" aria-hidden="true" />}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
