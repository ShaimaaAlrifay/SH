import { useEffect } from 'react'
import gsap from 'gsap'

/* Drives the small custom cursor (position, hover-state label). Native
   cursor is hidden via CSS on fine-pointer devices, so this must run for
   the page to have a visible cursor at all. */
export function useCursor() {
  useEffect(() => {
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return undefined

    const cur = document.getElementById('cursor')
    const lbl = document.getElementById('curlbl')
    if (!cur || !lbl) return undefined

    gsap.set(cur, { scale: 0.55 })
    const xTo = gsap.quickTo(cur, 'x', { duration: 0.55, ease: 'power3' })
    const yTo = gsap.quickTo(cur, 'y', { duration: 0.55, ease: 'power3' })

    const onMouseMove = (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
      gsap.to(cur, { opacity: 1, scale: 1, duration: 0.45, overwrite: 'auto' })
    }
    const onMouseLeave = () => gsap.to(cur, { opacity: 0, duration: 0.3 })
    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)

    const onEnter = () => {
      lbl.textContent = 'Open'
      gsap.to(cur, { scale: 1.32, duration: 0.35, ease: 'power2.out' })
    }
    const onLeave = () => {
      lbl.innerHTML = 'Scroll<br>&#8595;'
      gsap.to(cur, { scale: 1, duration: 0.35, ease: 'power2.out' })
    }
    const hoverables = document.querySelectorAll('a,button,.work-item')
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      hoverables.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])
}
