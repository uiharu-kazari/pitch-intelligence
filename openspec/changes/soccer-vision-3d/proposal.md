## Why

The app currently presents soccer analytics as tables and 2D charts. Coaches, players, and fans
understand tactics through *movement and space*, not spreadsheets. **Soccer Vision 3D** turns
tracking data into an interactive 3D film-room: replay an attacking sequence on a real pitch and
see passing lanes, defensive pressure, open space, and a transparent attacking-threat score for
every option — the flagship feature of this release.

## What Changes

- Add a new **Soccer Vision 3D** page/module at `#/soccer-vision`, integrated into the existing
  single-page app via a lightweight hash router and a main nav.
- Add a **main navigation** (Dashboard ↔ Soccer Vision 3D) reusing the existing glass top bar.
- Add a **homepage hero/card** promoting Soccer Vision 3D as the headline new feature, with a
  "Try demo play" button and a short "Why this matters" section. Existing dashboard preserved.
- Build a **3D pitch** (R3F/Three.js): grass, markings, penalty boxes, goals, center circle,
  with orbit + top-down + reset camera controls and polished lighting.
- Load **simulated tracking data** from `public/data/soccer_plays.json` (3 attacking sequences,
  per-frame player/ball positions, roles, speed, events) — clearly labeled as sample data.
- **Animate** the sequence: team-colored player markers with labels, animated ball, movement
  trails, glowing completed-pass lines; play/pause, restart, speed, and timeline scrubber.
- Compute **tactical analytics** with a transparent formula: nearest-defender distance, defensive
  pressure, passing-lane openness, receiver space, progressive value, attacking-threat score
  (0–100), pass-risk score, and the recommended next pass.
- **Visualize analytics on the pitch**: quality-colored passing lanes (green/yellow/red),
  translucent defender pressure zones, subtle open-space glows, a glowing ring on the recommended
  receiver, and attacker movement trails.
- Add a **side analytics panel** (play name, timestamp, ball carrier, best option, threat/risk
  scores, nearest defender, plain-English explanation) and a **color legend + formula explainer**.
- Add **3 scenarios**: good through ball, risky central pass under pressure, missed wide option.
- Update **README** with overview, run steps, data note, formulas, use cases, future work.
- Add dependencies: `three`, `@react-three/fiber`, `@react-three/drei` (React-18 compatible).

## Capabilities

### New Capabilities
- `soccer-vision-3d`: The interactive 3D tactical analysis module — pitch, playback, on-pitch
  analytics overlays, side panel, and scenarios.
- `tactical-analytics-engine`: Transparent, testable analytics functions (threat score, pass
  risk, pressure, lane openness, receiver space, recommended pass) over tracking frames.
- `app-navigation`: Hash-router navigation and homepage feature promotion integrating the new
  module while preserving the existing dashboard.

### Modified Capabilities
- (none — existing dashboard specs were defined for the previous change only; behavior unchanged.)

## Impact

- **New deps**: `three`, `@react-three/fiber`, `@react-three/drei` in `client/`.
- **New code**: `client/src/pages/SoccerVision/*` (scene, pitch, players, overlays, controls,
  panel), `client/src/analytics/tactics.js`, `client/src/router.js`, homepage hero, nav.
- **Data**: `client/public/data/soccer_plays.json` (generated synthetic data) + generator script.
- **Modified**: `App.jsx` (router + nav + hero), `App.css`, README.
- **Preserved**: existing Dashboard, charts, table, insights, theming, server/API — unchanged.
- **Risk**: 3D performance and bundle size — mitigated by low-poly geometry, instancing where
  useful, `frameloop` discipline, and laptop-targeted scope.
