import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const BEATS = [
  ['idea', 460, '01', 'Idea'],
  ['make', 400, '02', 'Make'],
  ['design', 320, '03', 'Design'],
  ['build', 560, '04', 'Build'],
  ['test', 440, '05', 'Test'],
  ['iterate', 200, '06', 'Iterate'],
  ['work', 760, '07', 'Work'],
  ['think', 520, '08', 'Think'],
  ['gap', 600, '09', 'The Gap'],
  ['next', 380, '10', 'Next'],
]

/* Runs the whole scroll-driven scene. Scope must wrap every element the
   timelines target (#ipad, #sig, #mark, #outro, #cursor, #areep …) since
   GSAP's context scopes selector text to descendants of the scope root. */
export function useScrollAnimations(containerRef) {
  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        document.body.classList.add('reduced')
        return undefined
      }
      ScrollTrigger.config({ ignoreMobileResize: true })

      const track = document.getElementById('track')
      const sections = BEATS.map((b) => {
        const s = document.createElement('section')
        s.className = 'beat'
        s.id = 'beat-' + b[0]
        s.style.height = b[1] + 'vh'
        track.appendChild(s)
        return s
      })

      const beatST = []
      function beat(n) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '#beat-' + n,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            fastScrollEnd: true,
            preventOverlaps: true,
          },
        })
        beatST.push({ name: n, st: tl.scrollTrigger })
        return tl
      }

      /* Statements move only within their own zone — the travel distance is small
         on purpose, so nothing can drift into a neighbouring composition. */
      function say(tl, el, at, hold, dy) {
        dy = dy || 34
        tl.fromTo(
          el,
          { opacity: 0, y: dy, filter: 'blur(12px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power2.out' },
          at,
        ).to(el, { opacity: 0, y: -dy * 0.7, filter: 'blur(12px)', duration: 1.1, ease: 'power2.in' }, at + hold)
        return tl
      }

      gsap.set('.dev', { xPercent: -50, yPercent: -50, opacity: 0 })
      gsap.set('#ipad', { x: '0vw', y: '70vh', rotationX: 16, scale: 0.94, transformPerspective: 1600, transformOrigin: '50% 100%' })
      gsap.set('#design', { y: '70vh', scale: 0.9, transformPerspective: 1400 })
      gsap.set('#ide', { y: 0, scale: 1.02, opacity: 0 })
      gsap.set('#phone', { y: '72vh', rotationX: 10, scale: 0.92, transformPerspective: 1400 })
      gsap.set('.band', { '--mp': '100%' })
      gsap.set('#tap', { xPercent: -50, yPercent: -50 })

      /* ============ 01 · IDEA ============ */
      const b1 = beat('idea')
      b1.set('#caret', { opacity: 1 })
        .to('#caret', { opacity: 0, duration: 0.16, repeat: 3, yoyo: true, ease: 'none' }, 0)
        .to('#caret', { opacity: 1, duration: 0.1 }, 0.7)
        .to('#caret', { y: '-16vh', duration: 1.8, ease: 'power2.inOut' }, 1.2)
      say(b1, '#t0', 0.2, 1.1, 14)
      say(b1, '#t1', 1.6, 2.6)
      b1.to('#caret', { opacity: 0, duration: 0.6 }, 1.6)
      say(b1, '#t2', 5.6, 1.6)
      say(b1, '#t3', 8.6, 1.6)
      say(b1, '#t4', 11.6, 2.8)
      b1.fromTo('#ipad', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 15.8).to('#ipad', { y: '46vh', duration: 2.2, ease: 'none' }, 15.8)

      /* ============ 02 · MAKE ============ */
      const b2 = beat('make')
      b2.to('#ipad', { y: '0vh', x: '0vw', rotationX: 0, scale: 1, duration: 2.6, ease: 'power2.out' }, 0).fromTo(
        '.cam',
        { scale: 1 },
        { scale: 1, duration: 0.1 },
        0,
      )
      say(b2, '#t5', 0.8, 3.6)
      b2.set('#nib', { opacity: 1 }, 2.6)
      ;[
        ['#bd1', 2, 26],
        ['#bd2', 28, 52],
        ['#bd3', 55, 75],
        ['#bd4', 78, 96],
      ].forEach(function (b, i) {
        const t = 2.6 + i * 0.95
        b2.to(b[0], { '--mp': '0%', duration: 1.5, ease: 'sine.inOut' }, t).fromTo(
          '#nib',
          { left: b[1] + '%', top: '2%' },
          { left: b[2] + '%', top: '98%', duration: 1.5, ease: 'sine.inOut' },
          t,
        )
      })
      say(b2, '#t5b', 5.2, 2.6, 20)
      b2.to('#nib', { opacity: 0, duration: 0.5 }, 6.6)
        .to('#notes', { opacity: 1, duration: 1, ease: 'power2.out' }, 6.8)
        .to('#notes', { opacity: 0, duration: 0.9, ease: 'power2.in' }, 9.2)
        .to('#ipad', { scale: 0.74, y: '-7vh', filter: 'blur(5px)', opacity: 0.3, duration: 2.4, ease: 'power2.inOut' }, 9.8)
        .fromTo('#design', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 10.2)
        .to('#design', { y: '18vh', scale: 0.96, duration: 2.2, ease: 'none' }, 10.2)

      /* ============ 03 · DESIGN ============ */
      const b3 = beat('design')
      b3.to('#design', { y: '0vh', scale: 1, duration: 2.4, ease: 'power2.out' }, 0)
        .to('#ipad', { scale: 0.6, opacity: 0, y: '-14vh', duration: 2.2, ease: 'power2.out' }, 0)
        .fromTo('.cam', { scale: 1 }, { scale: 1.04, duration: 5, ease: 'power1.inOut' }, 1.2)
      say(b3, '#t6', 0.8, 3.4)
      say(b3, '#t6b', 2.8, 2.8, 18)
      b3.to('.cam', { scale: 1.14, duration: 2.4, ease: 'power2.inOut' }, 6.2)
        .fromTo('#design', { opacity: 1 }, { opacity: 0, filter: 'blur(7px)', duration: 1.6, ease: 'power2.in' }, 6.6)
        .fromTo('#ide', { opacity: 0 }, { opacity: 1, filter: 'blur(0px)', duration: 1.6, ease: 'power2.out' }, 6.6)

      /* ============ 04 · BUILD ============ */
      const b4 = beat('build')
      b4.fromTo('.cam', { scale: 1.14 }, { scale: 1.06, duration: 3, ease: 'power2.out' }, 0)
      say(b4, '#t7', 0.6, 3.8)
      /* the laptop is fully gone before any full-frame statement arrives */
      b4.to('#ide', { scale: 0.7, y: '-4vh', filter: 'blur(8px)', opacity: 0, duration: 2.2, ease: 'power2.inOut' }, 5.0).to(
        '.cam',
        { scale: 1, duration: 2.2, ease: 'power2.inOut' },
        5.0,
      )
      say(b4, '#t8', 7.6, 1.8)
      say(b4, '#t9', 10.6, 1.8)
      say(b4, '#t10', 13.6, 1.8)
      say(b4, '#t11', 16.6, 1.9)
      ;[
        ['#d1', 20.2],
        ['#d2', 22.8],
        ['#d3', 25.4],
      ].forEach(function (w) {
        b4.fromTo(
          w[0],
          { opacity: 0, scale: 0.62, filter: 'blur(16px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' },
          w[1],
        ).to(w[0], { opacity: 0, scale: 1.3, filter: 'blur(14px)', duration: 1.1, ease: 'power2.in' }, w[1] + 1.3)
      })

      /* ============ 05 · TEST ============ */
      const b5 = beat('test')
      b5.to('#phone', { y: '0vh', rotationX: 0, scale: 1, duration: 2.4, ease: 'power2.out' }, 0)
        .fromTo('#phone', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0)
        .fromTo('.cam', { scale: 1 }, { scale: 1, duration: 0.1 }, 0)
        .fromTo('#tap', { left: '48.9%', top: '74.1%', scale: 0.4, opacity: 0 }, { scale: 1.5, opacity: 0.9, duration: 0.5, ease: 'power2.out' }, 2.6)
        .to('#tap', { opacity: 0, scale: 2.1, duration: 0.6 }, 3.1)
        .to('#phone', { y: '-1.6vh', duration: 0.7, ease: 'power2.out' }, 3.3)
        .to('#phone', { y: '0vh', duration: 0.7, ease: 'power2.inOut' }, 4.0)
        .fromTo('#tap', { left: '48.9%', top: '89.6%', scale: 0.4, opacity: 0 }, { scale: 1.4, opacity: 0.85, duration: 0.45, ease: 'power2.out' }, 4.6)
        .to('#tap', { opacity: 0, scale: 2, duration: 0.6 }, 5.05)
      say(b5, '#t12', 0.6, 2.4)
      say(b5, '#t13', 3.6, 1.6, 20)
      say(b5, '#t14', 6.6, 1.4, 20)
      b5.to('#fault', { opacity: 1, duration: 0.4 }, 7.6)
        .to('#phone', { x: -7, duration: 0.07, repeat: 5, yoyo: true, ease: 'none' }, 7.6)
        .to('#phone', { x: 0, duration: 0.1 }, 8.05)
      say(b5, '#t15', 9.4, 1.2, 14)
      b5.to('.cam', { scale: 0.76, duration: 1.8, ease: 'power3.in' }, 12.0)
        .to('#phone', { opacity: 0.25, y: '16vh', scale: 0.7, duration: 1.8, ease: 'power3.in' }, 12.0)
        .to('#fault', { opacity: 0, duration: 1 }, 12.2)

      /* ============ 06 · ITERATE ============
         One compact loop instead of a long cinematic scene: TEST (phone,
         a visible fault) → NOTICE → CHANGE (laptop takes over, a quick
         edit-pulse) → TEST AGAIN (phone returns, fault resolved) → BETTER.
         The loop-fill bar tracks continuously under the whole sequence. */
      const b6 = beat('iterate')
      b6.to('#phone', { opacity: 1, scale: 1, x: '0vw', y: '0vh', filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' }, 0)
        .fromTo('.cam', { scale: 0.76 }, { scale: 0.92, duration: 1.2, ease: 'power2.out' }, 0)
        .fromTo('#loop', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.2)
        .fromTo('#loopFill', { scaleX: 0 }, { scaleX: 1, duration: 6.2, ease: 'none' }, 0.2)

      /* TEST */
      say(b6, '#itTest', 0.3, 0.9, 12)
      /* NOTICE — a small, obvious problem on the phone */
      b6.to('#fault', { opacity: 1, duration: 0.35 }, 1.1)
        .to('#phone', { x: -6, duration: 0.06, repeat: 5, yoyo: true, ease: 'none' }, 1.1)
        .to('#phone', { x: 0, duration: 0.08 }, 1.46)
      say(b6, '#itNotice', 1.3, 1.0, 12)

      /* CHANGE — the laptop briefly becomes where the fix happens */
      b6.to('#phone', { opacity: 0.32, scale: 0.68, x: '-24vw', duration: 1.0, ease: 'power2.inOut' }, 2.3)
        .to('#fault', { opacity: 0, duration: 0.4 }, 2.3)
        .fromTo('#ide', { opacity: 0, scale: 1.02 }, { opacity: 1, scale: 1, y: '0vh', duration: 1.0, ease: 'power2.out' }, 2.3)
      say(b6, '#itChange', 2.6, 1.1, 12)
      for (let i = 0; i < 4; i++) {
        const t = 2.9 + i * 0.22
        b6.to('#ide', { scale: 1.016, duration: 0.09, ease: 'power2.out' }, t).to('#ide', { scale: 1, duration: 0.11, ease: 'power2.in' }, t + 0.09)
      }

      /* TEST AGAIN — the fix, verified */
      b6.to('#ide', { opacity: 0, scale: 0.95, duration: 0.9, ease: 'power2.inOut' }, 4.0)
        .to('#phone', { opacity: 1, scale: 1, x: '0vw', duration: 0.9, ease: 'power2.out' }, 4.0)
      say(b6, '#itRetest', 4.3, 1.0, 12)
      b6.set('#tap', { borderColor: 'var(--pal-mint)' }, 4.5)
        .fromTo('#tap', { left: '48.9%', top: '74.1%', scale: 0.4, opacity: 0 }, { scale: 1.5, opacity: 0.9, duration: 0.4, ease: 'power2.out' }, 4.6)
        .to('#tap', { opacity: 0, scale: 2, duration: 0.5 }, 5.0)

      /* BETTER — devices clear, the line lands, then Work begins */
      b6.to(['#ide', '#phone'], { opacity: 0, filter: 'blur(10px)', duration: 1.0, ease: 'power2.in' }, 5.5)
        .to('.cam', { scale: 1, duration: 1.0 }, 5.5)
        .to('#loop', { opacity: 0, duration: 0.6 }, 5.6)
      say(b6, '#t17', 6.2, 1.6)

      /* ============ 07 · WORK ============ */
      const b7 = beat('work')
      /* two chapters have no fragment yet, so they run as pure typography */
      ;[
        ['#w1', '#f1'],
        ['#w2', '#f2'],
        ['#w3', '#f3'],
        ['#w4', null],
      ].forEach(function (w, i) {
        const t = 0.8 + i * 3.4
        const c = w[0]
        b7.fromTo(c + ' .chap-no', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, t)
          .fromTo(
            c + ' .chap-name',
            { opacity: 0, y: '10vh', scale: 1.18, filter: 'blur(18px)' },
            { opacity: 1, y: '0vh', scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'power2.out' },
            t,
          )
          .fromTo(c + ' .chap-say', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, t + 0.8)
          .fromTo(c + ' .chap-tags > *', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.14, ease: 'power2.out' }, t + 1.2)
          .to(c + ' .chap-name', { scale: 0.4, y: '-10vh', opacity: 0, filter: 'blur(10px)', duration: 1.3, ease: 'power2.in' }, t + 1.9)
          .to([c + ' .chap-no', c + ' .chap-say'], { opacity: 0, y: -16, duration: 0.8, ease: 'power2.in' }, t + 1.9)
          .to(c + ' .chap-tags > *', { opacity: 0, y: -12, duration: 0.7, stagger: 0.06, ease: 'power2.in' }, t + 1.9)
        if (w[1]) {
          b7.fromTo(w[1], { opacity: 0, y: '8vh', scale: 1.06 }, { opacity: 1, y: '0vh', scale: 1, duration: 1.3, ease: 'power2.out' }, t + 0.6).to(
            w[1],
            { opacity: 0, scale: 0.9, y: '-6vh', duration: 1, ease: 'power2.in' },
            t + 1.9,
          )
        }
      })
      say(b7, '#t18', 15.0, 2.2, 20)
      /* the teaser is only clickable while it is actually on screen */
      const peekEl = document.getElementById('peek')
      ScrollTrigger.create({
        trigger: '#beat-work',
        start: 'top top',
        end: 'bottom top',
        onUpdate: function (self) {
          const live = self.progress > 0.6 && self.progress < 0.85
          peekEl.style.pointerEvents = live ? 'auto' : 'none'
        },
      })

      /* ============ 08 · THINK ============ */
      const b8 = beat('think')
      ;['#k1', '#k2', '#k3', '#k4'].forEach(function (k, i) {
        const t = i * 3.3
        b8.fromTo(k, { opacity: 0, y: '22vh' }, { opacity: 1, y: '0vh', duration: 1.2, ease: 'power2.out' }, t)
          .fromTo(k + ' h2', { scale: 0.44, filter: 'blur(14px)' }, { scale: 1, filter: 'blur(0px)', duration: 1.6, ease: 'power2.out' }, t)
          .to(k + ' ul', { opacity: 1, duration: 0.8 }, t + 1.3)
          .to(k + ' ul', { opacity: 0, duration: 0.6 }, t + 2.2)
          .to(k, { opacity: 0, y: '-20vh', filter: 'blur(10px)', duration: 1, ease: 'power2.in' }, t + 2.1)
          .to(k + ' h2', { scale: 1.4, duration: 1, ease: 'power2.in' }, t + 2.1)
      })

      /* ============ 09 · THE GAP ============
         IDEA, the travelling words and PRODUCT live in three separate grid rows.
         The middle track is reserved: nothing can enter or cover it. Words slide
         in horizontally within their own row, so they cannot collide with each
         other either. When the middle empties, an arrow takes its place — the
         distance closes without either word moving into the other's space. */
      const b9 = beat('gap')
      say(b9, '#t19', 0.6, 2.4)
      b9.fromTo('#gap', { opacity: 0 }, { opacity: 1, duration: 1 }, 4.4)
        .fromTo('.gapword.a', { y: -34, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power2.out' }, 4.4)
        .fromTo('.gapword.b', { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power2.out' }, 4.4)
      document.querySelectorAll('#bridge b').forEach(function (w, i) {
        b9.fromTo(w, { opacity: 0, x: '-14vw', filter: 'blur(9px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.05, ease: 'power2.out' }, 6.0 + i * 0.52)
      })
      b9.to('#bridge b', { opacity: 0, y: -8, duration: 0.7, stagger: 0.07, ease: 'power2.in' }, 10.6)
        .to('#arrow', { opacity: 1, duration: 0.9, ease: 'power2.out' }, 12.2)
        .to('#gap', { opacity: 0, duration: 1.1 }, 14.2)
      say(b9, '#t20', 15.8, 2.6)

      /* ============ 10 · NEXT ============ */
      const b10 = beat('next')
      say(b10, '#t21', 0.6, 2.2)
      say(b10, '#t22', 4.2, 2.2)
      b10
        .fromTo('#outro', { opacity: 0, y: 40, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power2.out' }, 7.8)
        .to('#outro', { y: -60, opacity: 0, filter: 'blur(9px)', duration: 1.5, ease: 'power2.in' }, 10.8)
        .set('#caret', { opacity: 0, y: 0 }, 12.2)
        .to('#caret', { opacity: 1, duration: 0.3 }, 12.4)
        .to('#caret', { opacity: 0, duration: 0.3 }, 13.0)

      /* ---- stage governor + running head ---- */
      const CAST = {
        idea: ['ipad'],
        make: ['ipad'],
        design: ['ipad', 'design'],
        build: ['design', 'ide'],
        test: ['ide', 'phone'],
        iterate: ['ide', 'phone'],
        work: [],
        think: [],
        gap: [],
        next: [],
      }
      const ALL = ['ipad', 'design', 'ide', 'phone']
      const META = {}
      BEATS.forEach(function (b) {
        META[b[0]] = [b[2], b[3]]
      })
      const markNo = document.getElementById('markNo')
      const markTi = document.getElementById('markTi')
      let lastCast = null
      function govern(name) {
        if (name === lastCast) return
        lastCast = name
        const on = CAST[name] || []
        ALL.forEach(function (id) {
          document.getElementById(id).classList.toggle('off', on.indexOf(id) < 0)
        })
        if (META[name]) {
          markNo.textContent = META[name][0]
          markTi.textContent = META[name][1]
        }
      }
      ScrollTrigger.create({
        trigger: '#track',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: function (self) {
          const y = self.scroll()
          let name = beatST[0].name
          for (let i = 0; i < beatST.length; i++) {
            if (y >= beatST[i].st.start) name = beatST[i].name
          }
          govern(name)
        },
        onRefresh: function () {
          lastCast = null
        },
      })
      govern(BEATS[0][0])

      gsap.to(['#sig', '#mark'], { opacity: 1, duration: 1.2, delay: 0.7 })
      ScrollTrigger.create({
        trigger: '#beat-next',
        start: 'top 60%',
        onToggle: function (s) {
          document.getElementById('outro').classList.toggle('live', s.isActive)
        },
      })

      /* ---- cursor ---- */
      const cleanupFns = []
      const cur = document.getElementById('cursor')
      const lbl = document.getElementById('curlbl')
      if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
        gsap.set(cur, { scale: 0.55 })
        const xTo = gsap.quickTo(cur, 'x', { duration: 0.55, ease: 'power3' })
        const yTo = gsap.quickTo(cur, 'y', { duration: 0.55, ease: 'power3' })
        const onMouseMove = function (e) {
          xTo(e.clientX)
          yTo(e.clientY)
          gsap.to(cur, { opacity: 1, scale: 1, duration: 0.45, overwrite: 'auto' })
        }
        const onMouseLeave = function () {
          gsap.to(cur, { opacity: 0, duration: 0.3 })
        }
        window.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseleave', onMouseLeave)
        cleanupFns.push(() => window.removeEventListener('mousemove', onMouseMove))
        cleanupFns.push(() => document.removeEventListener('mouseleave', onMouseLeave))

        const onEnter = function () {
          lbl.textContent = 'Open'
          gsap.to(cur, { scale: 1.32, duration: 0.35, ease: 'power2.out' })
        }
        const onLeave = function () {
          lbl.innerHTML = 'Scroll<br>&#8595;'
          gsap.to(cur, { scale: 1, duration: 0.35, ease: 'power2.out' })
        }
        const hoverables = document.querySelectorAll('a,.mood,.peek,.ar-close')
        hoverables.forEach(function (a) {
          a.addEventListener('mouseenter', onEnter)
          a.addEventListener('mouseleave', onLeave)
        })
        cleanupFns.push(() =>
          hoverables.forEach((a) => {
            a.removeEventListener('mouseenter', onEnter)
            a.removeEventListener('mouseleave', onLeave)
          }),
        )

        ScrollTrigger.create({
          trigger: '#beat-next',
          start: 'bottom bottom',
          onEnter: function () {
            lbl.innerHTML = 'Start<br>&#8593;'
          },
          onLeaveBack: function () {
            lbl.innerHTML = 'Scroll<br>&#8595;'
          },
        })
      }

      ScrollTrigger.refresh()
      const onLoad = function () {
        ScrollTrigger.refresh()
      }
      window.addEventListener('load', onLoad)
      cleanupFns.push(() => window.removeEventListener('load', onLoad))

      let rt
      const onResize = function () {
        clearTimeout(rt)
        rt = setTimeout(function () {
          ScrollTrigger.refresh()
        }, 220)
      }
      window.addEventListener('resize', onResize)
      cleanupFns.push(() => {
        clearTimeout(rt)
        window.removeEventListener('resize', onResize)
      })

      let ot
      const onOrientation = function () {
        ot = setTimeout(function () {
          ScrollTrigger.refresh()
        }, 320)
      }
      window.addEventListener('orientationchange', onOrientation)
      cleanupFns.push(() => {
        clearTimeout(ot)
        window.removeEventListener('orientationchange', onOrientation)
      })

      return () => {
        cleanupFns.forEach((fn) => fn())
        sections.forEach((s) => s.remove())
      }
    },
    { scope: containerRef },
  )
}
