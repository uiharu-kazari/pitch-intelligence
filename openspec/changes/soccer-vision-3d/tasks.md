## 1. Data (simulated tracking)

- [x] 1.1 Write a Node generator `client/scripts/generate-plays.mjs` that emits 3 attacking sequences (good through ball; risky central pass under pressure; missed wide option) with per-frame players (id, team, role, x, y, speed), ball x/y, possession, optional event
- [x] 1.2 Run it to produce `client/public/data/soccer_plays.json`; verify shape and that each scenario's geometry encodes its intended tactical story

## 2. Analytics engine (tactical-analytics-engine)

- [x] 2.1 Create `client/src/analytics/tactics.js`: pure functions `nearestDefender`, `pressure`, `laneOpenness`, `receiverSpace`, `forwardProgress`, `centralityBonus`, `threatScore` (0–100 from the weighted formula), `passRisk = 100 - threat`
- [x] 2.2 Add `analyzeFrame(frame, attackingTeam)` returning ball carrier, scored candidate receivers, recommended pass, and a plain-English explanation citing concrete values
- [x] 2.3 Add a tiny sanity check (script or assert) that each scenario yields its intended recommendation

## 3. Routing & navigation (app-navigation)

- [x] 3.1 Add `client/src/router.js` (`useHashRoute` hook over `hashchange`); routes `#/` and `#/soccer-vision`
- [x] 3.2 Add a main nav to the glass top bar (Dashboard ↔ Soccer Vision 3D) with active-state styling; lazy-load the Soccer Vision module
- [x] 3.3 Verify existing Dashboard renders unchanged on `#/` and theme toggle still works

## 4. Homepage promotion (app-navigation)

- [x] 4.1 Add a Soccer Vision 3D hero/card at the top of the dashboard home: title, subtitle, "Why this matters", and a "Try demo play" button that routes to the module on a demo scenario
- [x] 4.2 Style the hero with the glass/token system; ensure it is responsive on laptop widths

## 5. 3D pitch & camera (soccer-vision-3d)

- [x] 5.1 Create the module shell `client/src/pages/SoccerVision/SoccerVision.jsx` (Canvas + layout: scene left, panel right, controls bottom) with a coordinate helper `toScene(x,y)`
- [x] 5.2 Build `Pitch.jsx`: grass, touchlines/goal lines, halfway line, center circle, penalty boxes, goals, subtle dark background, polished lighting
- [x] 5.3 Build `CameraRig.jsx`: OrbitControls (damped) + animated top-down and reset presets wired to buttons

## 6. Animation & entities (soccer-vision-3d)

- [x] 6.1 Build playback engine: time cursor via `useFrame` (refs, no per-frame React state), publish current frame index at ~10 Hz; controls for play/pause, restart, speed, and timeline scrubber with frame interpolation
- [x] 6.2 Build `Players.jsx` (team-colored markers + drei `Text` labels) and `Ball.jsx` following ball position
- [x] 6.3 Build `Trails.jsx` (attacker movement trails) and completed-pass glowing lines

## 7. Analytics overlays (soccer-vision-3d)

- [x] 7.1 Build `PassLanes.jsx`: lanes carrier→candidates colored green/yellow/red by threat tier; `RecommendedRing.jsx` glowing ring on the best receiver
- [x] 7.2 Build `PressureZones.jsx` (translucent red around defenders) and `OpenSpace.jsx` (subtle glow), memoized on frame index
- [x] 7.3 Build `AnalyticsPanel.jsx`: play name, timestamp, ball carrier, best option, threat & risk scores, nearest-defender distance, plain-English explanation
- [x] 7.4 Build `Legend.jsx` + formula explainer card + a visible "simulated data" label; scenario selector

## 8. Integration polish & docs

- [x] 8.1 Wire scenario selection to reload pitch/playback/analytics; ensure no visual clutter and stable performance
- [x] 8.2 Update README: overview, Soccer Vision 3D as flagship, run steps, simulated-data note, formulas, coach/player/analyst use case, future improvements

## 9. Verify

- [x] 9.1 `npm run build` passes with no errors
- [x] 9.2 Live browser check: Dashboard route unchanged; `#/soccer-vision` renders pitch + plays animate; zero console errors; screenshot home hero + 3D module (light/dark)
- [x] 9.3 Verify scenario switching, playback controls, scrubber, camera buttons, and that the side panel tracks the current frame
- [x] 9.4 Clean up test artifacts
