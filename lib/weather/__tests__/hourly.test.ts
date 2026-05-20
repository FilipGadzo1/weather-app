import { getNext24Hours } from '../hourly'
import type { WeatherData, HourlyForecast } from '@/types/weather'

function makeHour(iso: string, temp = 15): HourlyForecast {
  return {
    time: iso, temperature: temp, wmoCode: 2, precipitationProbability: 0, windSpeed: 10,
    humidity: 50, pressure: 1013, apparentTemperature: temp, uvIndex: 0,
    precipitationAmount: 0, windDirection: 0,
  }
}

function makeData(hours: HourlyForecast[]): WeatherData {
  const byDay: Record<string, HourlyForecast[]> = {}
  for (const h of hours) {
    const day = h.time.split('T')[0]
    if (!byDay[day]) byDay[day] = []
    byDay[day].push(h)
  }
  return {
    location: { name: 'X', country: 'X', lat: 0, lon: 0 },
    current: {
      temperature: 15, feelsLike: 15, humidity: 50, windSpeed: 5,
      windDirection: 0, uvIndex: 0, visibility: 10, wmoCode: 2,
      isDay: true, precipitationProbability: 0,
      pressure: null, cloudCover: null, dewPoint: null,
    },
    daily: Object.entries(byDay).map(([date, hourly]) => ({
      date, tempMax: 20, tempMin: 10, wmoCode: 2,
      precipitationProbability: 0, sunrise: '', sunset: '', hourly,
    })),
    timezone: 'UTC',
    hasSevereCondition: false,
  }
}

describe('getNext24Hours', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-05-19T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('returns exactly 24 entries starting at first hour >= now', () => {
    const hours: HourlyForecast[] = []
    for (let d = 19; d <= 21; d++) {
      for (let h = 0; h < 24; h++) {
        hours.push(makeHour(`2026-05-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:00:00Z`))
      }
    }
    const result = getNext24Hours(makeData(hours))
    expect(result).toHaveLength(24)
    expect(result[0].time).toBe('2026-05-19T12:00:00Z')
    expect(result[23].time).toBe('2026-05-20T11:00:00Z')
  })

  it('crosses midnight across daily buckets', () => {
    jest.setSystemTime(new Date('2026-05-19T22:00:00Z'))
    const hours: HourlyForecast[] = []
    for (let d = 19; d <= 21; d++) {
      for (let h = 0; h < 24; h++) {
        hours.push(makeHour(`2026-05-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:00:00Z`))
      }
    }
    const result = getNext24Hours(makeData(hours))
    expect(result).toHaveLength(24)
    expect(result[0].time).toBe('2026-05-19T22:00:00Z')
    expect(result[2].time).toBe('2026-05-20T00:00:00Z')
    expect(result[23].time).toBe('2026-05-20T21:00:00Z')
  })

  it('falls back to first 24 entries when all hours are in the past', () => {
    jest.setSystemTime(new Date('2030-01-01T00:00:00Z'))
    const hours: HourlyForecast[] = []
    for (let h = 0; h < 30; h++) {
      hours.push(makeHour(`2026-05-19T${String(h % 24).padStart(2, '0')}:00:00Z`))
    }
    const result = getNext24Hours(makeData(hours))
    expect(result).toHaveLength(24)
  })

  it('returns fewer than 24 when not enough hours remain', () => {
    const hours: HourlyForecast[] = []
    for (let h = 12; h < 24; h++) {
      hours.push(makeHour(`2026-05-19T${String(h).padStart(2, '0')}:00:00Z`))
    }
    const result = getNext24Hours(makeData(hours))
    expect(result.length).toBeLessThan(24)
    expect(result[0].time).toBe('2026-05-19T12:00:00Z')
  })
})
