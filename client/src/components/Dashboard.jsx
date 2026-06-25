import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  LineChart,
  Line,
} from 'recharts'
import TeamTable from './TeamTable'
import Insights from './Insights'
import '../styles/Dashboard.css'

export default function Dashboard({ teams }) {
  const [selectedTeam, setSelectedTeam] = useState(null)

  // Sort teams by xG difference for xG efficiency chart
  const sortedByXGDiff = [...teams].sort((a, b) => b.stats.xGDiff - a.stats.xGDiff)

  // Chart data: xG vs Actual Goals
  const chartData = teams
    .sort((a, b) => b.stats.goalsFor - a.stats.goalsFor)
    .slice(0, 8)
    .map(team => ({
      name: team.name.split(' ').slice(0, 2).join(' '),
      actual: team.goalsFor,
      expected: team.stats.xGFor,
      diff: team.goalsFor - team.stats.xGFor,
    }))

  // Efficiency scatter plot: xG vs Goals (showing conversion efficiency)
  const efficiencyData = teams.map(team => ({
    name: team.name,
    xGFor: team.stats.xGFor,
    goalsFor: team.goalsFor,
    efficiency: parseFloat((team.goalsFor / team.stats.xGFor).toFixed(2)),
  }))

  // Performance trend data (simulated over a season)
  const trendData = ['Week 5', 'Week 10', 'Week 15', 'Week 20'].map((week, idx) => ({
    week,
    'Man City': [12 + idx * 2, 15 + idx * 2.5],
    'Liverpool': [10 + idx * 1.8, 13 + idx * 2.2],
    'Arsenal': [9 + idx * 1.5, 11 + idx * 1.8],
  }))

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        {/* xG vs Actual Goals */}
        <div className="chart-card">
          <h2>Expected vs Actual Goals</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="expected" fill="#8884d8" name="Expected Goals (xG)" />
              <Bar dataKey="actual" fill="#82ca9d" name="Actual Goals" />
            </BarChart>
          </ResponsiveContainer>
          <p className="insight-text">
            This chart shows how teams perform relative to their expected goals. Teams above the line are
            overperforming.
          </p>
        </div>

        {/* Efficiency Scatter Plot */}
        <div className="chart-card">
          <h2>Conversion Efficiency</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="xGFor" name="Expected Goals (xG)" unit="" />
              <YAxis dataKey="goalsFor" name="Actual Goals Scored" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Teams" data={efficiencyData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
          <p className="insight-text">
            Teams higher on the chart score more goals. Teams to the right create better chances (higher xG).
          </p>
        </div>

        {/* xG Difference (Performance Quality) */}
        <div className="chart-card">
          <h2>Net xG Difference</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={sortedByXGDiff.slice(0, 8).map(t => ({
                name: t.name.split(' ').slice(0, 2).join(' '),
                xGDiff: t.stats.xGDiff,
              }))}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar
                dataKey="xGDiff"
                fill={(entry) => (entry.xGDiff > 0 ? '#82ca9d' : '#ff7c7c')}
                name="xG Difference"
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="insight-text">
            Positive xGDiff indicates teams are creating and conceding quality chances favorably. A strong
            predictor of future performance.
          </p>
        </div>

        {/* Stats Table */}
        <div className="table-card">
          <h2>Team Statistics</h2>
          <TeamTable teams={teams} selectedTeam={selectedTeam} onSelectTeam={setSelectedTeam} />
        </div>
      </div>

      {/* Key Insights */}
      <Insights teams={teams} />
    </div>
  )
}
