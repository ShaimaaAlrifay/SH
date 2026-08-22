import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './RedThread.css'

gsap.registerPlugin(ScrollTrigger)

const PATH_LENGTH = 1000

/* one continuous path, idea → design → build → experiment → result,
   drawn in a normalized 0 0 100 1000 space so it scales with the page
   regardless of exact section heights */
const MAIN_D = `
  M 62 30
  C 62 62.5 58 62.5 58 95
  C 58 127.5 66 127.5 66 160
  C 66 195 34 195 34 230
  C 34 270 62 270 62 310
  C 62 355 48 355 48 400
  C 48 435 50 435 50 470
  C 50 500 50 515 50 545
  C 50 585 62 590 65 620
  C 67 635 66 645 60 650
  C 68 653 70 660 64 668
  C 55 678 42 675 40 660
  C 39 648 48 640 52 645
  C 42 655 46 682.5 52 705
  C 52 742.5 46 742.5 46 780
  C 46 815 50 815 50 850
  C 50 877.5 55 877.5 55 905
  C 55 925 44 925 44 945
  C 44 965 50 965 50 985
`

const BRANCHES = [
  'M 50 480 C 47 487 45 494 45 502 C 45 509 47 513 49 511',
  'M 50 480 C 50 490 50 498 50 508 C 50 512 50 513 50 511',
  'M 50 480 C 53 487 55 494 55 502 C 55 509 53 513 51 511',
]

export default function RedThread() {
  const layerRef = useRef(null)
  const groupRef = useRef(null)
  const mainRef = useRef(null)
  const branchRefs = useRef([])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    const ctx = gsap.context((self) => {
      if (reduced) {
        gsap.set(mainRef.current, { attr: { strokeDashoffset: 0 } })
        return
      }

      gsap.set(mainRef.current, { attr: { strokeDashoffset: PATH_LENGTH } })
      gsap.to(mainRef.current, {
        attr: { strokeDashoffset: 0 },
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.4,
        },
      })

      /* PROCESS: the thread briefly branches into idea / design / build,
         then folds back into the single line */
      branchRefs.current.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 0.85,
            ease: 'power1.inOut',
            scrollTrigger: {
              trigger: '#sec-process',
              start: 'top 65%',
              end: 'bottom 35%',
              scrub: 0.5,
            },
          },
        )
      })

      /* very small cursor settle — never a chase, never per-point distortion */
      if (!isTouch) {
        let tx = 0,
          ty = 0,
          cx = 0,
          cy = 0,
          raf = null
        function tick() {
          cx += (tx - cx) * 0.05
          cy += (ty - cy) * 0.05
          groupRef.current.setAttribute('transform', `translate(${cx * 0.6},${cy * 0.5})`)
          raf = Math.abs(tx - cx) > 0.0008 || Math.abs(ty - cy) > 0.0008 ? requestAnimationFrame(tick) : null
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
        self.add(() => () => {
          window.removeEventListener('pointermove', onMove)
          window.removeEventListener('pointerleave', onLeave)
          if (raf) cancelAnimationFrame(raf)
        })
      }
    }, layerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="thread-layer" ref={layerRef} aria-hidden="true">
      <svg className="thread-svg" viewBox="0 0 100 1000" preserveAspectRatio="none">
        <g ref={groupRef}>
          <path
            ref={mainRef}
            className="thread-main"
            d={MAIN_D}
            pathLength={PATH_LENGTH}
            strokeDasharray={PATH_LENGTH}
            vectorEffect="non-scaling-stroke"
          />
          {BRANCHES.map((d, i) => (
            <path
              key={i}
              ref={(el) => (branchRefs.current[i] = el)}
              className="thread-branch"
              d={d}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
