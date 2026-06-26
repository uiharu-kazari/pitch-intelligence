import { COLORS, PITCH, toScene } from './coords'

// Static 3D pitch: striped grass, touchlines, halfway line, center circle, penalty &
// goal boxes, penalty spots, and goal frames. All markings are thin flat boxes just
// above the grass; the circle is a flat annulus.

const LINE_W = 0.2
const LINE_H = 0.06
const LINE_Y = 0.05
const STRIPES = 12

function lineMat() {
  return <meshStandardMaterial color={COLORS.line} emissive={COLORS.line} emissiveIntensity={0.25} roughness={0.6} />
}

// A marking segment between two data points.
function Seg({ a, b, w = LINE_W }) {
  const cx = (a[0] + b[0]) / 2
  const cy = (a[1] + b[1]) / 2
  const dX = b[0] - a[0]
  const dZ = -(b[1] - a[1])
  const len = Math.hypot(dX, dZ) || 0.001
  const angle = Math.atan2(dZ, dX)
  return (
    <mesh position={toScene(cx, cy, LINE_Y)} rotation={[0, angle, 0]}>
      <boxGeometry args={[len, LINE_H, w]} />
      {lineMat()}
    </mesh>
  )
}

// A hollow rectangle (4 segments) given corners in data coords.
function Rect({ x1, y1, x2, y2 }) {
  return (
    <>
      <Seg a={[x1, y1]} b={[x2, y1]} />
      <Seg a={[x2, y1]} b={[x2, y2]} />
      <Seg a={[x2, y2]} b={[x1, y2]} />
      <Seg a={[x1, y2]} b={[x1, y1]} />
    </>
  )
}

function Spot({ x, y }) {
  return (
    <mesh position={toScene(x, y, LINE_Y)} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.35, 16]} />
      {lineMat()}
    </mesh>
  )
}

function Goal({ side }) {
  // side: -1 = home end (x=0), +1 = away end (x=105)
  const gx = side < 0 ? 0 : PITCH.length
  const half = 7.32 / 2
  const h = 2.44
  const post = (yd) => (
    <mesh position={toScene(gx, 34 + yd, h / 2)}>
      <boxGeometry args={[0.18, h, 0.18]} />
      <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
    </mesh>
  )
  return (
    <group>
      {post(-half)}
      {post(half)}
      {/* crossbar */}
      <mesh position={toScene(gx, 34, h)}>
        <boxGeometry args={[0.18, 0.18, 7.32]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

export default function Pitch() {
  const stripeW = PITCH.length / STRIPES
  const pen = 16.5
  const penW = 40.32 / 2
  const six = 5.5
  const sixW = 18.32 / 2

  return (
    <group>
      {/* Dark stadium surround */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]} receiveShadow>
        <planeGeometry args={[PITCH.length + 60, PITCH.width + 50]} />
        <meshStandardMaterial color="#08121f" roughness={1} />
      </mesh>

      {/* Mowing stripes */}
      {Array.from({ length: STRIPES }).map((_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-PITCH.length / 2 + stripeW * (i + 0.5), 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[stripeW, PITCH.width]} />
          <meshStandardMaterial color={i % 2 === 0 ? COLORS.grass : COLORS.grassDark} roughness={0.95} />
        </mesh>
      ))}

      {/* Outer touchlines */}
      <Rect x1={0} y1={0} x2={PITCH.length} y2={PITCH.width} />
      {/* Halfway line */}
      <Seg a={[PITCH.length / 2, 0]} b={[PITCH.length / 2, PITCH.width]} />
      {/* Center circle (flat annulus) + spot */}
      <mesh position={toScene(PITCH.length / 2, 34, LINE_Y)} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[9.15 - 0.1, 9.15 + 0.1, 64]} />
        {lineMat()}
      </mesh>
      <Spot x={PITCH.length / 2} y={34} />

      {/* Penalty + 6-yard boxes + penalty spots (both ends) */}
      <Rect x1={0} y1={34 - penW} x2={pen} y2={34 + penW} />
      <Rect x1={0} y1={34 - sixW} x2={six} y2={34 + sixW} />
      <Spot x={11} y={34} />
      <Rect x1={PITCH.length} y1={34 - penW} x2={PITCH.length - pen} y2={34 + penW} />
      <Rect x1={PITCH.length} y1={34 - sixW} x2={PITCH.length - six} y2={34 + sixW} />
      <Spot x={PITCH.length - 11} y={34} />

      <Goal side={-1} />
      <Goal side={1} />
    </group>
  )
}
