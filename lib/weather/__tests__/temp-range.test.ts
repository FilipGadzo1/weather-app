import { computeRangePosition } from '../temp-range'

describe('computeRangePosition', () => {
  it('positions bar at left edge with half width for day spanning first half', () => {
    const pos = computeRangePosition(0, 10, 0, 20)
    expect(pos.leftPct).toBe(0)
    expect(pos.widthPct).toBe(50)
  })

  it('positions bar at 75% left with 25% width for top-quarter day', () => {
    const pos = computeRangePosition(15, 20, 0, 20)
    expect(pos.leftPct).toBe(75)
    expect(pos.widthPct).toBe(25)
  })

  it('floors widthPct at 4 when day min equals max', () => {
    const pos = computeRangePosition(10, 10, 0, 20)
    expect(pos.widthPct).toBeGreaterThanOrEqual(4)
  })

  it('returns finite values when all temps equal (span=0 guard)', () => {
    const pos = computeRangePosition(10, 10, 10, 10)
    expect(Number.isFinite(pos.leftPct)).toBe(true)
    expect(Number.isFinite(pos.widthPct)).toBe(true)
    expect(pos.widthPct).toBeGreaterThanOrEqual(4)
  })

  it('clamps leftPct within 0-100', () => {
    const pos = computeRangePosition(-5, 0, 0, 20)
    expect(pos.leftPct).toBeGreaterThanOrEqual(0)
  })

  it('handles negative temperatures', () => {
    const pos = computeRangePosition(-10, 5, -10, 20)
    expect(pos.leftPct).toBe(0)
    expect(pos.widthPct).toBeCloseTo(50, 0)
  })
})
