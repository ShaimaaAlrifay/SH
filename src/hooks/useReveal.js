import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

/* Simple, restrained scroll-triggered reveals for content sitting on top of
   the continuous background world — no pinning, no scroll-jacking, native
   scroll the whole way. */
export function useReveal(scopeRef) {
  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const items = document.querySelectorAll('.reveal')
      if (reduced) {
        items.forEach((el) => gsap.set(el, { opacity: 1, y: 0, scale: 1 }))
        return undefined
      }
      items.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 26, scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })
      return () => ScrollTrigger.getAll().forEach((t) => t.kill())
    },
    { scope: scopeRef },
  )
}
