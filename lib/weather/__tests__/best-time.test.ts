import { findBestWindow } from '../best-time'
import type { HourlyForecast } from '@/types/weather'

function makeHour(temperature: number, precipitationProbability: number, windSpeed: number, time = '2026-05-20T12:00'): HourlyForecast {
  return { time, temperature, wmoCode: 0, precipitationProbability, windSpeed }
}

const TERRIBLE = makeHour(-10, 90, 60)
const IDEAL    = makeHour(18, 0, 5)

describe('findBestWindow', () => {
  it('returns null when hours.length < 2', () => {
    expect(findBestWindow([])).toBeNull()
    expect(findBestWindow([IDEAL])).toBeNull()
  })

  it('returns null when all hours are terrible (score=0)', () => {
    expect(findBestWindow([TERRIBLE, TERRIBLE, TERRIBLE])).toBeNull()
  })

  it('returns a BestWindow with score >= 40 when all hours are ideal', () => {
    const result = findBestWindow([IDEAL, IDEAL, IDEAL])
    expect(result).not.toBeNull()
    expect(result!.score).toBeGreaterThanOrEqual(40)
  })

  it('startHour is always in range [0, hours.length - 2]', () => {
    const hours = [IDEAL, IDEAL, IDEAL, IDEAL]
    const result = findBestWindow(hours)
    expect(result).not.toBeNull()
    expect(result!.startHour).toBeGreaterThanOrEqual(0)
    expect(result!.startHour).toBeLessThanOrEqual(hours.length - 2)
  })

  it('selects the highest-scoring window', () => {
    // hours[2] and hours[3] are ideal; hours[0] and hours[1] are terrible
    const hours = [TERRIBLE, TERRIBLE, IDEAL, IDEAL]
    const result = findBestWindow(hours)
    expect(result).not.toBeNull()
    expect(result!.startHour).toBe(2)
  })

  it('returns null when best window score is below threshold', () => {
    // score 25 per hour → average 25 < 40 → null
    // temp<0 (-40), precip>40 (-20), wind>30 (-15) => 100-40-20-15=25
    const lowHour = makeHour(-5, 50, 35)
    expect(findBestWindow([lowHour, lowHour])).toBeNull()
  })

  it('returns a window when best score is exactly 40', () => {
    // score 40: temp=18(0), precip=41(-20), wind=21(-5) => 75 per hour, avg=75 >= 40
    // Let's get a window averaging exactly 40:
    // hour A: score=40, hour B: score=40 => avg=40
    // score 40: temp=18(0), precip=0(0), wind=0(0) => 100 — too high
    // Need penalties summing to 60: temp<0(-40)+precip>20(-10)+wind>30(-15) = -65 => 35 — too low
    // temp<8(-20)+precip>40(-20)+wind>20(-5) => 100-20-20-5=55 — not 40
    // temp<8(-20)+precip>40(-20)+wind>30(-15)+wind>20 already covered by >30 => 100-20-20-15=45
    // temp<8(-20)+precip>70(-40) => 100-20-40=40 ✓
    const fortyHour = makeHour(5, 75, 5)  // score = 100 - 20 - 40 = 40
    const result = findBestWindow([fortyHour, fortyHour])
    expect(result).not.toBeNull()
    expect(result!.score).toBe(40)
  })

  describe('buildLabel via findBestWindow', () => {
    it('returns "Around 12am" for hour 00:00', () => {
      const h = makeHour(18, 0, 5, '2026-05-20T00:00')
      const result = findBestWindow([h, h])
      expect(result).not.toBeNull()
      expect(result!.label).toBe('Around 12am')
    })

    it('returns "Around 11am" for hour 11:00', () => {
      const h = makeHour(18, 0, 5, '2026-05-20T11:00')
      const result = findBestWindow([h, h])
      expect(result).not.toBeNull()
      expect(result!.label).toBe('Around 11am')
    })

    it('returns "Around noon" for hour 12:00', () => {
      const h = makeHour(18, 0, 5, '2026-05-20T12:00')
      const result = findBestWindow([h, h])
      expect(result).not.toBeNull()
      expect(result!.label).toBe('Around noon')
    })

    it('returns "Around 5pm" for hour 17:00', () => {
      const h = makeHour(18, 0, 5, '2026-05-20T17:00')
      const result = findBestWindow([h, h])
      expect(result).not.toBeNull()
      expect(result!.label).toBe('Around 5pm')
    })
  })
})
