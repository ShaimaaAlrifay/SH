import { useEffect, useRef, useState } from 'react'
import AreebLanding from './AreebLanding'

export default function Areep() {
  const [open, setOpen] = useState(false)
  const [inert, setInert] = useState(true)
  const closeRef = useRef(null)
  const lastFocused = useRef(null)

  useEffect(() => {
    const peekEl = document.getElementById('peek')
    if (!peekEl) return
    const show = () => setOpen(true)
    peekEl.addEventListener('click', show)
    return () => peekEl.removeEventListener('click', show)
  }, [])

  useEffect(() => {
    if (open) {
      setInert(false)
      lastFocused.current = document.activeElement
      document.body.style.overflow = 'hidden'
      document.body.classList.add('areep-open')
      closeRef.current?.focus({ preventScroll: true })
      return undefined
    }
    document.body.style.overflow = ''
    document.body.classList.remove('areep-open')
    if (lastFocused.current) lastFocused.current.focus({ preventScroll: true })
    const t = setTimeout(() => setInert(true), 420)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    function onKeydown(e) {
      if (e.key === 'Escape' && open) setOpen(false)
    }
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  }, [open])

  /* AreebLanding runs a WebGL starfield, particle "Intelligence" viz and a
     preloaded video the moment it mounts, so keep it out of the DOM entirely
     until the overlay is actually opened (and briefly after, to match the
     close-transition timing already used for `inert`) rather than mounting
     it eagerly behind the closed, opacity/visibility-hidden dialog. */
  const mounted = !inert

  return (
    <div
      className={`areep${open ? ' open' : ''}`}
      id="areep"
      role="dialog"
      aria-modal="true"
      aria-label="Areeb"
      inert={inert}
    >
      <div className="ar-head">
        <span className="ar-eyebrow">In progress · 2026</span>
        <button className="ar-close" id="arClose" ref={closeRef} onClick={() => setOpen(false)}>
          <span aria-hidden="true">←</span> Back to Work
        </button>
      </div>

      <div className="ar-scroll ar-scroll--areeb">
        <div className="ar-content ar-content--areeb">{mounted && <AreebLanding />}</div>
      </div>
    </div>
  )
}
