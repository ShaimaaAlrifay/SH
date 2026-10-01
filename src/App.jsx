import { useRef } from 'react'
import HeroArch from './components/HeroArch'
import Stage from './components/Stage'
import Outro from './components/Outro'
import Signature from './components/Signature'
import RunningMark from './components/RunningMark'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import Loader from './components/Loader'
import SceneBackground from './components/SceneBackground'
import ScrollProgress from './components/ScrollProgress'
import ScrollTop from './components/ScrollTop'
import SectionIndex from './components/SectionIndex'
import { useScrollAnimations } from './hooks/useScrollAnimations'

export default function App() {
  const containerRef = useRef(null)
  useScrollAnimations(containerRef)

  return (
    <div ref={containerRef}>
      {/* Mounted alongside everything else, not wrapping it — the page
          underneath still mounts and runs its real setup (fonts, GSAP,
          WebGL) while covered by the loader, rather than being delayed
          and then mounting all at once once the loader clears. */}
      <Loader />
      <HeroArch />
      <SceneBackground />
      <Stage />
      <Outro />
      <ScrollProgress />
      <ScrollTop />
      <SectionIndex />
      <Signature />
      <RunningMark />
      <main id="track" aria-hidden="true"></main>
      <Footer />
      <Cursor />
    </div>
  )
}
