import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard, Line, Trail } from '@react-three/drei'
import { COLORS, toScene } from './coords'
import { prefersReducedMotion } from '../../motion'

const REDUCE = prefersReducedMotion()
const lerp = (a, b, t) => a + (b - a) * t
const numberOf = (id) => (id.match(/\d+/) || [''])[0]

// Resolve interpolated frame indices + fraction from the float cursor.
function read(cursorRef, frames) {
  const last = frames.length - 1
  const c = Math.max(0, Math.min(last, cursorRef.current))
  const i0 = Math.floor(c)
  const i1 = Math.min(last, i0 + 1)
  return { i0, i1, f: c - i0 }
}

// ── Players ────────────────────────────────────────────────────────────────────
// Markers move every frame by mutating group refs (no React re-render for motion).
// Re-renders only when `carrierId` changes (≤ data fps) to move the carrier ring.
export function Players({ frames, cursorRef, carrierId }) {
  const roster = useMemo(
    () =>
      frames[0].players.map((p) => ({
        id: p.id,
        team: p.team,
        num: numberOf(p.id),
        color: p.team === 'home' ? COLORS.home : COLORS.away,
        emissive: p.team === 'home' ? COLORS.homeEmissive : COLORS.awayEmissive,
      })),
    [frames]
  )
  const refs = useRef([])
  const [hovered, setHovered] = useState(null)

  useFrame(() => {
    const { i0, i1, f } = read(cursorRef, frames)
    const a = frames[i0].players
    const b = frames[i1].players
    for (let k = 0; k < roster.length; k++) {
      const g = refs.current[k]
      if (!g) continue
      const x = lerp(a[k].x, b[k].x, f)
      const y = lerp(a[k].y, b[k].y, f)
      const [X, , Z] = toScene(x, y, 0)
      g.position.set(X, 0, Z)
    }
  })

  return (
    <group>
      {roster.map((p, k) => {
        const hov = hovered === p.id
        return (
        <group
          key={p.id}
          ref={(el) => (refs.current[k] = el)}
          scale={hov ? 1.14 : 1}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(p.id)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            setHovered((h) => (h === p.id ? null : h))
            document.body.style.cursor = 'auto'
          }}
        >
          {/* base disc */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[1.25, 1.25, 0.3, 24]} />
            <meshStandardMaterial color={p.color} emissive={p.emissive} emissiveIntensity={hov ? 0.9 : 0.35} roughness={0.5} />
          </mesh>
          {/* body marker */}
          <mesh position={[0, 0.95, 0]} castShadow>
            <sphereGeometry args={[0.72, 18, 18]} />
            <meshStandardMaterial color={p.color} emissive={p.emissive} emissiveIntensity={hov ? 1 : 0.4} roughness={0.4} />
          </mesh>
          {/* hover ground ring */}
          {hov && (
            <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.5, 1.85, 32]} />
              <meshBasicMaterial color={p.color} transparent opacity={0.9} />
            </mesh>
          )}
          {/* carrier highlight ring */}
          {p.id === carrierId && (
            <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.7, 2.1, 32]} />
              <meshStandardMaterial color={COLORS.carrier} emissive={COLORS.carrier} emissiveIntensity={0.8} />
            </mesh>
          )}
          <Billboard position={[0, 3.4, 0]}>
            <Text fontSize={2.1} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.16} outlineColor="#05101f">
              {p.num}
            </Text>
          </Billboard>
        </group>
        )
      })}
    </group>
  )
}

// ── Ball ─────────────────────────────────────────────────────────────────────
export function Ball({ frames, cursorRef }) {
  const ref = useRef()
  useFrame(() => {
    const { i0, i1, f } = read(cursorRef, frames)
    const x = lerp(frames[i0].ball.x, frames[i1].ball.x, f)
    const y = lerp(frames[i0].ball.y, frames[i1].ball.y, f)
    const [X, , Z] = toScene(x, y, 0)
    if (ref.current) ref.current.position.set(X, 0.55, Z)
  })
  const ball = (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[0.55, 20, 20]} />
      <meshStandardMaterial color={COLORS.ball} emissive={COLORS.ball} emissiveIntensity={0.8} roughness={0.3} />
    </mesh>
  )
  // A tapered glowing trail sells the ball's motion (skipped under reduced motion).
  if (REDUCE) return ball
  return (
    <Trail width={3.5} length={5} decay={1.4} color={COLORS.ball} attenuation={(t) => t * t}>
      {ball}
    </Trail>
  )
}

// ── Movement trails (attacking team) ───────────────────────────────────────────
// Static per integer `frame`: each attacker's recent path as a faded line.
export function Trails({ frames, frame, attackingTeam, trail = 22 }) {
  const lines = useMemo(() => {
    const start = Math.max(0, frame - trail)
    if (frame - start < 2) return []
    const out = []
    frames[0].players.forEach((p, k) => {
      if (p.team !== attackingTeam || p.role === 'GK') return
      const pts = []
      for (let i = start; i <= frame; i++) {
        const pl = frames[i].players[k]
        pts.push(toScene(pl.x, pl.y, 0.12))
      }
      out.push({ id: p.id, pts })
    })
    return out
  }, [frames, frame, attackingTeam, trail])

  return (
    <group>
      {lines.map((l) => (
        <Line key={l.id} points={l.pts} color={COLORS.home} lineWidth={2} transparent opacity={0.35} />
      ))}
    </group>
  )
}
