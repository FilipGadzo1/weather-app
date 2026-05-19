import { buildForecastUrl, parseWeatherResponse } from '../open-meteo'

describe('buildForecastUrl', () => {
  it('builds correct URL with lat/lon', () => {
    const url = buildForecastUrl(51.5074, -0.1278)
    expect(url).toContain('latitude=51.5074')
    expect(url).toContain('longitude=-0.1278')
    expect(url).toContain('current=')
    expect(url).toContain('daily=')
    expect(url).toContain('hourly=')
  })
})

describe('parseWeatherResponse', () => {
  const mockLocation = { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 }

  it('parses current weather correctly', () => {
    const mockApiResponse = {
      timezone: 'Europe/London',
      current: {
        temperature_2m: 18,
        apparent_temperature: 16,
        relative_humidity_2m: 70,
        wind_speed_10m: 15,
        wind_direction_10m: 270,
        uv_index: 3,
        visibility: 10000,
        weather_code: 2,
        is_day: 1,
        precipitation_probability: 10,
      },
      daily: {
        time: ['2026-05-19'],
        temperature_2m_max: [20],
        temperature_2m_min: [12],
        weather_code: [2],
        precipitation_probability_max: [10],
        sunrise: ['2026-05-19T05:30'],
        sunset: ['2026-05-19T21:00'],
      },
      hourly: {
        time: ['2026-05-19T00:00'],
        temperature_2m: [15],
        weather_code: [2],
        precipitation_probability: [5],
        wind_speed_10m: [10],
      },
    }

    const result = parseWeatherResponse(mockApiResponse, mockLocation)
    expect(result.current.temperature).toBe(18)
    expect(result.current.wmoCode).toBe(2)
    expect(result.current.isDay).toBe(true)
    expect(result.daily).toHaveLength(1)
    expect(result.daily[0].tempMax).toBe(20)
    expect(result.hasSevereCondition).toBe(false)
  })

  it('detects severe condition for thunderstorm', () => {
    const mockApiResponse = {
      timezone: 'Europe/London',
      current: {
        temperature_2m: 22,
        apparent_temperature: 20,
        relative_humidity_2m: 85,
        wind_speed_10m: 40,
        wind_direction_10m: 180,
        uv_index: 1,
        visibility: 3000,
        weather_code: 95,
        is_day: 1,
        precipitation_probability: 90,
      },
      daily: {
        time: ['2026-05-19'],
        temperature_2m_max: [23],
        temperature_2m_min: [18],
        weather_code: [95],
        precipitation_probability_max: [90],
        sunrise: ['2026-05-19T05:30'],
        sunset: ['2026-05-19T21:00'],
      },
      hourly: { time: [], temperature_2m: [], weather_code: [], precipitation_probability: [], wind_speed_10m: [] },
    }
    const result = parseWeatherResponse(mockApiResponse, mockLocation)
    expect(result.hasSevereCondition).toBe(true)
  })
})
