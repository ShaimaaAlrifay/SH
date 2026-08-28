import { useRef } from 'react'
import HeroArch from './components/HeroArch'
import Stage from './components/Stage'
import Outro from './components/Outro'
import Signature from './components/Signature'
import RunningMark from './components/RunningMark'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
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
