# AQX Sports Analytics Hackathon — Submission

## Project: Pitch Intelligence

**Soccer analytics in 3D** — an Expected Goals (xG) analytics dashboard plus **Soccer Vision 3D**,
an interactive 3D tactical "film-room" that turns player-tracking data into clear, actionable
decisions: the best pass, the pressure, and the open space, for any moment in a possession.

- **Sport:** Soccer (association football).
- **Type:** Web application (interactive dashboard + 3D analysis module).
- **Live demo:** https://sports-analytics-lyart.vercel.app
- **Source:** Open-source — https://github.com/uiharu-kazari/pitch-intelligence (public).
- **Run locally:** `npm install && (cd client && npm install) && npm run dev` → open `http://localhost:3000`.

---

## The problem it solves

Most soccer analytics stop at tables and totals. A coach watching a clip wants to know: *was the
right pass taken? where was the pressure? what space was open?* Pitch Intelligence answers that —
it replays a possession on a 3D pitch and, for every frame, scores each passing option and
highlights the best one, with a plain-English reason.

## Two parts

### 1. Soccer Vision 3D (flagship) — tactical decision analysis on tracking data
- Replays attacking sequences on a 3D pitch (players, ball, movement trails, completed passes).
- For each moment, computes per-candidate **attacking-threat** (0–100) and **pass-risk** (100−threat)
  and highlights the **recommended receiver**, with a written explanation
  (*"Winger #11 is the best option — the lane is mostly clear, 22 m of separation, advances 17 m
  into the final third"*).
- On-pitch overlays: passing lanes graded **green / yellow / red**, defender **pressure zones**,
  **open-space** glow, recommended-receiver ring.
- **Real and simulated data:** three authored teaching scenarios *plus* a real broadcast-tracking
  possession from **SkillCorner Open Data (A-League 2024/25, MIT)** — the same analytics run on
  genuine player positions (interpolated to fill sparse frames).

### 2. xG dashboard — team-quality analytics
- Expected vs Actual Goals, Conversion Efficiency, **Net xG Difference**, a Team DNA radar, a
  sortable stats table, and plain-English insights (best attack, meanest defense, league finishing).

---

## How it maps to the judging criteria

### Analytical Insight
- **Beyond surface stats:** it doesn't just total goals — it evaluates *decisions*. Per frame it
  computes nearest-defender distance, defensive pressure, passing-lane openness, receiver space,
  forward progress, and centrality, then ranks every passing option.
- **Transparent, auditable method (not a black box):** the attacking-threat score is a published,
  weighted formula shown *in the UI* —
  `100 × (0.35·forward + 0.25·space + 0.20·lane + 0.10·centrality + 0.10·(1−pressure))`.
  Forward progress is **signed**, so safe backward passes can't masquerade as threats.
- **Validated on real tracking data**, not only synthetic — and the three simulated scenarios are
  asserted by a test (`scripts/sanity-check.mjs`) to produce their intended recommendation.
- **Honest about modeling:** the dashboard's xG is a deliberately simple, calibrated shot-quality
  proxy (`xG = 0.06·shots + 0.47·shots-on-target`, tuned so league xG ≈ league goals), and the
  threat weights are heuristic. We prioritized **explainability and correctness** over an opaque
  model — every number can be traced to its inputs.

### Practical Application
- **For coaches:** a film-room view — replay a possession and see whether the best pass was taken,
  where pressure built, and what space opened.
- **For players/analysts:** read passing lanes, defensive pressure, and run timing directly.
- **For scouting/front office:** the dashboard's net-xG (the strongest predictor of results) ranks
  true team quality and separates performance from finishing variance.

### Data Presentation
- Premium, responsive **light/dark dashboard**; an interactive, orbitable **3D scene** with
  top-down and reset cameras and full playback (play/pause, speed, timeline scrubber).
- **Made for non-technical audiences** (the stated criterion): plain-English explanations, a color
  legend, and the scoring formula visible on screen.
- **Accessible:** WCAG-AA contrast in both themes, visible focus states, `aria-sort` on tables,
  keyboard-activatable rows, and full `prefers-reduced-motion` support.

---

## Data & sources
- **Soccer Vision 3D:** real broadcast tracking from [SkillCorner Open Data](https://github.com/SkillCorner/opendata)
  (A-League 2024/25, MIT) for the real scenario; clearly-labeled **simulated** tracking for the
  three teaching scenarios.
- **Dashboard:** a sample dataset of Premier League team counting-stats with a transparent xG proxy
  derived from shot volume and accuracy. Labeled as sample data in the UI.

## Tech
React 18 + Vite, vanilla-CSS design tokens (glass light/dark theme), Recharts (2D charts),
Three.js + React Three Fiber + drei (3D), a dependency-free hash router, Node/Express API.

## Submission checklist
- [x] Working prototype (`npm run dev`).
- [x] Uses sports data to produce analytical insight that solves a sports problem.
- [x] Short description of solution, features, and actionable impact (this document + `README.md`).
- [x] **Public GitHub repository** — https://github.com/uiharu-kazari/pitch-intelligence

## How to run
```bash
npm install
cd client && npm install && cd ..
npm run dev          # API on :8000, client on :3000 (or next free port)
# open the printed URL

# Tests (analytics + data adapter)
cd client
node scripts/sanity-check.mjs                       # analytics scenario assertions
node --test scripts/import-skillcorner.test.mjs     # SkillCorner adapter unit tests
```
