# premium-data-viz Specification

## Purpose

Define premium styling and motion for data visualizations: gradient/glow chart styling that keeps
data the priority, animated chart entrances with reduced-motion fallbacks, and glass-styled
tooltips and markers that surface exact values.

## Requirements

### Requirement: Gradient and glow chart styling
Charts SHALL use gradient fills and subtle glow consistent with the glass aesthetic, while
keeping data the visual priority (no decoration that obscures values).

#### Scenario: Bars use vertical gradient fills
- **WHEN** the Expected-vs-Actual and Net-xG bar charts render
- **THEN** bars are filled with a vertical gradient derived from the series color and remain
  distinguishable from each other at ≥3:1 against the panel surface

#### Scenario: Theme switch updates chart styling
- **WHEN** the theme toggles between light and dark
- **THEN** chart gradients, axes, grid lines, and the scatter reference line update to the active
  theme tokens without a reload

### Requirement: Animated chart entrance
Charts SHALL animate their data marks on first render and remain readable immediately for users
who disable motion.

#### Scenario: Chart animates in
- **WHEN** a chart first renders with motion allowed
- **THEN** its bars/points/area animate from a baseline to final values within ~600ms

#### Scenario: Reduced motion renders charts statically
- **WHEN** the user has `prefers-reduced-motion: reduce`
- **THEN** charts render at final values with animation disabled and all data labels/tooltips
  remain available

### Requirement: Glass tooltips and markers
Chart tooltips and interactive markers SHALL match the premium glass styling and present exact
values on hover/focus.

#### Scenario: Tooltip matches glass style
- **WHEN** a user hovers a data mark
- **THEN** a frosted tooltip appears showing the series name and exact value with tabular figures,
  styled from the same surface/border/shadow tokens as panels
