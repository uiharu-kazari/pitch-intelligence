import { useMemo } from 'react'
import { TrophyIcon, FlameIcon, AlertIcon, ScaleIcon, TargetIcon } from '../icons'
import { useScrollReveal } from '../motion'
import AnimatedNumber from './AnimatedNumber'
import '../styles/Insights.css'

export default function Insights({ teams }) {
  const insights = useMemo(() => {
    const best = [...teams].sort((a, b) => b.stats.xGDiff - a.stats.xGDiff)[0]
    const bestAttack = [...teams].sort((a, b) => b.stats.xGFor - a.stats.xGFor)[0]
    const bestDefense = [...teams].sort((a, b) => a.stats.xGAgainst - b.stats.xGAgainst)[0]

    const avgConversion = teams.reduce((s, t) => s + t.stats.conversion, 0) / teams.length

    return [
      {
        icon: <TrophyIcon size={20} />,
        tone: 'primary',
        label: 'Best overall performer',
        team: best.name,
        statNum: best.stats.xGDiff,
        statPrefix: '+',
        statSuffix: ' net xG',
        statDecimals: 1,
        detail: 'Creating and defending the highest-quality chances in the league.',
      },
      {
        icon: <FlameIcon size={20} />,
        tone: 'accent',
        label: 'Most prolific attack',
        team: bestAttack.name,
        statNum: bestAttack.stats.xGFor,
        statSuffix: ' xG created',
        statDecimals: 1,
        detail: 'Generates more high-quality chances than anyone — the league’s sharpest attack.',
      },
      {
        icon: <AlertIcon size={20} />,
        tone: 'success',
        label: 'Meanest defense',
        team: bestDefense.name,
        statNum: bestDefense.stats.xGAgainst,
        statSuffix: ' xG conceded',
        statDecimals: 1,
        detail: 'Concedes the fewest quality chances — the foundation of sustainable results.',
      },
      {
        icon: <ScaleIcon size={20} />,
        tone: 'neutral',
        label: 'League finishing',
        teamNum: avgConversion,
        teamDecimals: 2,
        teamSuffix: '× conversion',
        stat: 'goals per expected goal',
        detail: `Sides finish close to expectation on average, so quality gaps come from chance creation, not luck.`,
      },
    ]
  }, [teams])

  const [ref, visible] = useScrollReveal()

  return (
    <section ref={ref} className={`insights glass reveal ${visible ? 'is-visible' : ''}`}>
      <header className="insights__head">
        <span className="insights__icon">
          <TargetIcon size={20} />
        </span>
        <div>
          <h2>Key Insights &amp; Analysis</h2>
          <p>What the expected-goals model reveals about this season</p>
        </div>
      </header>

      <div className="insights__grid">
        {insights.map((it) => (
          <article key={it.label} className={`insight spotlight insight--${it.tone}`}>
            <span className="insight__icon">{it.icon}</span>
            <p className="insight__label">{it.label}</p>
            <p className="insight__team">
              {it.teamNum !== undefined ? (
                <AnimatedNumber value={it.teamNum} decimals={it.teamDecimals} suffix={it.teamSuffix} />
              ) : (
                it.team
              )}
            </p>
            <p className="insight__stat">
              {it.statNum !== undefined ? (
                <AnimatedNumber
                  value={it.statNum}
                  decimals={it.statDecimals}
                  prefix={it.statPrefix}
                  suffix={it.statSuffix}
                />
              ) : (
                it.stat
              )}
            </p>
            <p className="insight__detail">{it.detail}</p>
          </article>
        ))}
      </div>

      <div className="takeaways">
        <h3>Tactical takeaways</h3>
        <ul>
          <li>
            <strong>Quality over quantity.</strong> Net xG (xG for − xG against) is the strongest
            predictor of league position and future results.
          </li>
          <li>
            <strong>Elite chance creation.</strong> Top sides generate far more expected goals
            while suppressing their opponents' chances.
          </li>
          <li>
            <strong>Conversion is volatile.</strong> Even elite teams rarely sustain more than 1.3×
            their xG — finishing regresses toward the mean.
          </li>
          <li>
            <strong>Sustainable success.</strong> A positive net xG signals durable form; teams
            scoring above their xG are likely to cool off.
          </li>
        </ul>
      </div>

      <p className="insights__foot">
        Expected Goals (xG) measures chance quality, not luck. Analysts use it to evaluate tactics,
        find improvement areas, and forecast future performance.
      </p>
    </section>
  )
}
