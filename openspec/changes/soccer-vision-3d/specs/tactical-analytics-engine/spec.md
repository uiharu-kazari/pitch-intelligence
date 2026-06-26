## ADDED Requirements

### Requirement: Attacking threat score
The engine SHALL compute, for a given ball carrier and candidate receiver at a frame, an attacking
threat score normalized to 0–100 from a transparent weighted formula combining forward progress,
receiver space, passing-lane openness, centrality bonus, and (inverse) defensive pressure.

#### Scenario: Score is bounded and transparent
- **WHEN** the engine scores any candidate pass
- **THEN** it returns a number in [0, 100], and exposes each weighted component
  (forward progress, receiver space, lane openness, centrality, pressure) used to derive it

#### Scenario: Open advancing pass scores higher than pressured square pass
- **WHEN** comparing a forward pass to a receiver with large separation and a clear lane against a
  sideways pass to a tightly-marked receiver
- **THEN** the forward open pass receives a strictly higher threat score

### Requirement: Pass risk score
The engine SHALL derive a pass risk score as `100 - attacking_threat_score` for each candidate.

#### Scenario: Risk complements threat
- **WHEN** a candidate has attacking threat score T
- **THEN** its pass risk score equals 100 − T

### Requirement: Defensive pressure and nearest defender
The engine SHALL compute the nearest opponent distance to the ball carrier and a defensive
pressure value that increases as opponents get closer.

#### Scenario: Closer defenders raise pressure
- **WHEN** an opponent moves nearer to the ball carrier between two frames
- **THEN** the nearest-defender distance decreases and the pressure value increases

### Requirement: Passing-lane openness and receiver space
The engine SHALL compute, per candidate receiver, how clear the straight passing lane is (based on
opponents near the lane) and how much space the receiver has (distance to nearest opponent).

#### Scenario: Opponent intercepting the lane lowers openness
- **WHEN** an opponent sits close to the straight line between carrier and receiver
- **THEN** that candidate's passing-lane openness is reduced

### Requirement: Recommended next pass
The engine SHALL select the candidate receiver with the highest attacking threat score as the
recommended pass, or report that holding/dribbling is best when no candidate is viable.

#### Scenario: Best option is recommended
- **WHEN** candidates are scored for a frame
- **THEN** the recommended receiver is the one with the maximum threat score, and ties resolve
  deterministically

### Requirement: Plain-English explanation
The engine SHALL produce a short natural-language explanation of why the recommended pass is best,
referencing concrete values (separation, lane, forward progress).

#### Scenario: Explanation cites the drivers
- **WHEN** a recommendation is produced
- **THEN** the explanation names the receiver and cites at least two contributing factors with
  their values (e.g. separation in meters, lane openness, progression)
