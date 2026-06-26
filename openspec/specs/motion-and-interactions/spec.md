# motion-and-interactions Specification

## Purpose

Define the dashboard's motion language and interactive feedback: scroll-reveal entrances, animated
number counters, hover/press micro-interactions, and an animated hero header — each with a
`prefers-reduced-motion` fallback that preserves full functionality.

## Requirements

### Requirement: Scroll-reveal entrance
Content sections (summary strip, each chart panel, table, insights) SHALL animate into view with
a fade-and-rise entrance the first time they enter the viewport.

#### Scenario: Section reveals on scroll
- **WHEN** a section scrolls into the viewport for the first time with motion allowed
- **THEN** it transitions from a slightly lower, transparent state to its final position and full
  opacity once, using transform/opacity only, and does not re-trigger on subsequent scrolls

#### Scenario: Reduced motion shows content immediately
- **WHEN** the user has `prefers-reduced-motion: reduce`
- **THEN** all sections are fully visible in their final position with no entrance animation

### Requirement: Animated number counters
Headline numeric stats (KPI summary values and key insight figures) SHALL count up from zero to
their target value when first revealed.

#### Scenario: KPI counts up on reveal
- **WHEN** a KPI value enters the viewport with motion allowed
- **THEN** the displayed number animates from 0 to its final value within ~1s, preserves the
  formatting/precision of the final value, and uses tabular figures so layout does not shift

#### Scenario: Reduced motion shows final value
- **WHEN** the user has `prefers-reduced-motion: reduce`
- **THEN** the final value is shown immediately with no counting animation

### Requirement: Press and hover micro-interactions
Interactive elements (buttons, chips, cards, table rows, theme toggle) SHALL provide visible
hover and press feedback using premium easing.

#### Scenario: Card press feedback
- **WHEN** a user presses an interactive card or button
- **THEN** it applies a subtle scale (0.97–1.0) and/or glow within 100ms and restores on release,
  using `cubic-bezier(0.16,1,0.3,1)` easing without shifting surrounding layout

#### Scenario: Keyboard focus is visible
- **WHEN** an interactive element receives keyboard focus
- **THEN** a visible focus ring is shown that meets contrast requirements in both themes

### Requirement: Animated hero header
The header SHALL present an animated gradient brand treatment that conveys a premium feel without
being distracting.

#### Scenario: Hero gradient animates subtly
- **WHEN** the header is displayed with motion allowed
- **THEN** the brand title shows an animated gradient/sheen with period ≥ 6s

#### Scenario: Reduced motion freezes hero
- **WHEN** the user has `prefers-reduced-motion: reduce`
- **THEN** the hero gradient is static
