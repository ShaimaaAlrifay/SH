import Galaxy from './Galaxy'
import LightRays from './LightRays'
import './SceneBackground.css'

export default function SceneBackground() {
  return (
    <div className="scene-bg" aria-hidden="true">
      <Galaxy
        mouseRepulsion={false}
        mouseInteraction
        density={2.8}
        glowIntensity={0.1}
        saturation={0.25}
        hueShift={210}
        twinkleIntensity={0.25}
        rotationSpeed={0.03}
        starSpeed={0.2}
        speed={0.1}
      />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#BFD4EE"
          raysSpeed={0.6}
          lightSpread={1.2}
          rayLength={1.3}
          followMouse
          mouseInfluence={0.06}
          noiseAmount={0.25}
          distortion={0.05}
          pulsating={false}
          fadeDistance={0.7}
          saturation={0.35}
        />
      </div>
    </div>
  )
}
