import '../styles/Insights.css'

export default function Insights({ teams }) {
  // Calculate insights
  const sorted = [...teams].sort((a, b) => b.stats.xGDiff - a.stats.xGDiff)

  const bestPerformer = sorted[0]
  const worstPerformer = sorted[sorted.length - 1]

  const avgConversionRate = (teams.reduce((sum, t) => sum + (t.goalsFor / t.stats.xGFor), 0) / teams.length).toFixed(2)

  const overperformers = teams
    .filter(t => t.goalsFor > t.stats.xGFor * 1.15)
    .sort((a, b) => ((b.goalsFor / b.stats.xGFor) - (a.goalsFor / a.stats.xGFor)))

  const underperformers = teams
    .filter(t => t.goalsFor < t.stats.xGFor * 0.85)
    .sort((a, b) => ((a.goalsFor / a.stats.xGFor) - (b.goalsFor / b.stats.xGFor)))

  return (
    <section className="insights-section">
      <h2>🎯 Key Insights & Analysis</h2>

      <div className="insights-grid">
        <div className="insight-card">
          <h3>Best Overall Performer</h3>
          <p className="team-name">{bestPerformer.name}</p>
          <p>
            xG Difference: <strong>+{bestPerformer.stats.xGDiff.toFixed(1)}</strong>
          </p>
          <p className="insight-detail">
            Creating and defending at the highest quality. This team is playing the best football.
          </p>
        </div>

        <div className="insight-card">
          <h3>Efficiency Leader</h3>
          {overperformers.length > 0 ? (
            <>
              <p className="team-name">{overperformers[0].name}</p>
              <p>
                Conversion Rate:{' '}
                <strong>
                  {((overperformers[0].goalsFor / overperformers[0].stats.xGFor) * 100).toFixed(0)}%
                </strong>
              </p>
              <p className="insight-detail">
                Exceeding expected goals. Elite finishing or tactical efficiency.
              </p>
            </>
          ) : (
            <p className="insight-detail">All teams performing near expected levels</p>
          )}
        </div>

        <div className="insight-card">
          <h3>Opportunity Alert</h3>
          {underperformers.length > 0 ? (
            <>
              <p className="team-name">{underperformers[0].name}</p>
              <p>
                Conversion Rate:{' '}
                <strong>
                  {((underperformers[0].goalsFor / underperformers[0].stats.xGFor) * 100).toFixed(0)}%
                </strong>
              </p>
              <p className="insight-detail">
                Creating chances but not converting. Could improve with better strikers or tactics.
              </p>
            </>
          ) : (
            <p className="insight-detail">All teams converting at reasonable rates</p>
          )}
        </div>

        <div className="insight-card">
          <h3>League Average</h3>
          <p>
            Conversion Rate: <strong>{avgConversionRate}x</strong>
          </p>
          <p className="insight-detail">
            Average team scores {avgConversionRate} goals for every expected goal.
          </p>
        </div>
      </div>

      <div className="conclusion">
        <h3>🏆 Tactical Takeaways</h3>
        <ul>
          <li>
            <strong>Quality Over Quantity:</strong> xG Difference (xG For - xG Against) is the strongest
            predictor of league position and future performance.
          </li>
          <li>
            <strong>Elite Chance Creation:</strong> Top teams create significantly more expected goals while
            limiting opponents.
          </li>
          <li>
            <strong>Conversion Matters:</strong> Even elite teams rarely exceed 1.3x their xG consistently.
            Finishing quality varies.
          </li>
          <li>
            <strong>Sustainable Performance:</strong> Teams with positive xG Diff show sustainable success, while
            teams below the line are likely to regress.
          </li>
        </ul>
      </div>

      <p className="footer-note">
        Expected Goals (xG) measures chance quality, not luck. Coaches and analysts use this to evaluate tactics,
        identify improvement areas, and predict future performance.
      </p>
    </section>
  )
}
