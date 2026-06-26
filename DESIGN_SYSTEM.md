# Design System — Pitch Intelligence

A token-driven **Data-Dense Dashboard** design system for the football Expected Goals (xG)
analytics app. Built with full light/dark theming, accessible contrast, and SVG iconography.
Direction was generated with the UI/UX Pro Max design intelligence (style: *Data-Dense
Dashboard*; type: *Fira Sans / Fira Code*; palette: blue + amber).

## Principles

1. **Tokens over hex.** Every color, space, radius, and motion value is a CSS custom property
   in `client/src/styles/design-system.css`. Components never hardcode hex.
2. **Two themes, one source.** Light and dark are sibling token blocks under `[data-theme]`.
   The theme is applied before first paint by an inline script in `index.html` (no flash), and
   toggled via the `useTheme` hook (persisted to `localStorage`).
3. **Charts follow the theme.** Recharts series use `fill="var(--chart-N)"`; axes, grid lines,
   and tooltips are styled through CSS variables, so they re-theme automatically.
4. **SVG, never emoji.** All icons are inline SVG (`client/src/icons.jsx`, Lucide-style,
   1.75px stroke, `currentColor`).
5. **Accessibility first.** ≥4.5:1 text contrast in both themes, visible `:focus-visible`
   rings, `aria-sort` on sortable headers, keyboard-activatable rows, and a global
   `prefers-reduced-motion` guard.

## Color tokens

Semantic tokens (resolve per theme):

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--bg` / `--bg-gradient` | `#f1f5fb` | `#0a1020` | App background |
| `--surface` | `#ffffff` | `#121c34` | Cards, panels |
| `--surface-2` | `#f8fafc` | `#0e1730` | Insets, table header |
| `--border` / `--border-strong` | slate-200/300 | navy borders | Dividers, outlines |
| `--text` / `--text-muted` / `--text-subtle` | slate-900 → 500 | off-white → muted | Text hierarchy |
| `--primary` | `#1e40af` | `#60a5fa` | Brand, primary actions |
| `--accent` | `#d97706` | `#f59e0b` | Highlights |
| `--success` / `--danger` | `#059669` / `#dc2626` | `#34d399` / `#f87171` | Positive / negative |

Chart series are theme-independent (`--chart-1`…`--chart-6`), each ≥3:1 against both surfaces.

## Typography

- **Sans:** Fira Sans (300–700) — UI text.
- **Mono:** Fira Code — numbers, stats, badges (paired with `.tnum` tabular figures to stop
  column jitter).
- **Scale:** `--text-xs` (12px) → `--text-4xl` (48px), 1.25 ratio on a 16px base.

## Spacing, radius, motion

- **Spacing:** 4px base — `--space-1` (4px) … `--space-10` (64px).
- **Radius:** `--radius-sm` (6px) … `--radius-xl` (20px), `--radius-full`.
- **Motion:** `--dur-fast` 150ms / `--dur-base` 240ms, eased with `--ease`
  (`cubic-bezier(0.4,0,0.2,1)`). All transitions collapse under reduced-motion.

## Components

| Area | File | Notes |
|------|------|-------|
| App shell, summary strip, states, buttons | `src/App.jsx` / `src/App.css` | Sticky blurred top bar, theme toggle, KPI summary, loading skeletons, error+retry |
| Charts | `src/components/Dashboard.jsx` / `styles/Dashboard.css` | Top-N control chips, themed tooltips, team selector |
| Table | `src/components/TeamTable.jsx` / `styles/TeamTable.css` | Sortable (`aria-sort`), sticky header, row→profile focus, horizontal scroll on mobile |
| Insights | `src/components/Insights.jsx` / `styles/Insights.css` | Icon-led cards + tactical takeaways |
| Icons | `src/icons.jsx` | Inline SVG set |
| Theme | `src/useTheme.js` | `data-theme` + localStorage sync |

## Charts (Recharts)

1. **Expected vs Actual Goals** — grouped bars, ranked by output.
2. **Net xG Difference** — diverging horizontal bars (`<Cell>` colored by sign; green ≥ 0,
   amber < 0). *This panel previously crashed on an undefined `<CustomBar/>` — now fixed.*
3. **Conversion Efficiency** — scatter of xG vs goals with a y=x reference line (above the line
   = overperforming).
4. **Team DNA** — radar of five 0–100 league-normalized axes (attack, defense, finishing,
   accuracy, shot volume) for a selectable team.

## Data model (`server/data.js`)

xG is a calibrated shot-quality proxy: `xG = shots × 0.06 + shotsOnTarget × 0.47`, tuned so
league-wide xG ≈ league-wide goals (average conversion ≈ 1.0). The API also derives normalized
radar `profile` axes and a league `/api/summary` for the KPI strip.

## Running

```bash
npm install && (cd client && npm install)
npm run dev          # API on :8000, client on :3000 (or next free port)
npm run build        # production build of the client
```

## Responsive breakpoints

- `900px` — charts/summary collapse to one column.
- `560px` — single-column everything; team badges hidden; compact padding.

Verified at 1280px (desktop) and 375px (mobile), in both light and dark themes, with a clean
console.
