// Dev sanity check: runs the generated plays through the analytics engine and prints the
// ranked passing options at a decision frame for each scenario.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { analyzeFrame } from '../src/analytics/tactics.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const data = JSON.parse(readFileSync(join(__dirname, '..', 'public', 'data', 'soccer_plays.json'), 'utf8'))

// Decision frame (fraction through the play) per scenario + the expected outcome.
const expect = {
  'through-ball': { at: 0.42, rec: 'H9' }, // through ball to the striker
  'risky-central': { at: 0.5, recNot: 'H10', riskyId: 'H10' }, // central pass must be flagged risky, not chosen
  'missed-wide': { at: 0.5, rec: 'H11' }, // the open winger
}

let failures = 0
for (const play of data.plays) {
  const e = expect[play.id] ?? { at: 0.5 }
  const idx = Math.round(e.at * (play.frames.length - 1))
  const frame = play.frames[idx]
  const a = analyzeFrame(frame, play.attackingTeam)
  console.log(`\n=== ${play.name} (${play.id}) @ t=${frame.t}s ===`)
  console.log(`carrier: ${a.carrier.label}  nearestDef=${a.nearestDefender.distance}m  carrierPressure=${a.carrierPressure}`)
  a.candidates.slice(0, 5).forEach((c, i) =>
    console.log(`  ${i === 0 ? '★' : ' '} ${c.label.padEnd(12)} threat=${String(c.threat).padStart(3)} risk=${String(c.risk).padStart(3)} tier=${c.tier.padEnd(6)} fwd=${c.forwardGain}m sep=${c.separation}m`)
  )
  console.log(`  → RECOMMENDED: ${a.recommended?.label}`)
  console.log(`  → ${a.explanation}`)

  const recId = a.recommended?.id
  if (e.rec && recId !== e.rec) { console.log(`  ✗ expected recommendation ${e.rec}, got ${recId}`); failures++ }
  if (e.recNot && recId === e.recNot) { console.log(`  ✗ ${e.recNot} should NOT be recommended`); failures++ }
  if (e.riskyId) {
    const c = a.candidates.find((x) => x.id === e.riskyId)
    if (!c || c.tier === 'strong') { console.log(`  ✗ ${e.riskyId} should be risky/poor, got ${c?.tier}`); failures++ }
  }
}

console.log(`\n${failures === 0 ? '✓ all scenario expectations met' : `✗ ${failures} expectation(s) failed`}`)
process.exit(failures === 0 ? 0 : 1)
