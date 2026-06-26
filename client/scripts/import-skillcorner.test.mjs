// Unit tests for the SkillCorner adapter pure functions. Run: node --test scripts/
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  sideToDir,
  mapRole,
  toMyCoords,
  lerpSamples,
  buildRoster,
  collectSamples,
  buildPlay,
} from './import-skillcorner.mjs'

const near = (a, b, eps = 0.5) => Math.abs(a - b) <= eps

test('sideToDir maps attacking direction', () => {
  assert.equal(sideToDir('left_to_right'), 1)
  assert.equal(sideToDir('right_to_left'), -1)
})

test('mapRole maps SkillCorner roles to module vocabulary', () => {
  assert.equal(mapRole({ name: 'Goalkeeper', acronym: 'GK', position_group: 'Other' }), 'GK')
  assert.equal(mapRole({ position_group: 'Central Defender' }), 'CB')
  assert.equal(mapRole({ position_group: 'Full Back' }), 'FB')
  assert.equal(mapRole({ position_group: 'Wide Attacker' }), 'Winger')
  assert.equal(mapRole({ position_group: 'Center Forward' }), 'ST')
  assert.equal(mapRole({ position_group: 'Midfield' }), 'CM')
  assert.equal(mapRole({ position_group: 'Substitute-ish unknown' }), 'CM') // fallback
  assert.equal(mapRole(null), 'CM')
})

test('toMyCoords centers and scales to 105x68', () => {
  const c = toMyCoords(0, 0, { length: 104, width: 68, flip: false })
  assert.ok(near(c.x, 52.5), `center x ${c.x}`)
  assert.ok(near(c.y, 34), `center y ${c.y}`)
  // a +x player maps to the attacking half
  assert.ok(toMyCoords(20, 0, { length: 104, width: 68, flip: false }).x > 52.5)
})

test('toMyCoords flip rotates 180 degrees', () => {
  const noflip = toMyCoords(-20, -5, { length: 104, width: 68, flip: false })
  const flip = toMyCoords(20, 5, { length: 104, width: 68, flip: true })
  assert.ok(near(noflip.x, flip.x), `${noflip.x} vs ${flip.x}`)
  assert.ok(near(noflip.y, flip.y), `${noflip.y} vs ${flip.y}`)
})

test('toMyCoords clamps off-pitch positions into bounds', () => {
  const c = toMyCoords(999, -999, { length: 104, width: 68, flip: false })
  assert.ok(c.x >= 0 && c.x <= 105)
  assert.ok(c.y >= 0 && c.y <= 68)
})

test('lerpSamples interpolates and clamps ends', () => {
  const s = [
    { t: 0, x: 0, y: 0 },
    { t: 1, x: 10, y: 20 },
  ]
  assert.deepEqual(lerpSamples(s, 0.5), { x: 5, y: 10 })
  assert.deepEqual(lerpSamples(s, -1), { x: 0, y: 0 }) // before first
  assert.deepEqual(lerpSamples(s, 5), { x: 10, y: 20 }) // after last
  assert.equal(lerpSamples([], 0), null)
})

const MATCH = {
  pitch_length: 104,
  pitch_width: 68,
  home_team: { id: 1, name: 'Home FC' },
  away_team: { id: 2, name: 'Away FC' },
  home_team_side: ['left_to_right', 'right_to_left'],
  players: [
    { id: 101, team_id: 1, number: 9, player_role: { position_group: 'Center Forward' } },
    { id: 102, team_id: 1, number: 1, player_role: { name: 'Goalkeeper', acronym: 'GK', position_group: 'Other' } },
    { id: 201, team_id: 2, number: 4, player_role: { position_group: 'Central Defender' } },
  ],
}

test('buildRoster relabels attacking team as home with prefixed ids', () => {
  const r = buildRoster(MATCH, 1)
  assert.equal(r.get(101).id, 'H9')
  assert.equal(r.get(101).team, 'home')
  assert.equal(r.get(102).role, 'GK')
  assert.equal(r.get(201).id, 'A4')
  assert.equal(r.get(201).team, 'away')
})

// Synthetic tracking: 0..10 source frames (1.0s @10fps); player 101 missing mid-window
// to exercise gap-fill via interpolation.
function syntheticFrames() {
  const frames = []
  for (let f = 0; f <= 10; f++) {
    const players = [
      { player_id: 102, x: -50, y: 0 }, // GK static
      { player_id: 201, x: 20 + f * 0.5, y: 5 },
    ]
    if (f === 0) players.push({ player_id: 101, x: -20, y: 0 })
    else if (f === 10) players.push({ player_id: 101, x: 0, y: 0 }) // only endpoints → must interpolate
    else if (f % 3 === 0) players.push({ player_id: 201, x: 20 + f * 0.5, y: 5 }) // noise dup (ignored)
    frames.push({ frame: f, period: 1, ball_data: { x: 10 + f * 2, y: 0 }, possession: { group: 'home team' }, player_data: players })
  }
  return frames
}

test('buildPlay produces continuous, in-bounds frames with gap-fill', () => {
  const frames = syntheticFrames()
  const roster = buildRoster(MATCH, 1)
  const samples = collectSamples(frames, 0, 10)
  const out = buildPlay({ roster, samples, durationSec: 1.0, targetFps: 12, length: 104, width: 68, flip: false })

  // 1.0s @ 12fps → 13 frames (0..12)
  assert.equal(out.length, 13)

  // every frame has the same 3 players, all in bounds, possession home
  const ids0 = out[0].players.map((p) => p.id).sort()
  for (const fr of out) {
    assert.equal(fr.possession, 'home')
    assert.deepEqual(fr.players.map((p) => p.id).sort(), ids0)
    for (const p of fr.players) {
      assert.ok(p.x >= 0 && p.x <= 105, `x ${p.x}`)
      assert.ok(p.y >= 0 && p.y <= 68, `y ${p.y}`)
      assert.ok(typeof p.speed === 'number')
    }
    assert.ok(fr.ball.x >= 0 && fr.ball.x <= 105)
  }

  // gap-fill: H9 had samples only at t=0 (-20) and t=1 (0); at the midpoint it must be
  // interpolated to raw x ≈ -10 → mapped ≈ ((-10+52)/104)*105 ≈ 42.4
  const mid = out.find((f) => near(f.t, 0.5, 0.05))
  const h9 = mid.players.find((p) => p.id === 'H9')
  assert.ok(near(h9.x, 42.4, 1.0), `interpolated H9 x ${h9.x}`)
})

test('flip makes the attacking (away) team play toward +x', () => {
  const frames = syntheticFrames()
  const roster = buildRoster(MATCH, 2) // away attacking
  const samples = collectSamples(frames, 0, 10)
  // away attacks right_to_left-derived dir → flip true
  const out = buildPlay({ roster, samples, durationSec: 1.0, targetFps: 12, length: 104, width: 68, flip: true })
  // away CB (relabeled home) raw x ~20..25 → flipped to lower x band
  const cb = out[0].players.find((p) => p.id === 'H4')
  assert.ok(cb, 'away CB relabeled as H4')
  assert.ok(cb.x < 52.5, `flipped CB x ${cb.x} should be < midfield`)
})
