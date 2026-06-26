// Tactical analytics engine for Soccer Vision 3D.
//
// Pure, deterministic functions over a single tracking frame. The attacking-threat score
// uses a transparent weighted formula (weights from the product brief); every component is
// normalized to 0–1, combined, then scaled to 0–100. pass_risk = 100 − threat.
//
// Pitch: x ∈ [0,105], y ∈ [0,68]. HOME attacks toward x=105, AWAY toward x=0.

export const WEIGHTS = {
  forwardProgress: 0.35,
  receiverSpace: 0.25,
  laneOpenness: 0.2,
  centrality: 0.1,
  pressureRelief: 0.1, // (1 − defensive pressure on the receiver)
}

// Normalization caps (meters).
const FORWARD_MAX = 35 // a 35m+ forward pass = full forward credit
const SPACE_MAX = 12 // 12m+ of separation = fully "open"
const LANE_WIDTH = 6 // opponent within 6m of the lane fully closes it
const PRESS_MAX = 10 // defender within 0m = full pressure, 10m+ = none

export const THREAT_TIERS = [
  { key: 'strong', min: 60, label: 'Strong option', color: '#22c55e' },
  { key: 'risky', min: 40, label: 'Risky but possible', color: '#f59e0b' },
  { key: 'poor', min: 0, label: 'Poor option', color: '#ef4444' },
]

export function tierFor(score) {
  return THREAT_TIERS.find((t) => score >= t.min) ?? THREAT_TIERS[THREAT_TIERS.length - 1]
}

const clamp01 = (n) => Math.max(0, Math.min(1, n))
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

// Perpendicular distance from point p to segment a→b, but only counted when p projects
// *between* the endpoints (i.e. genuinely "in the lane"); otherwise returns Infinity.
function distToLane(p, a, b) {
  const abx = b.x - a.x
  const aby = b.y - a.y
  const len2 = abx * abx + aby * aby
  if (len2 === 0) return Infinity
  const t = ((p.x - a.x) * abx + (p.y - a.y) * aby) / len2
  if (t <= 0.05 || t >= 0.95) return Infinity // near the carrier or past the receiver
  const projX = a.x + t * abx
  const projY = a.y + t * aby
  return Math.hypot(p.x - projX, p.y - projY)
}

const dirFor = (team) => (team === 'home' ? 1 : -1)
const targetGoalX = (team) => (team === 'home' ? 105 : 0)

// Player display label, e.g. "ST #9".
export function labelOf(player) {
  const num = (player.id.match(/\d+/) || [''])[0]
  return `${player.role} #${num}`
}

export function nearestOpponent(point, opponents) {
  let best = null
  let bestD = Infinity
  for (const o of opponents) {
    const d = dist(point, o)
    if (d < bestD) {
      bestD = d
      best = o
    }
  }
  return { player: best, distance: bestD }
}

// ── Component metrics (each returns 0–1 unless noted) ──────────────────────────
// Forward progress is SIGNED in [-1, 1]: backward passes carry negative attacking value,
// so a safe square/back pass cannot outrank a genuine forward threat. The final score is
// clamped to [0, 100] after all terms combine.
export function forwardProgress(carrier, receiver, team) {
  const gain = (receiver.x - carrier.x) * dirFor(team)
  return Math.max(-1, Math.min(1, gain / FORWARD_MAX))
}

export function receiverSpace(receiver, opponents) {
  const { distance } = nearestOpponent(receiver, opponents)
  return clamp01(distance / SPACE_MAX)
}

export function laneOpenness(carrier, receiver, opponents) {
  let minPerp = Infinity
  for (const o of opponents) {
    const d = distToLane(o, carrier, receiver)
    if (d < minPerp) minPerp = d
  }
  if (!isFinite(minPerp)) return 1
  return clamp01(minPerp / LANE_WIDTH)
}

export function centralityBonus(receiver) {
  return clamp01(1 - Math.abs(receiver.y - 34) / 34)
}

// Defensive pressure on a point (0 = none, 1 = a defender right on top).
export function pressure(point, opponents) {
  const { distance } = nearestOpponent(point, opponents)
  return clamp01(1 - distance / PRESS_MAX)
}

// Combine components into a 0–100 attacking-threat score.
export function threatScore(c) {
  const raw =
    WEIGHTS.forwardProgress * c.forwardProgress +
    WEIGHTS.receiverSpace * c.receiverSpace +
    WEIGHTS.laneOpenness * c.laneOpenness +
    WEIGHTS.centrality * c.centrality +
    WEIGHTS.pressureRelief * (1 - c.pressure)
  return Math.round(clamp01(raw) * 100)
}

// ── Frame-level analysis ───────────────────────────────────────────────────────
// Returns { carrier, candidates[], recommended, nearestDefender, carrierPressure, explanation }.
export function analyzeFrame(frame, attackingTeam) {
  const attackers = frame.players.filter((p) => p.team === attackingTeam)
  const opponents = frame.players.filter((p) => p.team !== attackingTeam)

  // Ball carrier = attacker nearest the ball.
  let carrier = attackers[0]
  let cd = Infinity
  for (const a of attackers) {
    const d = dist(a, frame.ball)
    if (d < cd) {
      cd = d
      carrier = a
    }
  }

  const candidates = attackers
    .filter((p) => p.id !== carrier.id && p.role !== 'GK')
    .map((receiver) => {
      const comp = {
        forwardProgress: forwardProgress(carrier, receiver, attackingTeam),
        receiverSpace: receiverSpace(receiver, opponents),
        laneOpenness: laneOpenness(carrier, receiver, opponents),
        centrality: centralityBonus(receiver),
        pressure: pressure(receiver, opponents),
      }
      const threat = threatScore(comp)
      const sep = nearestOpponent(receiver, opponents).distance
      const gain = (receiver.x - carrier.x) * dirFor(attackingTeam)
      return {
        id: receiver.id,
        label: labelOf(receiver),
        player: receiver,
        components: comp,
        threat,
        risk: 100 - threat,
        tier: tierFor(threat).key,
        separation: Number(sep.toFixed(1)),
        forwardGain: Number(gain.toFixed(1)),
      }
    })
    // Highest threat first; deterministic id tie-break.
    .sort((a, b) => b.threat - a.threat || a.id.localeCompare(b.id))

  const recommended = candidates[0] ?? null
  const nd = nearestOpponent(carrier, opponents)
  const carrierPressure = pressure(carrier, opponents)

  return {
    carrier: { ...carrier, label: labelOf(carrier) },
    candidates,
    recommended,
    nearestDefender: { distance: Number(nd.distance.toFixed(1)), player: nd.player },
    carrierPressure: Math.round(carrierPressure * 100),
    explanation: explain(recommended, attackingTeam),
  }
}

function explain(rec, team) {
  if (!rec) return 'No clear forward option — the ball carrier should hold or dribble.'
  const lane = rec.components.laneOpenness
  const laneWord = lane > 0.75 ? 'mostly clear' : lane > 0.45 ? 'partly open' : 'congested'
  const goalX = targetGoalX(team)
  const inFinalThird =
    team === 'home' ? rec.player.x >= 70 : rec.player.x <= 35
  const advanceClause =
    rec.forwardGain > 1
      ? `advances the attack ${rec.forwardGain}m upfield${inFinalThird ? ' into the final third' : ''}`
      : 'keeps possession safely'
  return `${rec.label} is the best option because the passing lane is ${laneWord}, the receiver has ${rec.separation}m of separation, and the pass ${advanceClause}.`
}
