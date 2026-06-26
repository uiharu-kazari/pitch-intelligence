## Why

The dashboard is now functional and clean, but visually it reads as a competent admin panel,
not a "wow" product. For a hackathon submission, the first five seconds decide the judge's
impression. We want a premium, cinematic feel — glassmorphism depth, ambient motion, and
delightful micro-interactions — without sacrificing the accessibility, performance, and data
clarity already in place.

## What Changes

- Introduce a **premium visual layer**: glassmorphism panels (frosted backdrop-blur, hairline
  borders, layered elevation) over an **animated ambient background** (slow-drifting gradient
  blobs), built on a refined "cinematic" token set with an accent-glow system.
- Add **motion & micro-interactions**: scroll-reveal entrance for panels, scale/glow press
  feedback, premium `cubic-bezier(0.16,1,0.3,1)` easing, and an animated gradient hero.
- Add **animated number counters** for the KPI summary and headline insight stats (count-up on
  mount / when revealed).
- **Premium chart styling**: gradient-filled bars/areas, soft glow, animated entrance, and
  refined custom tooltips/dots consistent with the glass aesthetic.
- **Polished states**: richer glass shimmer skeletons and a more characterful error state.
- **BREAKING (visual only):** the design-system token surface model changes (translucent
  surfaces, glow tokens, new easing). No data, API, or component contract changes.
- All effects must respect `prefers-reduced-motion` and keep WCAG AA contrast in both themes.

## Capabilities

### New Capabilities
- `premium-visual-system`: Glassmorphism surfaces, animated ambient background, accent-glow and
  elevation tokens, refined cinematic palette for light + dark.
- `motion-and-interactions`: Scroll-reveal, animated number counters, press/hover
  micro-interactions, hero animation — all reduced-motion aware.
- `premium-data-viz`: Gradient/glow chart styling, animated chart entrance, glass tooltips.

### Modified Capabilities
- (none — no existing spec-level capabilities are defined in `openspec/specs/` yet.)

## Impact

- **CSS/tokens**: `client/src/styles/design-system.css` (token model), `index.css`,
  per-component CSS (`App.css`, `Dashboard.css`, `TeamTable.css`, `Insights.css`).
- **Components**: `App.jsx` (hero, ambient bg, counters), `Dashboard.jsx` (chart gradients,
  reveal), `Insights.jsx`, `TeamTable.jsx`; new helpers (`AnimatedNumber`, `useScrollReveal`,
  `AmbientBackground`).
- **HTML**: `client/index.html` (smooth scroll, theme/meta already present).
- **No changes** to `server/`, the API contract, or the data model.
- **Risk**: backdrop-blur performance and motion overuse — mitigated by GPU-friendly
  properties (transform/opacity), limited blur layers, and reduced-motion fallbacks.
