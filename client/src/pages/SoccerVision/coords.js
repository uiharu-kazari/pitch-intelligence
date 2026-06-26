// Shared pitch geometry, coordinate mapping, and palette for the 3D scene.
// Data pitch coords: x ∈ [0,105], y ∈ [0,68]. Scene: pitch centered at origin, lying in
// the XZ plane (Y up). HOME attacks toward +X.

export const PITCH = { length: 105, width: 68 }
export const HALF_L = PITCH.length / 2 // 52.5
export const HALF_W = PITCH.width / 2 // 34

// Map data (x,y) → scene [X, height, Z].
export function toScene(x, y, h = 0) {
  return [x - HALF_L, h, -(y - HALF_W)]
}

export const COLORS = {
  home: '#3b82f6',
  homeEmissive: '#1d4ed8',
  away: '#ef4444',
  awayEmissive: '#991b1b',
  ball: '#fde047',
  carrier: '#ffffff',
  grass: '#1f7a4d',
  grassDark: '#176b42',
  line: '#eaf3ff',
  strong: '#22c55e',
  risky: '#f59e0b',
  poor: '#ef4444',
  recommended: '#22c55e',
  space: '#22c55e',
  pressure: '#ef4444',
}

export const TIER_COLOR = { strong: COLORS.strong, risky: COLORS.risky, poor: COLORS.poor }
