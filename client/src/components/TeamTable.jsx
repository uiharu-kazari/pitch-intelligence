import { useState, useMemo } from 'react'
import { ArrowUpIcon, ArrowDownIcon } from '../icons'
import { useScrollReveal } from '../motion'
import '../styles/TeamTable.css'

// Column config: accessor pulls a comparable value from a team row.
const COLUMNS = [
  { key: 'name', label: 'Team', align: 'left', accessor: (t) => t.name },
  { key: 'gamesPlayed', label: 'GP', align: 'right', accessor: (t) => t.gamesPlayed },
  { key: 'goalsFor', label: 'Goals', align: 'right', accessor: (t) => t.goalsFor },
  { key: 'xGFor', label: 'xG', align: 'right', accessor: (t) => t.stats.xGFor },
  { key: 'xGAgainst', label: 'xGA', align: 'right', accessor: (t) => t.stats.xGAgainst },
  { key: 'xGDiff', label: 'Net xG', align: 'right', accessor: (t) => t.stats.xGDiff },
  { key: 'conversion', label: 'Conv.', align: 'right', accessor: (t) => t.stats.conversion },
  { key: 'shotsOnTargetPercentage', label: 'SoT %', align: 'right', accessor: (t) => t.stats.shotsOnTargetPercentage },
]

export default function TeamTable({ teams, focusId, onFocus }) {
  const [sort, setSort] = useState({ key: 'xGDiff', dir: 'desc' })

  const sorted = useMemo(() => {
    const col = COLUMNS.find((c) => c.key === sort.key)
    const rows = [...teams].sort((a, b) => {
      const av = col.accessor(a)
      const bv = col.accessor(b)
      if (typeof av === 'string') return av.localeCompare(bv)
      return av - bv
    })
    return sort.dir === 'desc' ? rows.reverse() : rows
  }, [teams, sort])

  const onSort = (key) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: key === 'name' ? 'asc' : 'desc' }
    )

  const ariaSort = (key) => (sort.key === key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none')

  const [revealRef, visible] = useScrollReveal()

  return (
    <section ref={revealRef} className={`table-panel glass reveal ${visible ? 'is-visible' : ''}`}>
      <header className="table-panel__head">
        <h3>Team Statistics</h3>
        <p className="table-panel__hint">Click a header to sort · click a row to load its profile</p>
      </header>

      <div className="table-scroll">
        <table className="team-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  aria-sort={ariaSort(col.key)}
                  className={`th th--${col.align} ${sort.key === col.key ? 'th--active' : ''}`}
                >
                  <button type="button" className="th__btn" onClick={() => onSort(col.key)}>
                    <span>{col.label}</span>
                    <span className="th__icon" aria-hidden="true">
                      {sort.key === col.key &&
                        (sort.dir === 'asc' ? <ArrowUpIcon size={13} /> : <ArrowDownIcon size={13} />)}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((team, i) => (
              <tr
                key={team.id}
                className={`row ${team.id === focusId ? 'row--focus' : ''}`}
                onClick={() => onFocus?.(team.id)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onFocus?.(team.id)
                  }
                }}
                aria-label={`${team.name}. Press Enter to load profile.`}
              >
                <td className="td td--left">
                  <span className="rank tnum">{i + 1}</span>
                  <span className="team-badge" aria-hidden="true">
                    {team.short}
                  </span>
                  <span className="team-name">{team.name}</span>
                </td>
                <td className="td td--right tnum">{team.gamesPlayed}</td>
                <td className="td td--right tnum td--strong">{team.goalsFor}</td>
                <td className="td td--right tnum">{team.stats.xGFor.toFixed(1)}</td>
                <td className="td td--right tnum">{team.stats.xGAgainst.toFixed(1)}</td>
                <td className={`td td--right tnum ${team.stats.xGDiff >= 0 ? 'pos' : 'neg'}`}>
                  {team.stats.xGDiff >= 0 ? '+' : ''}
                  {team.stats.xGDiff.toFixed(1)}
                </td>
                <td className={`td td--right tnum ${team.stats.conversion >= 1 ? 'pos' : 'neg'}`}>
                  {team.stats.conversion.toFixed(2)}×
                </td>
                <td className="td td--right tnum">{team.stats.shotsOnTargetPercentage.toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
