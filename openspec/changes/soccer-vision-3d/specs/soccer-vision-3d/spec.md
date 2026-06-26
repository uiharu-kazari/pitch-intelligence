## ADDED Requirements

### Requirement: 3D pitch rendering
The module SHALL render a recognizable 3D soccer pitch including grass surface, touchlines and
goal lines, halfway line, center circle, both penalty boxes, and goals, under polished lighting.

#### Scenario: Pitch renders with markings
- **WHEN** the Soccer Vision 3D page mounts
- **THEN** a green pitch with halfway line, center circle, two penalty boxes, and two goals is
  visible on a subtle dark background

### Requirement: Camera controls
The module SHALL provide orbit controls plus discrete "top-down" and "reset" camera buttons.

#### Scenario: Top-down and reset
- **WHEN** the user clicks the top-down button
- **THEN** the camera animates to a bird's-eye view of the pitch
- **WHEN** the user clicks reset
- **THEN** the camera returns to the default broadcast angle

### Requirement: Sequence playback
The module SHALL animate a selected attacking sequence over time with play/pause, restart, a speed
control, and a timeline scrubber, interpolating positions between frames for smooth motion.

#### Scenario: Play and scrub
- **WHEN** the user presses play
- **THEN** players and the ball move along their tracked positions over time
- **WHEN** the user drags the timeline scrubber
- **THEN** the scene jumps to that moment and the analytics panel updates to match

#### Scenario: Speed control
- **WHEN** the user changes playback speed
- **THEN** the animation rate changes accordingly without breaking position interpolation

### Requirement: Player and ball visualization
The module SHALL render players as team-colored 3D markers with role/number labels and animate the
ball, drawing movement trails for attacking players and glowing lines for completed passes.

#### Scenario: Teams are distinguishable
- **WHEN** a sequence is displayed
- **THEN** home and away players use distinct colors, each shows a label, and the ball is clearly
  visible and follows the ball position over time

### Requirement: On-pitch analytics overlays
The module SHALL visualize analytics on the pitch: passing lanes from the ball carrier to
candidate receivers colored by quality (green strong / yellow risky / red poor), translucent
pressure zones around defenders, subtle open-space glows, and a glowing ring on the recommended
receiver.

#### Scenario: Lanes reflect quality
- **WHEN** analytics are computed for the current frame
- **THEN** each candidate receiver has a lane colored by its threat tier and the recommended
  receiver is highlighted with a distinct glowing ring

#### Scenario: Overlays can be read without clutter
- **WHEN** overlays are shown
- **THEN** pressure zones and open-space glows are translucent and do not obscure player identity

### Requirement: Analytics side panel and legend
The module SHALL show a side panel with the current play name, timestamp, ball carrier, best
passing option, attacking threat score, pass risk score, nearest-defender distance, and a
plain-English tactical explanation; plus a color legend and a visible explanation of the threat
formula.

#### Scenario: Panel tracks the current moment
- **WHEN** playback advances or is scrubbed
- **THEN** the side panel values update to the current frame's ball carrier, scores, and
  recommendation

#### Scenario: Formula is transparent to judges
- **WHEN** the user views the module
- **THEN** the weighted attacking-threat formula and the green/yellow/red legend are visible in
  the UI

### Requirement: Three sample scenarios
The module SHALL offer at least three selectable scenarios — a good through ball into space, a
risky central pass under pressure, and a missed opportunity where a wide player was more open —
each loadable independently.

#### Scenario: Scenario selection
- **WHEN** the user selects a different scenario
- **THEN** the pitch, playback, and analytics reload for that sequence

### Requirement: Simulated-data labeling
The module SHALL clearly label the tracking data as sample/simulated in the UI.

#### Scenario: Sample data disclosed
- **WHEN** the module is displayed
- **THEN** a visible label communicates that the tracking data is simulated/sample data
