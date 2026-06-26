import { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ReferenceLine,
  ZAxis,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'
import TeamTable from './TeamTable'
import Insights from './Insights'
import { TrendUpIcon, ScaleIcon, GaugeIcon, SparkIcon } from '../icons'
import { useScrollReveal, prefersReducedMotion } from '../motion'
import '../styles/Dashboard.css'

const AXIS = { stroke: 'var(--border-strong)' }
const shortName = (name) => name.split(' ').slice(0, 2).join(' ')

export default function Dashboard({ teams }) {
  const [topN, setTopN] = useState(8)
  const [focusId, setFocusId] = useState(teams[0]?.id ?? null)

  // One decision for the whole dashboard: animate charts unless motion is reduced.
  const animate = !prefersReducedMotion()
  const animProps = { isAnimationActive: animate, animationDuration: 700, animationEasing: 'ease-out' }

  const byXGDiff = useMemo(
    () => [...teams].sort((a, b) => b.stats.xGDiff - a.stats.xGDiff),
    [teams]
  )

  const goalsData = useMemo(
    () =>
      [...teams]
        .sort((a, b) => b.goalsFor - a.goalsFor)
        .slice(0, topN)
        .map((t) => ({ name: shortName(t.name), actual: t.goalsFor, expected: t.stats.xGFor })),
    [teams, topN]
  )

  const diffData = useMemo(
    () =>
      byXGDiff.slice(0, topN).map((t) => ({ name: shortName(t.name), xGDiff: t.stats.xGDiff })),
    [byXGDiff, topN]
  )

  const efficiencyData = useMemo(
    () =>
      teams.map((t) => ({ name: shortName(t.name), xGFor: t.stats.xGFor, goalsFor: t.goalsFor })),
    [teams]
  )
  const effMax = Math.ceil(Math.max(...efficiencyData.map((d) => Math.max(d.xGFor, d.goalsFor))) + 4)

  const focusTeam = teams.find((t) => t.id === focusId) ?? teams[0]
  const radarData = useMemo(() => {
    if (!focusTeam) return []
    const labels = {
      attack: 'Attack',
      defense: 'Defense',
      finishing: 'Finishing',
      accuracy: 'Accuracy',
      volume: 'Shot Volume',
    }
    return Object.entries(labels).map(([key, label]) => ({ axis: label, value: focusTeam.profile[key] }))
  }, [focusTeam])

  return (
    <div className="dashboard">
      <div className="dashboard__controls">
        <h2 className="dashboard__heading">Performance Breakdown</h2>
        <div className="control-group" role="group" aria-label="Number of teams to show">
          <span className="control-group__label">Show</span>
          {[6, 8, 12].map((n) => (
            <button
              key={n}
              type="button"
              className={`chip ${topN === n ? 'chip--active' : ''}`}
              aria-pressed={topN === n}
              onClick={() => setTopN(n)}
            >
              Top {n}
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard__grid">
        <ChartPanel
          icon={<TrendUpIcon size={18} />}
          title="Expected vs Actual Goals"
          subtitle="Bars above their xG twin are overperforming their chances"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={goalsData} margin={{ top: 8, right: 12, bottom: 48, left: -8 }} barGap={2}>
              <defs>
                <linearGradient id="grad-expected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="1" />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0.45" />
                </linearGradient>
                <linearGradient id="grad-actual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-2)" stopOpacity="1" />
                  <stop offset="100%" stopColor="var(--chart-2)" stopOpacity="0.45" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" angle={-35} textAnchor="end" height={64} {...AXIS} interval={0} />
              <YAxis {...AXIS} />
              <Tooltip cursor={{ fill: 'var(--surface-hover)' }} content={<ThemedTooltip unit="goals" />} />
              <Legend wrapperStyle={{ paddingTop: 8 }} />
              <Bar dataKey="expected" name="Expected (xG)" fill="url(#grad-expected)" radius={[5, 5, 0, 0]} {...animProps} />
              <Bar dataKey="actual" name="Actual" fill="url(#grad-actual)" radius={[5, 5, 0, 0]} {...animProps} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          icon={<ScaleIcon size={18} />}
          title="Net xG Difference"
          subtitle="xG created minus xG conceded — the strongest signal of true quality"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={diffData} layout="vertical" margin={{ top: 8, right: 16, bottom: 8, left: 12 }}>
              <defs>
                <linearGradient id="grad-pos" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--chart-2)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="var(--chart-2)" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="grad-neg" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--chart-3)" stopOpacity="1" />
                  <stop offset="100%" stopColor="var(--chart-3)" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" {...AXIS} />
              <YAxis dataKey="name" type="category" width={84} {...AXIS} />
              <Tooltip cursor={{ fill: 'var(--surface-hover)' }} content={<ThemedTooltip unit="net xG" />} />
              <ReferenceLine x={0} stroke="var(--border-strong)" />
              <Bar dataKey="xGDiff" name="Net xG" radius={[0, 5, 5, 0]} {...animProps}>
                {diffData.map((d, i) => (
                  <Cell key={i} fill={d.xGDiff >= 0 ? 'url(#grad-pos)' : 'url(#grad-neg)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          icon={<GaugeIcon size={18} />}
          title="Conversion Efficiency"
          subtitle="Points above the dashed line score more than their chances suggest"
        >
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 8, right: 16, bottom: 40, left: -8 }}>
              <defs>
                <radialGradient id="grad-point" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--chart-4)" stopOpacity="1" />
                  <stop offset="100%" stopColor="var(--chart-4)" stopOpacity="0.55" />
                </radialGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="xGFor"
                name="Expected Goals"
                domain={[0, effMax]}
                {...AXIS}
                label={{ value: 'Expected Goals (xG)', position: 'bottom', offset: 16, fill: 'var(--text-subtle)', fontSize: 12 }}
              />
              <YAxis type="number" dataKey="goalsFor" name="Actual Goals" domain={[0, effMax]} {...AXIS} />
              <ZAxis range={[110, 110]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ScatterTooltip />} />
              <ReferenceLine
                segment={[{ x: 0, y: 0 }, { x: effMax, y: effMax }]}
                stroke="var(--text-subtle)"
                strokeDasharray="5 5"
              />
              <Scatter name="Teams" data={efficiencyData} fill="url(#grad-point)" {...animProps} />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          icon={<SparkIcon size={18} />}
          title="Team DNA"
          subtitle="Each axis is scaled 0–100 against the rest of the league"
          action={
            <label className="select">
              <span className="sr-only">Select team for profile</span>
              <select value={focusTeam?.id} onChange={(e) => setFocusId(Number(e.target.value))}>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
          }
        >
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
              <defs>
                <radialGradient id="grad-radar" cx="50%" cy="50%" r="65%">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.12" />
                </radialGradient>
              </defs>
              <PolarGrid stroke="var(--grid-line)" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fill: 'var(--text-subtle)', fontSize: 10 }} axisLine={false} />
              <Radar
                name={focusTeam?.name}
                dataKey="value"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#grad-radar)"
                {...animProps}
              />
              <Tooltip content={<ThemedTooltip unit="/ 100" />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>

      <TeamTable teams={teams} focusId={focusId} onFocus={setFocusId} />

      <Insights teams={teams} />
    </div>
  )
}

function ChartPanel({ icon, title, subtitle, action, children }) {
  const [ref, visible] = useScrollReveal()
  return (
    <section ref={ref} className={`panel glass spotlight reveal ${visible ? 'is-visible' : ''}`}>
      <header className="panel__head">
        <div className="panel__title">
          <span className="panel__icon">{icon}</span>
          <div>
            <h3>{title}</h3>
            {subtitle && <p className="panel__sub">{subtitle}</p>}
          </div>
        </div>
        {action}
      </header>
      <div className="panel__chart">{children}</div>
    </section>
  )
}

function ThemedTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null
  return (
    <div className="tooltip glass">
      {label && <p className="tooltip__label">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} className="tooltip__row">
          <span className="tooltip__dot" style={{ background: p.color || p.fill }} />
          <span className="tooltip__name">{p.name}</span>
          <span className="tooltip__val tnum">
            {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
            {unit ? ` ${unit}` : ''}
          </span>
        </p>
      ))}
    </div>
  )
}

function ScatterTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const delta = (d.goalsFor - d.xGFor).toFixed(1)
  const over = d.goalsFor >= d.xGFor
  return (
    <div className="tooltip glass">
      <p className="tooltip__label">{d.name}</p>
      <p className="tooltip__row">
        <span className="tooltip__name">Expected</span>
        <span className="tooltip__val tnum">{d.xGFor.toFixed(1)}</span>
      </p>
      <p className="tooltip__row">
        <span className="tooltip__name">Actual</span>
        <span className="tooltip__val tnum">{d.goalsFor}</span>
      </p>
      <p className={`tooltip__row tooltip__row--${over ? 'pos' : 'neg'}`}>
        <span className="tooltip__name">{over ? 'Overperforming' : 'Underperforming'}</span>
        <span className="tooltip__val tnum">
          {over ? '+' : ''}
          {delta}
        </span>
      </p>
    </div>
  )
}
