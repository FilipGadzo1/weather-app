import { getPressureTrend } from '../pressure-trend'
import type { HourlyForecast, DailyForecast } from '@/types/weather'

function makeHour(msPast: number, pressure: number | null): HourlyForecast {
  const time = new Date(Date.now() - msPast).toISOString().slice(0, 16)
  return { time, temperature: 18, wmoCode: 0, precipitationProbability: 0, windSpeed: 5, humidity: 60, pressure, apparentTemperature: 18, uvIndex: 0, precipitationAmount: 0, windDirection: 0 }
}

function makeDaily(hourly: HourlyForecast[]): DailyForecast[] {
  return [{
    date: '2026-05-20',
    tempMax: 20,
    tempMin: 10,
    wmoCode: 0,
    precipitationProbability: 0,
    sunrise: '2026-05-20T05:00',
    sunset: '2026-05-20T21:00',
    hourly,
  }]
}

describe('getPressureTrend', () => {
  it('returns rising when current pressure > past by > 1 hPa', () => {
    // pastIdx = 0 (3h ago), currentIdx = 1 (now or future)
    const hours = [
      makeHour(3 * 60 * 60 * 1000, 1010),   // 3 hours ago
      makeHour(-60 * 1000, 1015),             // 1 minute in the future (current)
    ]
    expect(getPressureTrend(makeDaily(hours))).toBe('rising')
  })

  it('returns falling when current pressure < past by > 1 hPa', () => {
    const hours = [
      makeHour(3 * 60 * 60 * 1000, 1015),
      makeHour(-60 * 1000, 1010),
    ]
    expect(getPressureTrend(makeDaily(hours))).toBe('falling')
  })

  it('returns steady when delta is exactly 0', () => {
    const hours = [
      makeHour(3 * 60 * 60 * 1000, 1013),
      makeHour(-60 * 1000, 1013),
    ]
    expect(getPressureTrend(makeDaily(hours))).toBe('steady')
  })

  it('returns null when hourly has length < 2', () => {
    const hours = [makeHour(0, 1013)]
    expect(getPressureTrend(makeDaily(hours))).toBeNull()
  })

  it('returns null when pressure is null', () => {
    const hours = [
      makeHour(3 * 60 * 60 * 1000, null),
      makeHour(-60 * 1000, 1013),
    ]
    expect(getPressureTrend(makeDaily(hours))).toBeNull()
  })

  it('returns null when pressure is NaN', () => {
    const hours = [
      makeHour(3 * 60 * 60 * 1000, NaN as unknown as number),
      makeHour(-60 * 1000, 1013),
    ]
    expect(getPressureTrend(makeDaily(hours))).toBeNull()
  })

  it('returns null when daily is empty', () => {
    expect(getPressureTrend([])).toBeNull()
  })

  it('returns steady when delta is exactly 1 (not rising — strict >)', () => {
    const hours = [
      makeHour(3 * 60 * 60 * 1000, 1012),
      makeHour(-60 * 1000, 1013),
    ]
    expect(getPressureTrend(makeDaily(hours))).toBe('steady')
  })

  it('returns steady when delta is exactly -1 (not falling — strict <)', () => {
    const hours = [
      makeHour(3 * 60 * 60 * 1000, 1013),
      makeHour(-60 * 1000, 1012),
    ]
    expect(getPressureTrend(makeDaily(hours))).toBe('steady')
  })
})
