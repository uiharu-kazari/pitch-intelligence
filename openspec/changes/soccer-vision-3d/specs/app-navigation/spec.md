## ADDED Requirements

### Requirement: Client-side navigation
The app SHALL provide navigation between the existing Dashboard and the new Soccer Vision 3D
module using hash-based routes, with the active item visually indicated and browser back/forward
working.

#### Scenario: Navigate to Soccer Vision 3D
- **WHEN** the user clicks the "Soccer Vision 3D" nav item
- **THEN** the URL becomes `#/soccer-vision`, the module renders, and the nav item is marked active

#### Scenario: Deep link and back
- **WHEN** the user loads `#/soccer-vision` directly or presses the browser back button
- **THEN** the correct view renders for the current hash without a full reload

### Requirement: Existing functionality preserved
Adding navigation SHALL preserve all existing dashboard functionality and theming.

#### Scenario: Dashboard still works
- **WHEN** the user is on the Dashboard route
- **THEN** the summary strip, charts, table, insights, and light/dark theme all function as before

### Requirement: Homepage feature promotion
The homepage SHALL promote Soccer Vision 3D as the flagship new feature with a hero/card,
including a title, subtitle, a short "Why this matters" message, and a "Try demo play" button that
opens the module on a demo scenario.

#### Scenario: Hero promotes and launches the feature
- **WHEN** the user views the homepage
- **THEN** a Soccer Vision 3D hero is shown with title "Soccer Vision 3D" and subtitle
  "Interactive tactical analysis for passing lanes, pressure, and open space"
- **WHEN** the user clicks "Try demo play"
- **THEN** the app navigates to the Soccer Vision 3D module on a demo scenario
