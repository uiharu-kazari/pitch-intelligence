## Context

Existing app: React 18 + Vite, vanilla-CSS design tokens (glass/dark theme), single-page `App.jsx`
(top bar + Dashboard), no router. Server is Express serving team stats — untouched here. We add a
flagship 3D module without disrupting the dashboard, reusing the token system and glass top bar.

## Goals / Non-Goals

**Goals:**
- A genuinely analytical 3D film-room (not decorative): pitch, playback, on-pitch analytics, side
  panel, 3 scenarios, transparent formula.
- Integrate cleanly: nav + homepage hero, hash routing, existing dashboard preserved.
- Modular, explainable code; smooth on a laptop.

**Non-Goals:**
- No real tracking-data ingestion (synthetic, clearly labeled), no backend changes, no auth.
- No physics sim; ball/players follow scripted tracked positions with interpolation.
- No mobile-first optimization (target laptop), no post-processing-heavy effects.

## Decisions

- **Routing: tiny hash router, no dependency.** A `useHashRoute()` hook over `window.location.hash`
  + `hashchange`. Routes: `#/` (home/dashboard) and `#/soccer-vision`. *Alt:* react-router —
  rejected (heavier than needed for two routes; brief says add deps only when necessary).
- **3D: React Three Fiber + drei (v8/v9, React-18 compatible).** Declarative scene fits React;
  drei gives `OrbitControls`, `Text`, `Line`, `Html`. *Alt:* raw three.js — more imperative glue.
- **Coordinate model:** pitch in meters (105×68), centered at origin, lying in the XZ plane (Y up).
  A single `toScene(x,y)` maps data pitch-coords → scene coords so data, analytics, and rendering
  share one space.
- **Data: generated synthetic frames** written to `public/data/soccer_plays.json` by a Node
  generator script (kept out of the bundle; fetched at runtime). 3 scenarios, ~6–10s each at
  ~10 fps, each frame lists all players (id, team, role, x, y, speed), ball x/y, possession team,
  optional event. Generator encodes the three tactical stories so analytics produce the intended
  recommendation.
- **Analytics: pure module `analytics/tactics.js`** operating on a single frame. Functions:
  `nearestDefender`, `pressure`, `laneOpenness`, `receiverSpace`, `forwardProgress`,
  `centralityBonus`, `threatScore`, and `analyzeFrame` (returns carrier, scored candidates,
  recommendation, explanation). Formula (weights from the brief), each term normalized to 0–1 then
  ×100:
  `threat = 100*(0.35*forward + 0.25*space + 0.20*lane + 0.10*centrality + 0.10*(1-pressure))`,
  `risk = 100 - threat`. Pure + deterministic → unit-testable and matches spec scenarios.
- **Playback: `useFrame` drives a time cursor**, not React state per frame (avoids re-render
  storms). A small store (plain `useRef` + a throttled `setState` ~10/s) publishes the current
  frame index to the React side panel so UI updates without thrashing. Scrubber/speed mutate the
  cursor.
- **Rendering structure:** `<Pitch>` (static meshes), `<Players>` (instanced or mapped markers +
  drei `Text` labels), `<Ball>`, `<Trails>` (drei `Line`), `<PassLanes>`/`<PressureZones>`/
  `<OpenSpace>`/`<RecommendedRing>` overlays driven by the current frame's analytics, `<CameraRig>`
  (OrbitControls + animated presets). Overlays recompute only when the published frame index
  changes (memoized).
- **Styling:** reuse tokens; module uses a dark glass dashboard layout (canvas left, analytics
  panel right, controls bar bottom). Legend + formula card always visible.

## Risks / Trade-offs

- **Re-render storms from per-frame state** → drive motion in `useFrame` via refs; publish frame
  index at ~10 Hz only. Overlays memoized on frame index.
- **Bundle size (three is large)** → acceptable for a flagship; lazy-load the module via dynamic
  import so the dashboard route isn't penalized.
- **Analytics not matching the intended story** → the generator and analytics are co-designed; a
  small sanity check asserts each scenario's expected recommendation.
- **Label legibility in 3D** → drei `Text` billboarded, with outline; keep marker count low (~20).
- **WebGL perf on weak GPUs** → low-poly geometry, `dpr={[1,2]}`, no shadows-heavy setup, modest
  lights; `frameloop="always"` only while playing, else acceptable idle.

## Migration Plan

Additive. New routes/components/data + nav and homepage hero. Dashboard unchanged. Rollback =
revert the new files + nav/hero edits + remove the three deps. Server untouched.

## Open Questions

- None blocking. If bundle/perf is an issue on the demo machine, reduce trail length and disable
  open-space glow (already the lowest-value overlay).
