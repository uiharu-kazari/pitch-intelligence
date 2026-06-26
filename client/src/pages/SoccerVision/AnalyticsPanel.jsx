import { WEIGHTS, THREAT_TIERS } from '../../analytics/tactics'

const TIER_LABEL = { strong: 'Strong', risky: 'Risky', poor: 'Poor' }
const TIER_COLOR = { strong: '#22c55e', risky: '#f59e0b', poor: '#ef4444' }

export default function AnalyticsPanel({ play, time, analysis }) {
  if (!analysis) return null
  const rec = analysis.recommended

  return (
    <aside className="sv-panel">
      <div className="sv-panel__head">
        <div>
          <p className="sv-panel__eyebrow">Now analysing</p>
          <h3 className="sv-panel__play">{play.name}</h3>
        </div>
        {play.real ? (
          <span className="sv-sim sv-sim--real" title={play.source || 'Real tracking data'}>
            REAL DATA
          </span>
        ) : (
          <span className="sv-sim" title="Simulated tracking data">SIM DATA</span>
        )}
      </div>
      <p className="sv-panel__desc">{play.description}</p>
      {play.real && play.source && <p className="sv-panel__source">Source: {play.source}</p>}

      <div className="sv-stat-grid">
        <Stat label="Timestamp" value={`${time.toFixed(1)}s`} />
        <Stat label="Ball carrier" value={analysis.carrier.label} />
        <Stat label="Nearest defender" value={`${analysis.nearestDefender.distance} m`} />
        <Stat label="Carrier pressure" value={`${analysis.carrierPressure}%`} />
      </div>

      {rec ? (
        <div className="sv-best">
          <div className="sv-best__top">
            <span className="sv-best__label">Best passing option</span>
            <span className="sv-best__name">{rec.label}</span>
          </div>
          <div className="sv-scores">
            <ScoreBar label="Attacking threat" value={rec.threat} tone="threat" />
            <ScoreBar label="Pass risk" value={rec.risk} tone="risk" />
          </div>
          <p className="sv-explain">{analysis.explanation}</p>
        </div>
      ) : (
        <p className="sv-explain">No clear forward option — hold or dribble.</p>
      )}

      <div className="sv-options">
        <p className="sv-options__title">Ranked options</p>
        {analysis.candidates.slice(0, 5).map((c) => (
          <div key={c.id} className={`sv-opt ${rec && c.id === rec.id ? 'sv-opt--best' : ''}`}>
            <span className="sv-opt__dot" style={{ background: TIER_COLOR[c.tier] }} />
            <span className="sv-opt__name">{c.label}</span>
            <span className="sv-opt__bar">
              <span className="sv-opt__fill" style={{ width: `${c.threat}%`, background: TIER_COLOR[c.tier] }} />
            </span>
            <span className="sv-opt__val tnum">{c.threat}</span>
          </div>
        ))}
      </div>

      <Legend />
      <FormulaCard />
    </aside>
  )
}

function Stat({ label, value }) {
  return (
    <div className="sv-stat">
      <p className="sv-stat__label">{label}</p>
      <p className="sv-stat__value tnum">{value}</p>
    </div>
  )
}

function ScoreBar({ label, value, tone }) {
  return (
    <div className={`sv-score sv-score--${tone}`}>
      <div className="sv-score__row">
        <span>{label}</span>
        <span className="tnum">{value}/100</span>
      </div>
      <div className="sv-score__track">
        <div className="sv-score__fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function Legend() {
  return (
    <div className="sv-legend">
      <p className="sv-legend__title">Legend</p>
      <ul>
        {THREAT_TIERS.map((t) => (
          <li key={t.key}>
            <span className="sv-legend__lane" style={{ background: t.color }} />
            {t.label} (threat {t.key === 'poor' ? '< 40' : t.key === 'risky' ? '40–59' : '≥ 60'})
          </li>
        ))}
        <li><span className="sv-legend__chip sv-legend__chip--home" /> Home (attacking)</li>
        <li><span className="sv-legend__chip sv-legend__chip--away" /> Away (defending)</li>
        <li><span className="sv-legend__zone" /> Red zone = defender pressure</li>
        <li><span className="sv-legend__zone sv-legend__zone--space" /> Green zone = open space</li>
        <li><span className="sv-legend__ring" /> Glowing ring = recommended receiver</li>
      </ul>
    </div>
  )
}

function FormulaCard() {
  const pct = (w) => Math.round(w * 100)
  return (
    <details className="sv-formula" open>
      <summary>How the attacking-threat score works</summary>
      <p className="sv-formula__eq">
        threat = {pct(WEIGHTS.forwardProgress)}% · forward progress
        + {pct(WEIGHTS.receiverSpace)}% · receiver space
        + {pct(WEIGHTS.laneOpenness)}% · lane openness
        + {pct(WEIGHTS.centrality)}% · centrality
        + {pct(WEIGHTS.pressureRelief)}% · (1 − defensive pressure)
      </p>
      <p className="sv-formula__note">
        Each factor is normalised to 0–1, combined with the weights above, and scaled to
        0–100. Backward passes count as negative forward progress, so safe square balls can’t
        masquerade as threats. <strong>Pass risk = 100 − threat.</strong>
      </p>
    </details>
  )
}
