export interface RangePosition {
  leftPct: number
  widthPct: number
}

export function computeRangePosition(
  dayMin: number,
  dayMax: number,
  weekMin: number,
  weekMax: number
): RangePosition {
  const span = Math.max(weekMax - weekMin, 0.01)
  const leftPct = ((dayMin - weekMin) / span) * 100
  const widthPct = Math.max(((dayMax - dayMin) / span) * 100, 4)
  return {
    leftPct: Math.max(0, Math.min(100, leftPct)),
    widthPct: Math.max(0, Math.min(100 - leftPct, widthPct)),
  }
}
