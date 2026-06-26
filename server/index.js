import express from 'express';
import cors from 'cors';
import { fetchTeamStats, fetchSummary } from './data.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/teams', async (req, res) => {
  try {
    const teams = await fetchTeamStats();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/summary', async (req, res) => {
  try {
    const summary = await fetchSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
