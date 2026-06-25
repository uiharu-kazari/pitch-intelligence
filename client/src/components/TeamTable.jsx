import '../styles/TeamTable.css'

export default function TeamTable({ teams, onSelectTeam }) {
  const sorted = [...teams].sort((a, b) => b.stats.xGDiff - a.stats.xGDiff)

  return (
    <div className="table-container">
      <table className="team-table">
        <thead>
          <tr>
            <th>Team</th>
            <th>Games</th>
            <th>Goals</th>
            <th>xG</th>
            <th>xGA</th>
            <th>xGDiff</th>
            <th>Shot %</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((team) => (
            <tr key={team.id} onClick={() => onSelectTeam(team)} className="table-row">
              <td className="team-name">{team.name}</td>
              <td>{team.gamesPlayed}</td>
              <td className="strong">{team.goalsFor}</td>
              <td>{team.stats.xGFor.toFixed(1)}</td>
              <td>{team.stats.xGAgainst.toFixed(1)}</td>
              <td className={team.stats.xGDiff > 0 ? 'positive' : 'negative'}>
                {team.stats.xGDiff.toFixed(1)}
              </td>
              <td>{team.stats.shotsOnTargetPercentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="table-note">Sorted by xG Difference (quality of play)</p>
    </div>
  )
}
