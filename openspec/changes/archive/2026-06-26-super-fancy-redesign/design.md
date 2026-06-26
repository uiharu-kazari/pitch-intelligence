## Context

The app is React 18 + Vite + Recharts with a token-driven, vanilla-CSS design system and full
light/dark theming. The current look is clean but flat. This change adds a premium "cinematic
glass" visual layer and motion, guided by the UI/UX Pro Max design intelligence (styles:
*Glassmorphism* and *Modern Dark / Cinema*; easing `cubic-bezier(0.16,1,0.3,1)`). Constraints:
keep WCAG AA contrast, respect `prefers-reduced-motion`, stay on the existing stack (no Tailwind/
animation libs unless trivial), and change no server/API/data behavior.

## Goals / Non-Goals

**Goals:**
- A first-impression "wow": glass panels, ambient animated background, accent glow, animated hero.
- Tasteful motion: scroll-reveal, count-up KPIs, press/hover micro-interactions, animated charts.
- Premium chart styling (gradient fills, glow, glass tooltips) that keeps data legible.
- Everything degrades gracefully: reduced-motion and no-backdrop-filter fallbacks.

**Non-Goals:**
- No new runtime dependencies (no Framer Motion / GSAP) — CSS + a tiny IntersectionObserver hook
  and a `requestAnimationFrame` counter are enough.
- No data, API, server, or chart-type changes; no information-architecture redesign.
- No 3D/WebGL, no heavy particle systems.

## Decisions

- **Glass via layered tokens, not opaque surfaces.** Add `--glass-bg` (translucent),
  `--glass-border`, `--glass-highlight`, `--glow-*`, and an elevation scale. Components reference
  tokens only. *Alternative considered:* per-component rgba — rejected (drifts, unthemeable).
- **`backdrop-filter` with `@supports` fallback.** Use blur where supported; fall back to solid
  `--surface` otherwise to guarantee contrast. *Alternative:* always-translucent — rejected
  (fails AA on unsupported browsers).
- **Ambient background = 3 CSS-animated blobs in a fixed layer** behind content, transform/opacity
  only, `will-change: transform`. *Alternative:* canvas/WebGL — rejected (cost, complexity).
- **Scroll-reveal = one `useScrollReveal` hook** wrapping IntersectionObserver, adding an
  `is-visible` class once, then unobserving. CSS does the transition. *Alternative:* library —
  rejected (unneeded weight).
- **Count-up = `AnimatedNumber` component** using `requestAnimationFrame`, triggered when revealed,
  honoring `prefers-reduced-motion` (renders final value instantly). Preserves the final value's
  decimals/suffix and uses tabular figures. *Alternative:* CSS `@property` counters — rejected
  (poor formatting control, weaker browser support).
- **Chart gradients via Recharts `<defs><linearGradient>`** referenced by `fill="url(#id)"`; glow
  via SVG `filter` / CSS drop-shadow; keep CSS-variable axis/grid/tooltip theming already in place.
  Animations use Recharts `isAnimationActive`, disabled under reduced motion.
- **Reduced-motion is centralized**: a global `@media (prefers-reduced-motion: reduce)` guard
  plus a JS `prefersReducedMotion()` helper for the imperative pieces (counter, chart flag).
- **Theme-switch correctness:** because gradients/glows are token-derived and charts read CSS
  vars, switching `[data-theme]` re-themes everything without reload.

## Risks / Trade-offs

- **Backdrop-blur performance** (many blurred layers can jank) → limit to panel surfaces + nav,
  cap blob count at 3, animate only transform/opacity, add `will-change` sparingly.
- **Motion overload / distraction** → subtle amplitudes, single-shot reveals, long ambient
  periods (≥12s), micro-interactions ≤200ms; full reduced-motion path.
- **Contrast loss on glass** → tokens tuned per theme and a solid fallback; verify AA after build.
- **Count-up formatting drift** (e.g. "4.37" vs "4") → `AnimatedNumber` takes decimals + suffix
  props and formats every frame to match the final value exactly.
- **Recharts gradient ids colliding** → unique ids per chart/series.

## Migration Plan

Purely additive/visual; no data migration. Implement token + helper layers first, then apply per
component, verifying build + live (light/dark/mobile, reduced-motion) at the end. Rollback = revert
the CSS/token/component commits; server untouched.

## Open Questions

- None blocking. If backdrop-blur proves janky on the demo machine, drop blur radius and lean on
  translucency + borders (already the fallback path).
