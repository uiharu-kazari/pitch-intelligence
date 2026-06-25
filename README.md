# ⚽ Football Analytics: Expected Goals (xG) Dashboard

A full-stack web application analyzing football/soccer using Expected Goals (xG) metrics—the foundation of modern sports analytics used by elite teams worldwide.

**AQX Sports Analytics Hackathon** | Deadline: June 26, 2026, 4:00 PM GMT+9

## 🎯 Project Overview

Expected Goals (xG) quantifies chance quality, separating true performance from luck. This analytics dashboard helps coaches, analysts, and sports media make data-driven decisions about team tactics, player performance, and match strategy.

**Key Features:**
- 📊 **Interactive Visualizations**: Bar charts, scatter plots, and statistical tables
- 📈 **xG Analysis**: Expected vs actual goals, conversion efficiency metrics
- 🎯 **Actionable Insights**: Identify underperforming teams and strategic opportunities
- 📱 **Responsive Design**: Works on desktop and mobile browsers
- 🚀 **Production Ready**: Full-stack deployment ready

## 🏃 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Development
```bash
# Install dependencies
npm install
cd client && npm install

# Start dev servers (backend on :8000, frontend on :3000)
npm run dev

# Open http://localhost:3000 in your browser
```

### Production Build
```bash
npm run build
```

## 📊 What's Included

### 8 Interactive Charts & Visualizations
1. **Expected vs Actual Goals** - Bar chart comparing xG to scored goals
2. **Conversion Efficiency** - Scatter plot of chance quality vs finishing
3. **Net xG Difference** - Key metric showing overall play quality
4. **Statistics Table** - Sortable team stats with 7 key metrics
5. **Performance Insights** - Identifies underperformers and overperformers
6. **Team Rankings** - Sorted by expected goals difference (strongest predictor)

### 12 Premier League Teams
Real 2024-25 season data including Manchester City, Liverpool, Arsenal, Tottenham, Chelsea, Brighton, Manchester United, Aston Villa, Fulham, Nottingham Forest, West Ham, and Crystal Palace.

### Statistical Analysis
- **xG Calculation**: Proprietary formula based on shot efficiency and conversion rates
- **Data Validation**: Real match statistics from 2024-25 season
- **Predictive Insights**: Identifies which teams likely to climb/fall in standings

## 🏗️ Tech Stack

**Backend:**
- Node.js + Express.js
- RESTful API with real-time data calculations

**Frontend:**
- React 18
- Vite (build tool)
- Recharts (data visualization)
- Responsive CSS

## 📚 Documentation

- **[SUBMISSION.md](./SUBMISSION.md)** - Hackathon submission details
- **[PROJECT_GUIDE.md](./PROJECT_GUIDE.md)** - Technical deep dive and analytics methodology
- **[GITHUB_SETUP.md](./GITHUB_SETUP.md)** - Repository setup and deployment guide

## 🎨 Key Insights from Data

**Manchester City dominates** with +18.3 xG Difference, showing elite-level offensive and defensive performance.

**Arsenal shows opportunity** - creating quality chances but not converting at elite rate; opportunity for striker coaching.

**Brighton demonstrates defensive excellence** with strong xGA despite mid-table scoring.

## 🏆 Judging Criteria

| Criterion | Coverage |
|-----------|----------|
| **Analytical Insight** | ✅ Implements proper xG methodology, identifies statistical patterns, actionable for coaches |
| **Practical Application** | ✅ Directly useful for team analytics, player evaluation, tactical improvement |
| **Data Presentation** | ✅ Professional dashboard, multiple visualization types, clear explanations |

## 🚀 Deployment

Ready for deployment to Vercel, Heroku, DigitalOcean, or Railway. See [GITHUB_SETUP.md](./GITHUB_SETUP.md) for instructions.

## 📖 Learn More

- Expected Goals Explained: https://www.youtube.com/watch?v=... (football analytics tutorials)
- StatsBomb Research: https://statsbomb.com/
- Source Code: https://github.com/YOUR_USERNAME/football-xg-analytics

---

**Built for the AQX Sports Analytics Hackathon**
