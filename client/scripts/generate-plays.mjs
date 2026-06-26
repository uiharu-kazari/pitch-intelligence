// Generates simulated soccer tracking data → public/data/soccer_plays.json
//
// Pitch coordinates are in meters: x ∈ [0,105] (length), y ∈ [0,68] (width).
// HOME attacks toward x = 105 (the away goal). Each scenario is authored as a set of
// player/ball waypoints and interpolated to a fixed frame rate. Positions are tuned so
// the analytics engine (src/analytics/tactics.js) recommends the intended pass.
//
// This is SIMULATED / SAMPLE data — not real tracking — and is labeled as such in the UI.

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FPS = 12

// Linear interpolate a waypoint path [[t,x,y], ...] at time t (seconds).
function sample(path, t) {
  if (t <= path[0][0]) return [path[0][1], path[0][2]]
  const last = path[path.length - 1]
  if (t >= last[0]) return [last[1], last[2]]
  for (let i = 0; i < path.length - 1; i++) {
    const [t0, x0, y0] = path[i]
    const [t1, x1, y1] = path[i + 1]
    if (t >= t0 && t <= t1) {
      const f = (t - t0) / (t1 - t0)
      return [x0 + (x1 - x0) * f, y0 + (y1 - y0) * f]
    }
  }
  return [last[1], last[2]]
}

// Build per-frame data from authored waypoint paths.
function buildFrames(def) {
  const frames = []
  const total = Math.round(def.duration * FPS)
  let prev = {}
  for (let f = 0; f <= total; f++) {
    const t = f / FPS
    const players = def.players.map((p) => {
      const [x, y] = sample(p.path, t)
      const key = p.id
      const last = prev[key]
      const speed = last ? Math.hypot(x - last.x, y - last.y) * FPS : 0
      prev[key] = { x, y }
      return {
        id: p.id,
        team: p.team,
        role: p.role,
        x: round(x),
        y: round(y),
        speed: round(speed, 1),
      }
    })
    const [bx, by] = sample(def.ball, t)
    // Active event at (approximately) this timestamp, if any.
    const ev = def.events.find((e) => Math.abs(e.t - t) < 0.5 / FPS)
    frames.push({
      t: round(t, 2),
      ball: { x: round(bx), y: round(by) },
      possession: def.possession,
      ...(ev ? { event: ev.type, eventPlayer: ev.player } : {}),
      players,
    })
  }
  return frames
}

const round = (n, d = 2) => Number(n.toFixed(d))

// ── Shared defenders/keepers helpers ───────────────────────────────────────────
const still = (x, y) => [
  [0, x, y],
  [99, x, y],
]

// ════════════════════════════════════════════════════════════════════════════
// Scenario 1 — Good through ball into open space.
// AM #10 carries centrally, then slides a through ball to ST #9 running behind the
// back line into open space with a clear lane → the engine should recommend ST #9.
// ════════════════════════════════════════════════════════════════════════════
const scenario1 = {
  id: 'through-ball',
  name: 'Through Ball Into Space',
  description:
    'Home #10 carries into midfield and threads a through ball behind the defensive line for striker #9, who has timed a run into open space.',
  possession: 'home',
  attackingTeam: 'home',
  duration: 6,
  players: [
    // HOME (attacking →)
    { id: 'H10', team: 'home', role: 'AM', path: [[0, 64, 34], [2.6, 71, 34], [6, 73, 33]] },
    { id: 'H9', team: 'home', role: 'ST', path: [[0, 79, 40], [2.6, 85, 45], [3.7, 91, 49], [6, 96, 50]] },
    { id: 'H7', team: 'home', role: 'Winger', path: [[0, 80, 59], [6, 90, 60]] },
    { id: 'H8', team: 'home', role: 'CM', path: [[0, 62, 22], [6, 70, 24]] },
    { id: 'H6', team: 'home', role: 'DM', path: [[0, 52, 36], [6, 58, 35]] },
    { id: 'H2', team: 'home', role: 'FB', path: [[0, 70, 64], [6, 82, 64]] },
    { id: 'H1', team: 'home', role: 'GK', path: still(9, 34) },
    // AWAY (defending the x=105 goal)
    { id: 'A4', team: 'away', role: 'CB', path: [[0, 88, 30], [6, 90, 33]] },
    { id: 'A5', team: 'away', role: 'CB', path: [[0, 88, 39], [6, 91, 41]] },
    { id: 'A2', team: 'away', role: 'FB', path: [[0, 84, 58], [6, 88, 59]] },
    { id: 'A6', team: 'away', role: 'DM', path: [[0, 69, 31], [6, 72, 33]] },
    { id: 'A8', team: 'away', role: 'CM', path: [[0, 66, 44], [6, 70, 45]] },
    { id: 'A1', team: 'away', role: 'GK', path: still(101, 34) },
  ],
  // Ball: with #10 until the pass at t≈2.6, then travels to #9.
  ball: [
    [0, 64, 34],
    [2.6, 71, 34],
    [3.7, 91, 49],
    [6, 95.5, 50],
  ],
  events: [{ t: 2.6, type: 'pass', player: 'H10' }],
}

// ════════════════════════════════════════════════════════════════════════════
// Scenario 2 — Risky central pass under pressure.
// DM #6 is pressed; the tempting central ball to AM #10 has a defender sitting in the
// lane (high risk). A wide outlet to FB #3 is safer and more open → engine should
// prefer the wide option and flag the central pass as risky.
// ════════════════════════════════════════════════════════════════════════════
const scenario2 = {
  id: 'risky-central',
  name: 'Risky Central Pass',
  description:
    'Home #6 is under pressure on the ball. The central pass to #10 is tempting but the lane is congested; the wider outlet is the lower-risk progressive option.',
  possession: 'home',
  attackingTeam: 'home',
  duration: 5,
  players: [
    // HOME
    { id: 'H6', team: 'home', role: 'DM', path: [[0, 54, 34], [5, 53, 33]] }, // ball carrier, pressed
    { id: 'H10', team: 'home', role: 'AM', path: [[0, 67, 35], [5, 70, 35]] }, // central, marked + lane blocked
    { id: 'H3', team: 'home', role: 'FB', path: [[0, 58, 9], [5, 66, 8]] }, // wide, open, advancing
    { id: 'H8', team: 'home', role: 'CM', path: [[0, 60, 50], [5, 64, 52]] },
    { id: 'H9', team: 'home', role: 'ST', path: [[0, 82, 40], [5, 84, 42]] }, // marked tightly (see A4)
    { id: 'H2', team: 'home', role: 'FB', path: [[0, 50, 62], [5, 55, 63]] },
    { id: 'H1', team: 'home', role: 'GK', path: still(10, 34) },
    // AWAY
    { id: 'A6', team: 'away', role: 'DM', path: [[0, 57, 34], [5, 55.5, 33]] }, // pressing the carrier
    { id: 'A8', team: 'away', role: 'CM', path: [[0, 62, 35], [5, 63, 35]] }, // sits in the central lane
    { id: 'A4', team: 'away', role: 'CB', path: [[0, 80, 40], [5, 82, 42]] }, // shadows the striker
    { id: 'A5', team: 'away', role: 'CB', path: [[0, 78, 30], [5, 80, 31]] },
    { id: 'A2', team: 'away', role: 'FB', path: [[0, 64, 16], [5, 68, 14]] }, // loosely tracks the wide outlet
    { id: 'A1', team: 'away', role: 'GK', path: still(101, 34) },
  ],
  ball: [
    [0, 54, 34],
    [5, 53.5, 33.5],
  ],
  events: [],
}

// ════════════════════════════════════════════════════════════════════════════
// Scenario 3 — Missed opportunity: the wide player was more open.
// The carrier eyes a congested central pass, but winger #11 is wide open with a clear
// lane and good progression → engine recommends the wide winger (the "missed" option).
// ════════════════════════════════════════════════════════════════════════════
const scenario3 = {
  id: 'missed-wide',
  name: 'Missed Wide Option',
  description:
    'Home #8 looks central where defenders are packed, but winger #11 is wide open with a clear lane in the final third — the higher-value option that was missed.',
  possession: 'home',
  attackingTeam: 'home',
  duration: 5,
  players: [
    // HOME
    { id: 'H8', team: 'home', role: 'CM', path: [[0, 66, 33], [5, 70, 33]] }, // ball carrier
    { id: 'H10', team: 'home', role: 'AM', path: [[0, 78, 35], [5, 82, 36]] }, // central, crowded
    { id: 'H11', team: 'home', role: 'Winger', path: [[0, 80, 60], [5, 90, 61]] }, // wide open
    { id: 'H9', team: 'home', role: 'ST', path: [[0, 84, 30], [5, 88, 29]] },
    { id: 'H6', team: 'home', role: 'DM', path: [[0, 56, 30], [5, 60, 31]] },
    { id: 'H3', team: 'home', role: 'FB', path: [[0, 64, 10], [5, 72, 9]] },
    { id: 'H1', team: 'home', role: 'GK', path: still(10, 34) },
    // AWAY — packed centrally, leaving the right channel open
    { id: 'A4', team: 'away', role: 'CB', path: [[0, 84, 33], [5, 86, 34]] },
    { id: 'A5', team: 'away', role: 'CB', path: [[0, 84, 38], [5, 86, 39]] },
    { id: 'A6', team: 'away', role: 'DM', path: [[0, 74, 34], [5, 77, 35]] }, // blocks central lane
    { id: 'A8', team: 'away', role: 'CM', path: [[0, 73, 33], [5, 76, 33]] }, // packed centrally (below the wing lane)
    { id: 'A2', team: 'away', role: 'FB', path: [[0, 76, 34], [5, 79, 34]] }, // tucked in centrally, leaving the right wing open
    { id: 'A1', team: 'away', role: 'GK', path: still(101, 34) },
  ],
  ball: [
    [0, 66, 33],
    [5, 70, 33],
  ],
  events: [],
}

const plays = [scenario1, scenario2, scenario3].map((s) => ({
  id: s.id,
  name: s.name,
  description: s.description,
  attackingTeam: s.attackingTeam,
  fps: FPS,
  pitch: { length: 105, width: 68 },
  frames: buildFrames(s),
}))

const out = {
  meta: {
    simulated: true,
    note: 'Simulated/sample tracking data generated for demonstration. Not real match data.',
    generatedBy: 'scripts/generate-plays.mjs',
    fps: FPS,
    pitch: { length: 105, width: 68 },
  },
  plays,
}

const dir = join(__dirname, '..', 'public', 'data')
mkdirSync(dir, { recursive: true })
const file = join(dir, 'soccer_plays.json')

// Preserve any externally-imported plays (e.g. the real SkillCorner clip added by
// import-skillcorner.mjs) so re-running the generator never silently drops them.
const generatedIds = new Set(plays.map((p) => p.id))
let preserved = []
if (existsSync(file)) {
  try {
    const prev = JSON.parse(readFileSync(file, 'utf8'))
    preserved = (prev.plays || []).filter((p) => p.real || !generatedIds.has(p.id))
    if (prev.meta?.hasRealData) out.meta.hasRealData = true
  } catch {
    /* unreadable/old file — just write fresh */
  }
}
out.plays = [...plays, ...preserved]

writeFileSync(file, JSON.stringify(out))
console.log(
  `Wrote ${file}: ${out.plays.length} plays (${plays.length} generated${preserved.length ? `, ${preserved.length} preserved` : ''}), ${plays[0].frames[0].players.length} players/frame`
)
