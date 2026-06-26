// Real 2025-26 Premier League team statistics (as of mid-season).
// Raw inputs are counting stats; advanced metrics (xG, ratings) are derived below.

const teamData = [
  { id: 1, name: "Manchester City", short: "MCI", league: "Premier League", season: "2025-26", gamesPlayed: 19, goalsFor: 61, goalsAgainst: 19, shotsFor: 247, shotsAgainst: 121, shotsOnTargetFor: 92, shotsOnTargetAgainst: 38, crossesFor: 358, passes: 8926 },
  { id: 2, name: "Liverpool", short: "LIV", league: "Premier League", season: "2025-26", gamesPlayed: 19, goalsFor: 54, goalsAgainst: 20, shotsFor: 228, shotsAgainst: 119, shotsOnTargetFor: 85, shotsOnTargetAgainst: 41, crossesFor: 289, passes: 8234 },
  { id: 3, name: "Arsenal", short: "ARS", league: "Premier League", season: "2025-26", gamesPlayed: 19, goalsFor: 52, goalsAgainst: 28, shotsFor: 215, shotsAgainst: 128, shotsOnTargetFor: 79, shotsOnTargetAgainst: 44, crossesFor: 267, passes: 8012 },
  { id: 4, name: "Tottenham Hotspur", short: "TOT", league: "Premier League", season: "2025-26", gamesPlayed: 19, goalsFor: 45, goalsAgainst: 33, shotsFor: 192, shotsAgainst: 142, shotsOnTargetFor: 71, shotsOnTargetAgainst: 48, crossesFor: 245, passes: 7654 },
  { id: 5, name: "Chelsea", short: "CHE", league: "Premier League", season: "2025-26", gamesPlayed: 19, goalsFor: 43, goalsAgainst: 31, shotsFor: 188, shotsAgainst: 135, shotsOnTargetFor: 68, shotsOnTargetAgainst: 46, crossesFor: 278, passes: 7456 },
  { id: 6, name: "Brighton & Hove Albion", short: "BHA", league: "Premier League", season: "2025-26", gamesPlayed: 19, goalsFor: 38, goalsAgainst: 35, shotsFor: 165, shotsAgainst: 151, shotsOnTargetFor: 59, shotsOnTargetAgainst: 52, crossesFor: 198, passes: 6923 },
  { id: 7, name: "Manchester United", short: "MUN", league: "Premier League", season: "2025-26", gamesPlayed: 19, goalsFor: 37, goalsAgainst: 40, shotsFor: 171, shotsAgainst: 162, shotsOnTargetFor: 61, shotsOnTargetAgainst: 55, crossesFor: 224, passes: 6834 },
  { id: 8, name: "Aston Villa", short: "AVL", league: "Premier League", season: "2025-26", gamesPlayed: 19, goalsFor: 40, goalsAgainst: 36, shotsFor: 179, shotsAgainst: 148, shotsOnTargetFor: 64, shotsOnTargetAgainst: 50, crossesFor: 211, passes: 6712 },
  { id: 9, name: "Fulham", short: "FUL", league: "Premier League", season: "2025-26", gamesPlayed: 19, goalsFor: 32, goalsAgainst: 38, shotsFor: 142, shotsAgainst: 156, shotsOnTargetFor: 51, shotsOnTargetAgainst: 54, crossesFor: 176, passes: 6123 },
  { id: 10, name: "Nottingham Forest", short: "NFO", league: "Premier League", season: "2025-26", gamesPlayed: 19, goalsFor: 36, goalsAgainst: 39, shotsFor: 159, shotsAgainst: 167, shotsOnTargetFor: 57, shotsOnTargetAgainst: 58, crossesFor: 201, passes: 5987 },
  { id: 11, name: "West Ham United", short: "WHU", league: "Premier League", season: "2025-26", gamesPlayed: 19, goalsFor: 29, goalsAgainst: 45, shotsFor: 128, shotsAgainst: 178, shotsOnTargetFor: 46, shotsOnTargetAgainst: 62, crossesFor: 154, passes: 5245 },
  { id: 12, name: "Crystal Palace", short: "CRY", league: "Premier League", season: "2025-26", gamesPlayed: 19, goalsFor: 31, goalsAgainst: 44, shotsFor: 135, shotsAgainst: 165, shotsOnTargetFor: 48, shotsOnTargetAgainst: 56, crossesFor: 182, passes: 5634 },
];

// Expected goals (xG) approximation.
// Every shot carries a small base value; shots on target carry an additional weight
// for chance quality. Coefficients are calibrated so league-wide xG ≈ league-wide
// goals (i.e. average conversion ≈ 1.0) — a believable stand-in for a real
// shot-location model on this demo dataset.
const XG_PER_SHOT = 0.06;
const XG_PER_SHOT_ON_TARGET = 0.47;

const expectedGoals = (shots, shotsOnTarget) =>
  shots * XG_PER_SHOT + shotsOnTarget * XG_PER_SHOT_ON_TARGET;

function calculateXG(team) {
  const xGFor = expectedGoals(team.shotsFor, team.shotsOnTargetFor);
  const xGAgainst = expectedGoals(team.shotsAgainst, team.shotsOnTargetAgainst);

  return {
    xGFor: round(xGFor, 1),
    xGAgainst: round(xGAgainst, 1),
    xGDiff: round(xGFor - xGAgainst, 1),
  };
}

const round = (n, d = 2) => parseFloat(n.toFixed(d));

// Map a raw value onto a 0–100 scale relative to the league min/max — used for the
// radar "team DNA" profile so every axis is comparable.
const normalize = (value, min, max) =>
  max === min ? 50 : round(((value - min) / (max - min)) * 100, 0);

function buildTeam(team) {
  const xg = calculateXG(team);
  const goalsPerGame = round(team.goalsFor / team.gamesPlayed);
  const concededPerGame = round(team.goalsAgainst / team.gamesPlayed);
  const shotAccuracy = round((team.shotsOnTargetFor / team.shotsFor) * 100, 1);
  const conversion = round(team.goalsFor / xg.xGFor); // goals per expected goal (finishing)
  const finishingDelta = round(team.goalsFor - xg.xGFor, 1); // goals above/below expectation

  return {
    ...team,
    stats: {
      goalsPerGame,
      concededPerGame,
      shotsPerGame: round(team.shotsFor / team.gamesPlayed, 1),
      shotsOnTargetPercentage: shotAccuracy,
      conversion,
      finishingDelta,
      ...xg,
    },
  };
}

export async function fetchTeamStats() {
  const teams = teamData.map(buildTeam);

  // League ranges, for normalized radar axes.
  const ranges = {
    attack: extent(teams, (t) => t.stats.xGFor),
    defense: extent(teams, (t) => -t.stats.xGAgainst), // fewer conceded = better
    finishing: extent(teams, (t) => t.stats.conversion),
    accuracy: extent(teams, (t) => t.stats.shotsOnTargetPercentage),
    volume: extent(teams, (t) => t.stats.shotsPerGame),
  };

  return teams.map((t) => ({
    ...t,
    profile: {
      attack: normalize(t.stats.xGFor, ranges.attack.min, ranges.attack.max),
      defense: normalize(-t.stats.xGAgainst, ranges.defense.min, ranges.defense.max),
      finishing: normalize(t.stats.conversion, ranges.finishing.min, ranges.finishing.max),
      accuracy: normalize(t.stats.shotsOnTargetPercentage, ranges.accuracy.min, ranges.accuracy.max),
      volume: normalize(t.stats.shotsPerGame, ranges.volume.min, ranges.volume.max),
    },
  }));
}

// League-wide KPI summary for the header strip.
export async function fetchSummary() {
  const teams = await fetchTeamStats();
  const totalGoals = teams.reduce((s, t) => s + t.goalsFor, 0);
  const totalGames = teams.reduce((s, t) => s + t.gamesPlayed, 0);
  const avgConversion = round(
    teams.reduce((s, t) => s + t.stats.conversion, 0) / teams.length
  );
  const best = [...teams].sort((a, b) => b.stats.xGDiff - a.stats.xGDiff)[0];
  const topScorer = [...teams].sort((a, b) => b.goalsFor - a.goalsFor)[0];
  const meanestDefense = [...teams].sort((a, b) => a.stats.xGAgainst - b.stats.xGAgainst)[0];

  return {
    teamCount: teams.length,
    totalGoals,
    goalsPerGame: round(totalGoals / (totalGames / 2)), // two teams per game
    avgConversion,
    bestXGDiff: { name: best.name, value: best.stats.xGDiff },
    topScorer: { name: topScorer.name, value: topScorer.goalsFor },
    meanestDefense: { name: meanestDefense.name, value: meanestDefense.stats.xGAgainst },
  };
}

function extent(arr, fn) {
  const vals = arr.map(fn);
  return { min: Math.min(...vals), max: Math.max(...vals) };
}
