import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import Pitch from './Pitch'
import CameraRig from './CameraRig'
import { Players, Ball, Trails } from './Entities'
import { PassLanes, RecommendedRing, PressureZones, OpenSpace, Passes } from './Overlays'

// Drives the playback cursor (smooth, ref-based) and publishes the integer frame to React
// at data-rate so overlays/panel update without per-frame React churn.
function Playhead({ cursorRef, last, fps, playRef, onFrame, onEnd }) {
  const published = useRef(-1)
  useFrame((_, delta) => {
    const pr = playRef.current
    if (pr.playing) {
      cursorRef.current += delta * fps * pr.speed
      if (cursorRef.current >= last) {
        cursorRef.current = last
        onEnd()
      }
    }
    const fi = Math.min(last, Math.max(0, Math.floor(cursorRef.current)))
    if (fi !== published.current) {
      published.current = fi
      onFrame(fi)
    }
  })
  return null
}

export default function Scene({
  frames,
  fps,
  cursorRef,
  playRef,
  onFrame,
  onEnd,
  analysis,
  defenders,
  passes,
  currentTime,
  carrierId,
  attackingTeam,
  frame,
  view,
  viewNonce,
  overlaysOn,
}) {
  const last = frames.length - 1
  return (
    <>
      <color attach="background" args={['#070d18']} />
      <fog attach="fog" args={['#070d18', 150, 320]} />

      <hemisphereLight args={['#bcd4ff', '#0b1f15', 0.7]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[40, 90, 40]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-60, 50, -30]} intensity={0.35} color="#9bc2ff" />

      <Pitch />

      {/* analytics ground overlays (under players) */}
      {overlaysOn.pressure && <PressureZones defenders={defenders} />}
      {overlaysOn.space && <OpenSpace analysis={analysis} />}
      {overlaysOn.lanes && <PassLanes analysis={analysis} />}
      <Passes passes={passes} currentTime={currentTime} />
      {overlaysOn.lanes && <RecommendedRing analysis={analysis} />}

      {overlaysOn.trails && (
        <Trails frames={frames} frame={frame} attackingTeam={attackingTeam} />
      )}
      <Players frames={frames} cursorRef={cursorRef} carrierId={carrierId} />
      <Ball frames={frames} cursorRef={cursorRef} />

      <CameraRig view={view} viewNonce={viewNonce} />

      <Playhead
        cursorRef={cursorRef}
        last={last}
        fps={fps}
        playRef={playRef}
        onFrame={onFrame}
        onEnd={onEnd}
      />
    </>
  )
}
