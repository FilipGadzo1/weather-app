import { getComfortBanner } from '../comfort-banner'
import type { CurrentWeather } from '@/types/weather'

function makeWeather(overrides: Partial<CurrentWeather>): CurrentWeather {
  return {
    temperature: 15, feelsLike: 15, humidity: 50,
    windSpeed: 5, windDirection: 0, uvIndex: 2,
    visibility: 10, wmoCode: 0, isDay: true,
    precipitationProbability: 0, pressure: 1013,
    cloudCover: null, dewPoint: null,
    ...overrides,
  }
}

describe('getComfortBanner', () => {
  it('returns wind chill banner when diff <= -5 and windSpeed >= 15', () => {
    const result = getComfortBanner(makeWeather({ feelsLike: 5, temperature: 12, windSpeed: 20 }))
    expect(result?.message).toContain('colder')
  })

  it('returns null when diff is -4 (threshold is -5)', () => {
    const result = getComfortBanner(makeWeather({ feelsLike: 8, temperature: 12, windSpeed: 20 }))
    expect(result).toBeNull()
  })

  it('returns null when wind < 15 even if diff <= -5', () => {
    const result = getComfortBanner(makeWeather({ feelsLike: 5, temperature: 12, windSpeed: 14 }))
    expect(result).toBeNull()
  })

  it('returns humidity warmth banner when diff >= 4 and humidity >= 60', () => {
    const result = getComfortBanner(makeWeather({ feelsLike: 26, temperature: 22, humidity: 65 }))
    expect(result?.message).toContain('warmer')
  })

  it('returns null when diff < 4 (humidity warmth threshold)', () => {
    const result = getComfortBanner(makeWeather({ feelsLike: 25, temperature: 22, humidity: 65 }))
    expect(result).toBeNull()
  })

  it('returns oppressive heat banner when temp >= 30 and humidity >= 70', () => {
    const result = getComfortBanner(makeWeather({ temperature: 32, humidity: 75, feelsLike: 32 }))
    expect(result?.message).toContain('hydrated')
  })

  it('returns dangerous cold banner when feelsLike <= -10', () => {
    const result = getComfortBanner(makeWeather({ feelsLike: -12, temperature: -8 }))
    expect(result?.message).toContain('cold')
  })

  it('returns null for comfortable conditions', () => {
    const result = getComfortBanner(makeWeather({ temperature: 20, feelsLike: 18, windSpeed: 5, humidity: 45 }))
    expect(result).toBeNull()
  })

  it('dangerous cold takes priority over wind-chill when both conditions met', () => {
    // feelsLike=-12 (≤-10) AND diff=-4 with windSpeed=20 — dangerous cold wins
    const result = getComfortBanner(makeWeather({ feelsLike: -12, temperature: -8, windSpeed: 20 }))
    expect(result?.message).toContain('Dangerous')
  })
})
