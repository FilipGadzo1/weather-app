import type { CurrentWeather, DailyForecast } from '@/types/weather'
import { buildWeatherSummary } from '../summarize'

jest.mock('@/lib/weather/wmo-codes', () => ({
  getWmoInfo: () => ({ label: 'Clear', description: '', iconKey: 'clear-day', isSevere: false }),
}))

jest.mock('@/lib/store/weather-store', () => ({
  toDisplayTemp: (t: number, u: string) => u === 'F' ? Math.round(t * 9 / 5 + 32) : Math.round(t),
}))

const baseWeather: CurrentWeather = {
  temperature: 18, feelsLike: 16, humidity: 60,
  windSpeed: 10, windDirection: 180, uvIndex: 4,
  visibility: 15, wmoCode: 0, isDay: true,
  precipitationProbability: 0,
  pressure: 1013, cloudCover: 30, dewPoint: 10,
}

const daily: DailyForecast[] = [{
  date: '2026-05-20', tempMax: 22, tempMin: 12, wmoCode: 0,
  precipitationProbability: 0, precipitationSum: null, sunrise: '', sunset: '', hourly: [],
}]

describe('buildWeatherSummary wind description', () => {
  it('windSpeed=2 → includes "calm"', () => {
    const result = buildWeatherSummary({ ...baseWeather, windSpeed: 2 }, daily, 'C')
    expect(result).toContain('calm')
  })

  it('windSpeed=35 → includes "strong" but not "very strong"', () => {
    const result = buildWeatherSummary({ ...baseWeather, windSpeed: 35 }, daily, 'C')
    expect(result).toMatch(/Wind is strong at/)
    expect(result).not.toMatch(/very strong/)
  })

  it('windSpeed=50 → includes "very strong"', () => {
    const result = buildWeatherSummary({ ...baseWeather, windSpeed: 50 }, daily, 'C')
    expect(result).toContain('very strong')
  })
})

describe('buildWeatherSummary precipitation', () => {
  it('precipitationProbability=0 → includes "No rain"', () => {
    const result = buildWeatherSummary({ ...baseWeather, precipitationProbability: 0 }, daily, 'C')
    expect(result).toContain('No rain')
  })

  it('precipitationProbability=29 → includes "Low chance of rain"', () => {
    const result = buildWeatherSummary({ ...baseWeather, precipitationProbability: 29 }, daily, 'C')
    expect(result).toContain('Low chance of rain')
  })

  it('precipitationProbability=30 → includes "Moderate chance of rain"', () => {
    const result = buildWeatherSummary({ ...baseWeather, precipitationProbability: 30 }, daily, 'C')
    expect(result).toContain('Moderate chance of rain')
  })

  it('precipitationProbability=60 → includes "High chance of rain"', () => {
    const result = buildWeatherSummary({ ...baseWeather, precipitationProbability: 60 }, daily, 'C')
    expect(result).toContain('High chance of rain')
  })
})

describe('buildWeatherSummary daily range', () => {
  it('daily=[] → output does NOT include "Today\'s range"', () => {
    const result = buildWeatherSummary(baseWeather, [], 'C')
    expect(result).not.toContain("Today's range")
  })

  it('daily provided → output includes "Today\'s range" and "12–22°C"', () => {
    const result = buildWeatherSummary(baseWeather, daily, 'C')
    expect(result).toContain("Today's range")
    expect(result).toContain('12–22°C')
  })
})

describe('buildWeatherSummary unit', () => {
  it('unit="F" → output includes °F in temperature display', () => {
    const result = buildWeatherSummary(baseWeather, daily, 'F')
    expect(result).toContain('°F')
  })
})

describe('wind thresholds', () => {
  it('windSpeed=4 → calm', () => {
    const result = buildWeatherSummary({ ...baseWeather, windSpeed: 4 }, daily, 'C')
    expect(result).toMatch(/Wind is calm/)
  })

  it('windSpeed=5 → light (first light value)', () => {
    const result = buildWeatherSummary({ ...baseWeather, windSpeed: 5 }, daily, 'C')
    expect(result).toMatch(/Wind is light/)
  })

  it('windSpeed=14 → light (last light value)', () => {
    const result = buildWeatherSummary({ ...baseWeather, windSpeed: 14 }, daily, 'C')
    expect(result).toMatch(/Wind is light/)
  })

  it('windSpeed=15 → moderate', () => {
    const result = buildWeatherSummary({ ...baseWeather, windSpeed: 15 }, daily, 'C')
    expect(result).toMatch(/Wind is moderate/)
  })

  it('windSpeed=29 → moderate', () => {
    const result = buildWeatherSummary({ ...baseWeather, windSpeed: 29 }, daily, 'C')
    expect(result).toMatch(/Wind is moderate/)
  })

  it('windSpeed=30 → strong', () => {
    const result = buildWeatherSummary({ ...baseWeather, windSpeed: 30 }, daily, 'C')
    expect(result).toMatch(/Wind is strong at/)
    expect(result).not.toMatch(/very strong/)
  })

  it('windSpeed=49 → strong', () => {
    const result = buildWeatherSummary({ ...baseWeather, windSpeed: 49 }, daily, 'C')
    expect(result).toMatch(/Wind is strong at/)
    expect(result).not.toMatch(/very strong/)
  })

  it('windSpeed=50 → very strong', () => {
    const result = buildWeatherSummary({ ...baseWeather, windSpeed: 50 }, daily, 'C')
    expect(result).toMatch(/Wind is very strong/)
  })
})
