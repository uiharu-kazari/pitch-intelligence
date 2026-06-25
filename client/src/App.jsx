import { useState, useEffect } from 'react'
import axios from 'axios'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/teams')
        setTeams(response.data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="loading">Loading team data...</div>
  }

  if (error) {
    return <div className="error">Error loading data: {error}</div>
  }

  return (
    <div className="app">
      <header className="header">
        <h1>⚽ Football Analytics Dashboard</h1>
        <p>Expected Goals (xG) Analysis - Premier League 2024-25</p>
      </header>
      <Dashboard teams={teams} />
      <footer className="footer">
        <p>AQX Sports Analytics Hackathon | Data-driven football insights</p>
      </footer>
    </div>
  )
}

export default App
