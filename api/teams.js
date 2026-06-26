// Vercel serverless function: GET /api/teams
// Reuses the same data logic as the local Express server.
import { fetchTeamStats } from '../server/data.js'

export default async function handler(req, res) {
  try {
    const teams = await fetchTeamStats()
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    res.status(200).json(teams)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
