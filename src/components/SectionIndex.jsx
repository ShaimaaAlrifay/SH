import { useEffect, useRef, useState } from 'react'
import LineSidebar from './LineSidebar'
import './SectionIndex.css'

/* Mirrors the BEATS slugs/labels in useScrollAnimations.js — kept as a
   separate small list here rather than importing the hook's internals. */
const SECTIONS = [
  ['idea', 'Idea'],
  ['make', 'Make'],
  ['design', 'Design'],
  ['build', 'Build'],
  ['test', 'Test'],
  ['iterate', 'Iterate'],
  ['work', 'Work'],
  ['think', 'Think'],
  ['gap', 'The Gap'],
  ['next', 'Next'],
]

export default function SectionIndex() {
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined
    // the beat sections are created synchronously by useScrollAnimations on
    // mount, but wait a tick so we never race its own effect
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (!ready) return undefined
    const els = SECTIONS.map(([slug]) => document.getElementById('beat-' + slug)).filter(Boolean)
    if (!els.length) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const slug = e.target.id.replace('beat-', '')
            const idx = SECTIONS.findIndex(([s]) => s === slug)
            if (idx !== -1) setActive(idx)
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ready])

  if (!ready) return null

  function goTo(index) {
    const el = document.getElementById('beat-' + SECTIONS[index][0])
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="section-index">
      <LineSidebar
        items={SECTIONS.map(([, label]) => label)}
        accentColor="#9E2F35"
        textColor="rgba(245,245,242,.4)"
        markerColor="rgba(245,245,242,.22)"
        showIndex
        showMarker
        proximityRadius={90}
        maxShift={10}
        falloff="smooth"
        markerLength={26}
        markerGap={6}
        tickScale={0.5}
        scaleTick
        itemGap={14}
        fontSize={0.68}
        smoothing={120}
        activeIndex={active}
        onItemClick={(index) => goTo(index)}
      />
    </div>
  )
}
