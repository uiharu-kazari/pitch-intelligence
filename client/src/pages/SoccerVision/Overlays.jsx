import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { COLORS, TIER_COLOR, toScene } from './coords'
import { prefersReducedMotion } from '../../motion'

const REDUCE = prefersReducedMotion()

const LANE_STYLE = {
  strong: { width: 4, opacity: 0.95 },
  risky: { width: 3, opacity: 0.8 },
  poor: { width: 2, opacity: 0.55 },
}

// Passing lanes from the ball carrier to each candidate, colored by quality tier.
export function PassLanes({ analysis }) {
  if (!analysis?.carrier) return null
  const from = toScene(analysis.carrier.x, analysis.carrier.y, 0.3)
  return (
    <group>
      {analysis.candidates.map((c) => {
        const to = toScene(c.player.x, c.player.y, 0.3)
        const s = LANE_STYLE[c.tier]
        return (
          <Line
            key={c.id}
            points={[from, to]}
            color={TIER_COLOR[c.tier]}
            lineWidth={s.width}
            transparent
            opacity={s.opacity}
          />
        )
      })}
    </group>
  )
}

// Pulsing glowing ring on the recommended receiver, with an expanding "sonar" ping.
export function RecommendedRing({ analysis }) {
  const baseRef = useRef()
  const pingRef = useRef()
  const pingMat = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (baseRef.current) {
      const s = 1 + 0.12 * Math.sin(t * 4)
      baseRef.current.scale.set(s, s, s)
    }
    if (!REDUCE && pingRef.current && pingMat.current) {
      const p = (t % 1.6) / 1.6 // 0→1 loop
      const s = 1 + p * 1.7
      pingRef.current.scale.set(s, s, s)
      pingMat.current.opacity = 0.5 * (1 - p)
    }
  })
  if (!analysis?.recommended) return null
  const pos = toScene(analysis.recommended.player.x, analysis.recommended.player.y, 0.25)
  return (
    <group position={pos} rotation={[-Math.PI / 2, 0, 0]}>
      {!REDUCE && (
        <mesh ref={pingRef}>
          <ringGeometry args={[2.0, 2.45, 40]} />
          <meshBasicMaterial ref={pingMat} color={COLORS.recommended} transparent opacity={0.5} depthWrite={false} />
        </mesh>
      )}
      <mesh ref={baseRef}>
        <ringGeometry args={[2.0, 2.6, 40]} />
        <meshStandardMaterial color={COLORS.recommended} emissive={COLORS.recommended} emissiveIntensity={0.9} transparent opacity={0.95} />
      </mesh>
    </group>
  )
}

// Translucent red pressure discs under each defender.
export function PressureZones({ defenders }) {
  return (
    <group>
      {defenders.map((d) => (
        <mesh key={d.id} position={toScene(d.x, d.y, 0.08)} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[4.5, 28]} />
          <meshBasicMaterial color={COLORS.pressure} transparent opacity={0.13} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

// Subtle green glow marking the open space at the best target.
export function OpenSpace({ analysis }) {
  if (!analysis?.recommended) return null
  const pos = toScene(analysis.recommended.player.x, analysis.recommended.player.y, 0.06)
  // size scales with the receiver's separation (more space → bigger glow)
  const r = 4 + Math.min(8, analysis.recommended.separation * 0.4)
  return (
    <mesh position={pos} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[r, 32]} />
      <meshBasicMaterial color={COLORS.space} transparent opacity={0.16} depthWrite={false} />
    </mesh>
  )
}

// Completed passes that have already happened (glowing lines).
export function Passes({ passes, currentTime }) {
  const done = passes.filter((p) => currentTime >= p.t)
  return (
    <group>
      {done.map((p, i) => (
        <Line
          key={i}
          points={[toScene(p.from[0], p.from[1], 0.4), toScene(p.to[0], p.to[1], 0.4)]}
          color={COLORS.ball}
          lineWidth={3}
          transparent
          opacity={0.85}
        />
      ))}
    </group>
  )
}
