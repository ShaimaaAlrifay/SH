import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { assetUrl } from '../lib/assetUrl'
import './HeroArch.css'

gsap.registerPlugin(ScrollTrigger)

/* per-layer max pointer-parallax travel, in px, at full pointer extent */
const REACH = { bg: 4, character: 10, fg: 6 }

export default function HeroArch() {
  const spacerRef = useRef(null)
  const heroRef = useRef(null)
  /* each layer is three nested elements so the three animation sources
     never fight over the same transform: OUTER = pointer parallax (raw
     rAF style writes), PORTAL = the scroll-driven camera move (GSAP),
     IDLE = the ambient loop (GSAP). Nesting lets all three compose. */
  const bgOuter = useRef(null)
  const bgPortal = useRef(null)
  const bgIdle = useRef(null)
  const fgOuter = useRef(null)
  const fgPortal = useRef(null)
  const fgIdle = useRef(null)
  const charOuter = useRef(null)
  const charPortal = useRef(null)
  const charIdle = useRef(null)
  const vignetteRef = useRef(null)
  const copyRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const isSmall = window.innerWidth <= 900
    const isTablet = window.innerWidth > 900 && window.innerWidth <= 1200

    const ctx = gsap.context((self) => {
      /* idle atmosphere — always on (except reduced motion): the scene
         stays faintly alive even when the cursor never moves */
      if (!reduced) {
        gsap.to(bgIdle.current, {
          scale: 1.03,
          x: 5,
          duration: 28,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
        gsap.to(charIdle.current, {
          y: -4,
          duration: 8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
        gsap.to(fgIdle.current, {
          scale: 1.01,
          y: -2,
          duration: 20,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      }

      /* pointer parallax — refs + rAF, no React state, no re-renders. The
         character reads closest to camera (largest reach), the mountains
         furthest (smallest). */
      if (!reduced && !isTouch) {
        let tx = 0,
          ty = 0,
          cx = 0,
          cy = 0,
          raf = null
        const scale = isSmall ? 0.6 : isTablet ? 0.8 : 1
        const layers = [
          [bgOuter, REACH.bg * scale],
          [fgOuter, REACH.fg * scale],
          [charOuter, REACH.character * scale],
        ]
        function tick() {
          cx += (tx - cx) * 0.07
          cy += (ty - cy) * 0.07
          layers.forEach(([ref, reach]) => {
            if (ref.current) ref.current.style.transform = `translate3d(${cx * reach}px,${cy * reach}px,0)`
          })
          raf = Math.abs(tx - cx) > 0.0005 || Math.abs(ty - cy) > 0.0005 ? requestAnimationFrame(tick) : null
        }
        const onMove = (e) => {
          const r = heroRef.current.getBoundingClientRect()
          tx = ((e.clientX - r.left) / r.width - 0.5) * 2
          ty = ((e.clientY - r.top) / r.height - 0.5) * 2
          if (!raf) raf = requestAnimationFrame(tick)
        }
        const onLeave = () => {
          tx = 0
          ty = 0
          if (!raf) raf = requestAnimationFrame(tick)
        }
        heroRef.current.addEventListener('pointermove', onMove, { passive: true })
        heroRef.current.addEventListener('pointerleave', onLeave, { passive: true })
        self.add(() => () => {
          heroRef.current?.removeEventListener('pointermove', onMove)
          heroRef.current?.removeEventListener('pointerleave', onLeave)
          if (raf) cancelAnimationFrame(raf)
        })
      }

      /* the portal transition — a camera retreating backward through the
         archway, not a slide. Character recedes first and fastest, the
         architecture grows to dominate the frame, the mountains shrink and
         fade behind it, and only at the very end does the scene yield to
         the next section underneath. Fully scrub-driven, so scrolling back
         up reverses every stage exactly. Each tween targets the dedicated
         *Portal ref, never the parallax or idle elements. */
      if (!reduced) {
        const zoom = isSmall ? 1.3 : isTablet ? 1.5 : 1.7
        gsap
          .timeline({
            scrollTrigger: {
              trigger: spacerRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
            },
          })
          // the reading is done — let the copy step aside first
          .to(copyRef.current, { opacity: 0, y: -14, duration: 0.22, ease: 'none' }, 0)
          // the mountains recede into the distance, behind the arch — the
          // fade sells "further away" more than the scale does, since the
          // background must still fully cover the archway opening as the
          // architecture (and the hole within it) grows toward camera
          .to(bgPortal.current, { scale: 0.82, y: -14, opacity: 0.22, duration: 1, ease: 'power1.in' }, 0)
          // character and architecture move as one foreground group — the
          // whole scene grows toward camera together, nothing left behind
          .to([fgPortal.current, charPortal.current], { scale: zoom, y: -34, duration: 1, ease: 'power1.in' }, 0)
          // a threshold to cross — masks the extreme zoom and sells "passing through"
          .to(vignetteRef.current, { opacity: 1, duration: 0.3, ease: 'none' }, 0.68)
          .to(heroRef.current, { filter: 'blur(10px)', duration: 0.3, ease: 'none' }, 0.72)
          .to(heroRef.current, { opacity: 0, duration: 0.24, ease: 'none' }, 0.76)
          .set(heroRef.current, { visibility: 'hidden' })
      } else {
        /* reduced motion keeps the hero as a normal, static, in-flow banner —
           handled entirely by CSS (see body.reduced rules) */
      }

      const cta = ctaRef.current
      const onCta = () => {
        const target = spacerRef.current?.offsetHeight ?? window.innerHeight
        window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' })
      }
      cta?.addEventListener('click', onCta)
      self.add(() => () => cta?.removeEventListener('click', onCta))
    })

    return () => ctx.revert()
  }, [])

  return (
    <>
      <div className="hero-spacer" ref={spacerRef} />
      <div className="hero-arch" id="heroArch" ref={heroRef} aria-label="Intro">
        <div className="hl hl-bg" ref={bgOuter}>
          <div className="hl-portal" ref={bgPortal}>
            <div className="hl-idle" ref={bgIdle}>
              <img src={assetUrl('assets/img/hero-bg.webp')} alt="" />
            </div>
          </div>
        </div>
        <div className="hl hl-fg" ref={fgOuter}>
          <div className="hl-portal" ref={fgPortal}>
            <div className="hl-idle" ref={fgIdle}>
              <img src={assetUrl('assets/img/hero-fg.webp')} alt="" />
            </div>
          </div>
        </div>
        <div className="hl hl-character" ref={charOuter}>
          <div className="hl-portal" ref={charPortal}>
            <div className="hl-idle" ref={charIdle}>
              <img src={assetUrl('assets/img/hero-character.webp')} alt="" />
            </div>
          </div>
        </div>

        <div className="hero-vignette" ref={vignetteRef} aria-hidden="true" />

        <div className="hero-copy" ref={copyRef}>
          <div className="hero-main">
            <span className="hero-eyebrow">I design</span>
            <h1 className="hero-headline">Digital experiences that feel alive.</h1>
            <p className="hero-sub">Product design, development, and the space where an idea becomes something real.</p>
            <button className="hero-cta" ref={ctaRef} type="button">
              Explore my work <b>↓</b>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
