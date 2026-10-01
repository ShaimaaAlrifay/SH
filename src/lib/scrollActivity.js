/* Shared "is the user actively scrolling right now" signal, read directly
 * (not via React state/props) by Galaxy.jsx and LightRays.jsx's own
 * requestAnimationFrame loops. Real profiling (Playwright + CDP long-task
 * tracing) found these two continuously-running WebGL shaders responsible
 * for ~90% of all scroll-processing time even on a fast, unthrottled
 * desktop Chromium instance (a 150-scroll-event session went from ~110s of
 * main-thread blocking down to ~13s — matching a blank-page control —
 * once they stopped rendering) — they were contending with the GSAP
 * ScrollTrigger scrub timeline for the same per-frame budget on the main
 * thread. Pausing their GPU draw calls specifically while the user is
 * scrolling (when GSAP needs that budget most) removes the contention
 * without removing the decorative effect for everyone who isn't actively
 * scrolling at that instant.
 *
 * One passive `scroll` listener updates a module-level flag directly
 * (no React re-renders, no props drilling) — `wheel`/`touchmove` are also
 * covered since they both fire native `scroll` events on this page's
 * scroll container (`document`/`window`, not a custom scroll div).
 */
let active = false
let timeoutId = null

if (typeof window !== 'undefined') {
  const onScroll = () => {
    active = true
    clearTimeout(timeoutId)
    // resume rendering a beat after scrolling actually stops, not on
    // every idle frame between wheel ticks — scroll events fire in
    // bursts, not continuously, so a short debounce is what actually
    // distinguishes "mid-scroll" from "settled"
    timeoutId = setTimeout(() => {
      active = false
    }, 150)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
}

export function isScrollActive() {
  return active
}
