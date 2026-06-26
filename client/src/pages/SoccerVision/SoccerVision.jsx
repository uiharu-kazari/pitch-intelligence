import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './Scene'
import AnalyticsPanel from './AnalyticsPanel'
import { analyzeFrame } from '../../analytics/tactics'
import { PlayIcon, PauseIcon, RefreshIcon, CameraIcon, TopDownIcon } from '../../icons'
import './SoccerVision.css'

const SPEEDS = [0.5, 1, 2]
const OVERLAY_KEYS = [
  { key: 'lanes', label: 'Passing lanes' },
  { key: 'pressure', label: 'Pressure' },
  { key: 'space', label: 'Open space' },
  { key: 'trails', label: 'Trails' },
]

export default function SoccerVision() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [scenario, setScenario] = useState(0)
  const [frame, setFrame] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [view, setView] = useState('default')
  const [viewNonce, setViewNonce] = useState(0)
  const [overlaysOn, setOverlaysOn] = useState({ lanes: true, pressure: true, space: true, trails: true })

  const cursorRef = useRef(0)
  const playRef = useRef({ playing: true, speed: 1 })

  useEffect(() => {
    playRef.current = { playing, speed }
  }, [playing, speed])

  // Load simulated tracking data.
  useEffect(() => {
    let alive = true
    fetch('/data/soccer_plays.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e.message))
    return () => {
      alive = false
    }
  }, [])

  const play = data?.plays[scenario]
  const frames = play?.frames
  const last = frames ? frames.length - 1 : 0

  // Precompute completed passes (from event markers) per scenario.
  const passes = useMemo(() => {
    if (!frames) return []
    const fps = play.fps
    const out = []
    frames.forEach((fr, i) => {
      if (fr.event === 'pass' && fr.eventPlayer) {
        const passer = fr.players.find((p) => p.id === fr.eventPlayer)
        const toIdx = Math.min(last, i + Math.round(0.8 * fps))
        if (passer) out.push({ t: fr.t, from: [passer.x, passer.y], to: [frames[toIdx].ball.x, frames[toIdx].ball.y] })
      }
    })
    return out
  }, [frames, play, last])

  // Per-frame analysis (recomputed only when the integer frame changes).
  const analysis = useMemo(
    () => (frames ? analyzeFrame(frames[Math.min(frame, last)], play.attackingTeam) : null),
    [frames, frame, last, play]
  )
  const defenders = useMemo(
    () => (frames ? frames[Math.min(frame, last)].players.filter((p) => p.team !== play.attackingTeam && p.role !== 'GK') : []),
    [frames, frame, last, play]
  )

  const resetTo = useCallback((auto = true) => {
    cursorRef.current = 0
    setFrame(0)
    setPlaying(auto)
  }, [])

  const selectScenario = (i) => {
    setScenario(i)
    cursorRef.current = 0
    setFrame(0)
    setPlaying(true)
    setView('default')
    setViewNonce((n) => n + 1)
  }

  const togglePlay = () => {
    if (cursorRef.current >= last) cursorRef.current = 0 // replay from start if at end
    setPlaying((p) => !p)
  }

  const onScrub = (e) => {
    const v = Number(e.target.value)
    cursorRef.current = v
    setFrame(v)
    setPlaying(false)
  }

  const setCamera = (v) => {
    setView(v)
    setViewNonce((n) => n + 1)
  }

  if (error) {
    return (
      <main className="main">
        <div className="states states--error glass" role="alert">
          <h2>Couldn&apos;t load tracking data</h2>
          <p className="states__detail">{error}</p>
        </div>
      </main>
    )
  }
  if (!data) {
    return (
      <main className="main">
        <div className="states" aria-busy="true">
          <div className="skeleton skeleton--panel" style={{ height: 480 }} />
          <p className="states__hint">Loading tactical data…</p>
        </div>
      </main>
    )
  }

  const time = frames[Math.min(frame, last)].t

  return (
    <main className="sv-module">
      <div className="sv-stage">
        <div className="sv-toolbar">
          <div className="sv-scenarios" role="group" aria-label="Scenario">
            {data.plays.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className={`sv-chip ${i === scenario ? 'sv-chip--active' : ''}`}
                onClick={() => selectScenario(i)}
              >
                <span className="sv-chip__num">{i + 1}</span>
                {p.name}
              </button>
            ))}
          </div>
          <div className="sv-toolbar__right">
            <div className="sv-toggles">
              {OVERLAY_KEYS.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  className={`sv-toggle ${overlaysOn[o.key] ? 'sv-toggle--on' : ''}`}
                  aria-pressed={overlaysOn[o.key]}
                  onClick={() => setOverlaysOn((s) => ({ ...s, [o.key]: !s[o.key] }))}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <div className="sv-cam">
              <button type="button" className="sv-iconbtn" onClick={() => setCamera('top')} title="Top-down view">
                <TopDownIcon size={18} />
              </button>
              <button type="button" className="sv-iconbtn" onClick={() => setCamera('default')} title="Reset camera">
                <CameraIcon size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="sv-canvas-wrap">
          <Canvas shadows dpr={[1, 2]} camera={{ position: [2, 52, 92], fov: 45, near: 0.1, far: 1000 }}>
            <Scene
              frames={frames}
              fps={play.fps}
              cursorRef={cursorRef}
              playRef={playRef}
              onFrame={setFrame}
              onEnd={() => setPlaying(false)}
              analysis={analysis}
              defenders={defenders}
              passes={passes}
              currentTime={time}
              carrierId={analysis?.carrier?.id}
              attackingTeam={play.attackingTeam}
              frame={Math.min(frame, last)}
              view={view}
              viewNonce={viewNonce}
              overlaysOn={overlaysOn}
            />
          </Canvas>
          <span className="sv-canvas-tag">
            {play.real ? 'Real broadcast tracking · SkillCorner A-League' : 'Simulated tracking data'} · drag to orbit
          </span>
        </div>

        <div className="sv-controls">
          <button type="button" className="sv-playbtn shine" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
          </button>
          <button type="button" className="sv-iconbtn" onClick={() => resetTo(true)} title="Restart">
            <RefreshIcon size={18} />
          </button>
          <input
            className="sv-scrub"
            type="range"
            min={0}
            max={last}
            value={Math.min(frame, last)}
            onChange={onScrub}
            aria-label="Timeline"
            style={{ '--p': `${last ? (Math.min(frame, last) / last) * 100 : 0}%` }}
          />
          <span className="sv-time tnum">
            {time.toFixed(1)}s / {frames[last].t.toFixed(1)}s
          </span>
          <div className="sv-speeds" role="group" aria-label="Speed">
            {SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                className={`sv-speed ${speed === s ? 'sv-speed--active' : ''}`}
                onClick={() => setSpeed(s)}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnalyticsPanel play={play} time={time} analysis={analysis} />
    </main>
  )
}
