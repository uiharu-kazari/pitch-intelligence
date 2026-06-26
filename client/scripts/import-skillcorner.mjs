// Adapter: convert a SkillCorner Open Data possession window into Soccer Vision 3D's
// play schema (the same shape generate-plays.mjs produces).
//
// SkillCorner tracking: meters, centered at pitch midpoint; player_data entries
// {x,y,player_id,is_detected}; ball_data {x,y,z,is_detected}; possession.group is
// "home team"/"away team"; 10 fps. Roles come from match.json `players`.
//
// We relabel the team in possession as 'home' (attacking, +x) so the module's analytics
// (which assume home attacks +x) work unchanged, flipping coordinates as needed. Sparse or
// missing player samples are linearly interpolated to produce continuous frames, and the
// stream is resampled from 10 fps to the module's target fps.
//
// Pure functions are exported for tests; the CLI runs when invoked directly.
//
// Data source: https://github.com/SkillCorner/opendata (MIT). The 85 MB tracking file is
// Git-LFS; this script reads a local copy (see README for how to fetch it).

import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

export const SOURCE_FPS = 10

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))
const round = (n, d = 2) => Number(n.toFixed(d))

export function sideToDir(side) {
  return side === 'left_to_right' ? 1 : -1
}

// Map a SkillCorner player_role to the module's role vocabulary.
export function mapRole(role) {
  if (!role) return 'CM'
  const name = role.name || ''
  const acr = role.acronym || ''
  if (acr === 'GK' || name === 'Goalkeeper') return 'GK'
  switch (role.position_group) {
    case 'Central Defender':
      return 'CB'
    case 'Full Back':
      return 'FB'
    case 'Wide Attacker':
      return 'Winger'
    case 'Center Forward':
      return 'ST'
    case 'Midfield':
      return 'CM'
    default:
      return 'CM'
  }
}

// SkillCorner (centered meters, source pitch length×width) → module coords on the
// canonical 105×68 pitch with home attacking +x. `flip` rotates 180° so the attacking
// team plays toward +x while keeping left/right intact.
export const TARGET = { length: 105, width: 68 }
export function toMyCoords(x, y, { length, width, flip }) {
  let sx = x
  let sy = y
  if (flip) {
    sx = -sx
    sy = -sy
  }
  const mx = ((sx + length / 2) / length) * TARGET.length
  const my = ((sy + width / 2) / width) * TARGET.width
  return { x: round(clamp(mx, 0, TARGET.length), 2), y: round(clamp(my, 0, TARGET.width), 2) }
}

// Build player_id → roster info, relabeling the attacking team as 'home'.
export function buildRoster(matchJson, attackingTeamId) {
  const roster = new Map()
  for (const p of matchJson.players) {
    const team = p.team_id === attackingTeamId ? 'home' : 'away'
    roster.set(p.id, {
      id: `${team === 'home' ? 'H' : 'A'}${p.number}`,
      team,
      role: mapRole(p.player_role),
      number: p.number,
    })
  }
  return roster
}

// Linear interpolation over sparse [{t,x,y}] samples (sorted by t); clamps past the ends.
export function lerpSamples(samples, t) {
  if (samples.length === 0) return null
  if (t <= samples[0].t) return { x: samples[0].x, y: samples[0].y }
  const lastS = samples[samples.length - 1]
  if (t >= lastS.t) return { x: lastS.x, y: lastS.y }
  for (let i = 0; i < samples.length - 1; i++) {
    const a = samples[i]
    const b = samples[i + 1]
    if (t >= a.t && t <= b.t) {
      const f = (t - a.t) / (b.t - a.t || 1)
      return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f }
    }
  }
  return { x: lastS.x, y: lastS.y }
}

// Collect per-player and ball samples (in seconds from window start) over [start,end].
export function collectSamples(frames, start, end) {
  const players = new Map() // pid -> [{t,x,y}]
  const ball = []
  for (const fr of frames) {
    if (fr.frame < start || fr.frame > end) continue
    const t = (fr.frame - start) / SOURCE_FPS
    const b = fr.ball_data || {}
    if (b.x != null && b.y != null) ball.push({ t, x: b.x, y: b.y })
    for (const p of fr.player_data || []) {
      if (p.x == null || p.y == null) continue
      if (!players.has(p.player_id)) players.set(p.player_id, [])
      players.get(p.player_id).push({ t, x: p.x, y: p.y })
    }
  }
  return { players, ball }
}

// Build the module-shaped play from collected samples + roster.
export function buildPlay({ roster, samples, durationSec, targetFps, length, width, flip, coverage = 0.6 }) {
  const N = Math.max(1, Math.round(durationSec * targetFps))
  // Keep players tracked across enough of the window (avoids ghosts), with a known role.
  const kept = [...samples.players.entries()]
    .map(([pid, s]) => ({ pid, s, info: roster.get(pid) }))
    .filter((e) => e.info && e.s.length >= 2 && e.s[e.s.length - 1].t - e.s[0].t >= durationSec * coverage)
    // attacking team first, GKs last, then by number — stable, readable order
    .sort((a, b) => (a.info.team === b.info.team ? a.info.number - b.info.number : a.info.team === 'home' ? -1 : 1))

  const prev = {}
  const frames = []
  for (let i = 0; i <= N; i++) {
    const t = i / targetFps
    const players = kept.map((e) => {
      const raw = lerpSamples(e.s, t)
      const { x, y } = toMyCoords(raw.x, raw.y, { length, width, flip })
      const key = e.info.id
      const last = prev[key]
      const speed = last ? round(Math.hypot(x - last.x, y - last.y) * targetFps, 1) : 0
      prev[key] = { x, y }
      return { id: e.info.id, team: e.info.team, role: e.info.role, x, y, speed }
    })
    const braw = lerpSamples(samples.ball, t) || { x: 0, y: 0 }
    const ball = toMyCoords(braw.x, braw.y, { length, width, flip })
    frames.push({ t: round(t, 2), ball, possession: 'home', players })
  }
  return frames
}

// ── CLI ─────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const a = {}
  for (let i = 2; i < argv.length; i++) {
    const m = argv[i].match(/^--([^=]+)=(.*)$/)
    if (m) a[m[1]] = m[2]
  }
  return a
}

function main() {
  const a = parseArgs(process.argv)
  const matchPath = a.match
  const trackingPath = a.tracking
  const out = a.out
  if (!matchPath || !trackingPath || !out) {
    console.error('usage: node import-skillcorner.mjs --match=<match.json> --tracking=<tracking.jsonl> --out=<soccer_plays.json> [--period=1 --start=5429 --end=5504 --fps=12 --id=real-aleague]')
    process.exit(2)
  }
  const period = Number(a.period ?? 1)
  const start = Number(a.start ?? 5429)
  const end = Number(a.end ?? 5504)
  const targetFps = Number(a.fps ?? 12)
  const group = a.group ?? 'home team'

  const matchJson = JSON.parse(readFileSync(matchPath, 'utf8'))
  const length = matchJson.pitch_length || 105
  const width = matchJson.pitch_width || 68
  const homeId = matchJson.home_team.id
  const awayId = matchJson.away_team.id
  const attackingTeamId = group === 'home team' ? homeId : awayId

  // Attacking direction in raw data for this period → flip so attackers play toward +x.
  const side = (matchJson.home_team_side || ['left_to_right', 'right_to_left'])[period - 1]
  const homeDir = sideToDir(side)
  const attackingDir = attackingTeamId === homeId ? homeDir : -homeDir
  const flip = attackingDir < 0

  // Stream tracking, keep window frames only.
  const frames = []
  for (const line of readFileSync(trackingPath, 'utf8').split('\n')) {
    if (!line) continue
    const fr = JSON.parse(line)
    if (fr.period === period && fr.frame >= start && fr.frame <= end) frames.push(fr)
  }

  const roster = buildRoster(matchJson, attackingTeamId)
  const samples = collectSamples(frames, start, end)
  const durationSec = (end - start) / SOURCE_FPS
  const playFrames = buildPlay({ roster, samples, durationSec, targetFps, length, width, flip })

  const attTeam = attackingTeamId === homeId ? matchJson.home_team : matchJson.away_team
  const defTeam = attackingTeamId === homeId ? matchJson.away_team : matchJson.home_team
  const play = {
    id: a.id || 'real-aleague',
    name: a.name || 'Real Match: A-League Attack',
    description:
      a.desc ||
      `Real broadcast-tracking possession — ${attTeam.name} build an attack against ${defTeam.name} (A-League 2024/25). Positions are interpolated from SkillCorner tracking; the same analytics are applied.`,
    attackingTeam: 'home',
    real: true,
    source: 'SkillCorner Open Data — A-League 2024/25',
    teams: { attacking: attTeam.name, defending: defTeam.name },
    fps: targetFps,
    pitch: { length: TARGET.length, width: TARGET.width },
    frames: playFrames,
  }

  // Merge into existing soccer_plays.json (replace any play with the same id).
  const data = JSON.parse(readFileSync(out, 'utf8'))
  data.plays = data.plays.filter((p) => p.id !== play.id).concat(play)
  data.meta = { ...data.meta, hasRealData: true }
  writeFileSync(out, JSON.stringify(data))
  console.log(
    `Imported '${play.id}': ${play.frames.length} frames @ ${targetFps}fps, ${play.frames[0].players.length} players, ${attTeam.name} vs ${defTeam.name}. Merged into ${out}.`
  )
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
}
