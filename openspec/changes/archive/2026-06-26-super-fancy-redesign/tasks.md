## 1. Token & foundation layer (premium-visual-system)

- [x] 1.1 Extend `design-system.css` with glass tokens (`--glass-bg`, `--glass-border`, `--glass-highlight`), glow tokens (`--glow-primary`, `--glow-accent`), elevation scale, and `--ease-premium: cubic-bezier(0.16,1,0.3,1)` for both `[data-theme]` blocks
- [x] 1.2 Add a `.glass` utility (translucent bg + `backdrop-filter` blur + hairline border + top inner highlight) with an `@supports not (backdrop-filter: blur(1px))` solid fallback to `--surface`
- [x] 1.3 Add reusable keyframes/utilities: `reveal` (fade+rise), hero gradient sheen, ambient blob drift; ensure the global reduced-motion guard neutralizes all of them
- [x] 1.4 Enable `scroll-behavior: smooth` and verify AA contrast tokens hold on glass in both themes

## 2. Ambient background (premium-visual-system)

- [x] 2.1 Create `AmbientBackground.jsx` — a fixed, aria-hidden layer with 3 blurred gradient blobs using theme tokens, transform/opacity drift only
- [x] 2.2 Mount it in `App.jsx` behind all content; confirm it never reduces foreground legibility and is static under reduced motion

## 3. Motion helpers (motion-and-interactions)

- [x] 3.1 Create `useScrollReveal` hook (IntersectionObserver: add `is-visible` once, then unobserve) and a `prefersReducedMotion()` helper
- [x] 3.2 Create `AnimatedNumber.jsx` (rAF count-up, `decimals`/`suffix`/`prefix` props, tabular figures, instant final value under reduced motion, triggers when revealed)

## 4. App shell: hero, glass, counters (motion-and-interactions + premium-visual-system)

- [x] 4.1 Convert top bar + summary cards + footer to `.glass`; add accent glow to brand mark and theme toggle hover/press
- [x] 4.2 Add animated gradient sheen to the brand/hero title (static under reduced motion)
- [x] 4.3 Replace KPI summary values with `AnimatedNumber`; apply scroll-reveal to the summary strip
- [x] 4.4 Upgrade loading skeletons to glass shimmer and give the error state a glass treatment

## 5. Premium charts (premium-data-viz)

- [x] 5.1 Add Recharts `<defs><linearGradient>` (unique ids) for Expected/Actual/Net-xG bars and the radar; fill via `url(#id)`; add subtle glow
- [x] 5.2 Keep theme-var axis/grid/tooltip styling; enable chart entrance animation and gate it on `prefersReducedMotion()`
- [x] 5.3 Restyle the custom tooltip to `.glass`; apply scroll-reveal to each chart panel and press feedback to control chips & team select

## 6. Table & insights polish (motion-and-interactions + premium-visual-system)

- [x] 6.1 Apply `.glass` + scroll-reveal to the table panel; add row hover glow and keep `aria-sort` / keyboard focus rings visible
- [x] 6.2 Apply `.glass` + scroll-reveal to insight cards; animate the headline insight stats with `AnimatedNumber`; add press/hover micro-interactions

## 7. Verify

- [x] 7.1 `npm run build` passes with no errors
- [x] 7.2 Live check via browser: zero console errors; screenshot desktop (1280px) + mobile (375px) in light AND dark
- [x] 7.3 Verify with `prefers-reduced-motion: reduce`: no drift/reveal/count-up/chart animation; content fully visible
- [x] 7.4 Spot-check AA contrast on glass surfaces in both themes; clean up any test artifacts
