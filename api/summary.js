// Vercel serverless function: GET /api/summary
import { fetchSummary } from '../server/data.js'

export default async function handler(req, res) {
  try {
    const summary = await fetchSummary()
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    res.status(200).json(summary)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
