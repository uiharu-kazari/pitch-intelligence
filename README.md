# ⚽ Soccer Analytics — Expected Goals + Soccer Vision 3D

A full-stack soccer analytics web app. The dashboard analyzes teams with Expected Goals (xG),
and the flagship module — **Soccer Vision 3D** — turns tracking data into an interactive 3D
tactical film-room.

**AQX Sports Analytics Hackathon**

---

## 🌟 Flagship feature update: Soccer Vision 3D

> **Interactive tactical analysis for passing lanes, pressure, and open space.**

Most analytics tools show tables and static charts. Coaches and players, however, think in
**movement and space**. Soccer Vision 3D replays an attacking sequence on a real 3D pitch and, for
every moment, computes a **transparent attacking-threat score** for each passing option — then
highlights the best pass directly on the pitch.

It is a tactical film-room, not a decorative 3D scene: every visual encodes real analytics.

**What it does**
- **3D pitch** (React Three Fiber / Three.js): striped grass, full markings, penalty boxes, goals,
  center circle; orbit + **top-down** + **reset** cameras; polished lighting.
- **Animated sequences**: team-colored player markers with numbers, an animated ball, movement
  trails, and glowing completed-pass lines — with **play/pause, restart, speed (0.5/1/2×), and a
  timeline scrubber**.
- **On-pitch analytics**: passing lanes colored by quality (**green** strong / **yellow** risky /
  **red** poor), translucent **red pressure zones** around defenders, a subtle **green open-space**
  glow, a glowing ring on the **recommended receiver**, and the ball carrier highlighted.
- **Side analytics panel**: play name, timestamp, ball carrier, best option, **attacking-threat**
  and **pass-risk** scores, nearest-defender distance, ranked options, a color legend, and a
  plain-English explanation of *why* the recommended pass is best.
- **3 scenarios**: ① Good through ball into open space, ② Risky central pass under pressure,
  ③ Missed opportunity where a wide player was more open.

Open the app and click **Soccer Vision 3D** in the nav, or **Try demo play** on the homepage.
Route: `#/soccer-vision`.

### 📐 The analytics (transparent by design)

Each candidate pass is scored from five normalized factors and scaled to **0–100**:

```
attacking_threat = 100 × (
    0.35 × forward_progress        // gain toward goal (signed: backward passes are penalized)
  + 0.25 × receiver_space          // separation from the nearest defender
  + 0.20 × passing_lane_openness   // how clear the straight lane is
  + 0.10 × centrality              // central positions are more dangerous
  + 0.10 × (1 − defensive_pressure)// relief from pressure on the receiver
)

pass_risk = 100 − attacking_threat
```

Tiers: **≥ 60 strong (green)**, **40–59 risky (yellow)**, **< 40 poor (red)**. The recommended
pass is the highest-threat option. The formula and legend are shown in the UI so the method is
fully auditable. Implementation: [`client/src/analytics/tactics.js`](client/src/analytics/tactics.js)
(pure, deterministic functions).

### 🗃️ Data — simulated scenarios + one real match

Scenarios 1–3 are **simulated** (labeled `SIM DATA`), generated from authored player/ball
waypoints and interpolated to 12 fps. Scenario 4 is **real broadcast tracking** (labeled
`REAL DATA`) imported from SkillCorner Open Data.

```bash
cd client

# Regenerate the 3 simulated plays (writes public/data/soccer_plays.json)
node scripts/generate-plays.mjs

# Verify the analytics recommend the intended pass in each simulated scenario
node scripts/sanity-check.mjs
```

Each frame includes per-player `id, team, role (GK/CB/FB/DM/CM/AM/Winger/ST), x, y, speed`, the
ball position, possession, and optional pass events.

#### Real data — SkillCorner Open Data (A-League 2024/25)

Scenario 4 is a real Newcastle Jets counter-attack from [SkillCorner Open Data](https://github.com/SkillCorner/opendata)
(MIT license; broadcast tracking, meters, 10 fps). `scripts/import-skillcorner.mjs` converts a
possession window into the module's schema: it maps centered-meter coordinates onto the 105×68
pitch, relabels the team in possession as the attacking side, joins player roles from the match
metadata, **linearly interpolates to fill sparse/missing detections**, and resamples 10 → 12 fps.

The converted clip is baked into `public/data/soccer_plays.json`, so the app needs no extra
downloads. To re-import (the tracking file is ~85 MB Git-LFS, kept out of this repo):

```bash
cd client

# 1. Fetch one match's metadata + tracking from SkillCorner (Git LFS)
#    e.g. via: git lfs clone, or the GitHub LFS API (see the match id under data/matches/).
# 2. Convert a possession window into a play and merge it in:
node scripts/import-skillcorner.mjs \
  --match=/path/to/<id>_match.json \
  --tracking=/path/to/<id>_tracking_extrapolated.jsonl \
  --out=public/data/soccer_plays.json \
  --period=1 --start=23905 --end=24015 --fps=12 --group="away team"

# Adapter unit tests (coordinate mapping, role mapping, interpolation/gap-fill, flip, schema)
node --test scripts/import-skillcorner.test.mjs
```

The pure conversion functions in `import-skillcorner.mjs` are covered by
`scripts/import-skillcorner.test.mjs`.

### 👥 Who it's for

- **Coaches**: review decisions in a film-room style — was the best pass taken?
- **Players**: understand passing lanes, pressure, and timing of runs.
- **Analysts / media**: communicate tactics visually instead of with spreadsheets.

---

## 📊 The xG dashboard (preserved)

The original Expected Goals dashboard remains the home view:
- **Expected vs Actual Goals**, **Conversion Efficiency**, **Net xG Difference**, a **Team DNA**
  radar, a sortable **statistics table**, and **key insights** — with full light/dark theming.
- 12 Premier League teams (2025-26 sample dataset). xG here is a simplified shot-quality proxy.

---

## 🏃 Quick start

**Prerequisites:** Node.js 18+ and npm.

```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Start dev servers (API on :8000, client on :3000 or next free port)
npm run dev
# open the printed URL (e.g. http://localhost:3000)

# Production build
npm run build
```

## 🏗️ Tech stack

- **Backend:** Node.js + Express (team stats API).
- **Frontend:** React 18 + Vite, vanilla-CSS design tokens (glass light/dark theme), Recharts
  (2D charts), **Three.js + React Three Fiber + drei** (3D module, lazy-loaded).
- **Routing:** a tiny dependency-free hash router.

## 🗂️ Key paths

```
client/src/pages/SoccerVision/   3D module (Scene, Pitch, Entities, Overlays, CameraRig, panel)
client/src/analytics/tactics.js  transparent analytics engine (pure functions)
client/scripts/generate-plays.mjs simulated-data generator  +  sanity-check.mjs
client/public/data/soccer_plays.json  generated sample tracking data
openspec/                        specs for the dashboard rebuild + Soccer Vision 3D
```

## 🔭 Future improvements

- Ingest real tracking/event data (StatsBomb, Metrica, Second Spectrum formats).
- A learned xG/xT model (shot-location and pass-value models) in place of the transparent proxy.
- Defensive-line/offside awareness, pass-completion probability, and expected-threat (xT) grids.
- Draw-your-own scenarios, frame annotations, and shareable deep links per moment.
- Multi-possession sequences, shot outcomes, and export to video/clip.

---

**Built for the AQX Sports Analytics Hackathon.** Soccer Vision 3D is the flagship update — a 3D
tactical film-room for soccer.
