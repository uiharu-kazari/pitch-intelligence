# premium-visual-system Specification

## Purpose

Define the premium visual foundation of the dashboard: glassmorphism surfaces, an animated
ambient background, reusable accent-glow and elevation tokens, and contrast guarantees that keep
text legible over translucent surfaces in both themes.

## Requirements

### Requirement: Glassmorphism surfaces
The dashboard SHALL render primary content surfaces (summary cards, chart panels, table panel,
insight cards) as frosted-glass surfaces using a translucent background, backdrop blur, and a
hairline top-edge highlight, layered above an animated background.

#### Scenario: Panel renders as frosted glass
- **WHEN** a chart panel is displayed on a capable browser
- **THEN** its background is translucent (not fully opaque), a `backdrop-filter` blur of 12–20px
  is applied, and a 1px hairline border plus a subtle top inner highlight are visible

#### Scenario: Backdrop-blur is not supported
- **WHEN** the browser does not support `backdrop-filter`
- **THEN** the panel falls back to a solid theme `--surface` color so text contrast is preserved
  at ≥4.5:1

### Requirement: Animated ambient background
The application SHALL display a subtle, continuously drifting ambient background composed of
soft gradient "blobs" behind all content, in both light and dark themes.

#### Scenario: Ambient motion on load
- **WHEN** the app is loaded with motion allowed
- **THEN** 2–3 blurred gradient blobs oscillate slowly (period ≥ 12s) using only transform/opacity
  and never obscure foreground text legibility

#### Scenario: Reduced motion disables drift
- **WHEN** the user has `prefers-reduced-motion: reduce`
- **THEN** the blobs are rendered statically with no animation

### Requirement: Accent-glow and elevation tokens
The design system SHALL expose reusable tokens for translucent surfaces, accent glow, and a
layered elevation/shadow scale, consumed by components rather than hardcoded values.

#### Scenario: Tokens drive both themes
- **WHEN** the theme switches between light and dark
- **THEN** glass surface, border, glow, and shadow values resolve from `[data-theme]` tokens with
  no hardcoded hex in component CSS, and primary CTAs/active elements show an accent glow

### Requirement: Contrast preserved over glass
The premium surfaces SHALL maintain WCAG AA text contrast (≥4.5:1 body, ≥3:1 large/UI) in both
themes despite translucency.

#### Scenario: Text remains legible on glass
- **WHEN** any glass surface is shown in light or dark mode
- **THEN** body text on that surface measures ≥4.5:1 contrast and secondary text ≥3:1
