import type { GeoLocation, WeatherData, DailyForecast, HourlyForecast } from '@/types/weather'
import { isSevereWmo } from './wmo-codes'

const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

const CURRENT_PARAMS = [
  'temperature_2m', 'apparent_temperature', 'relative_humidity_2m',
  'wind_speed_10m', 'wind_direction_10m', 'uv_index', 'visibility',
  'weather_code', 'is_day', 'precipitation_probability',
  'surface_pressure', 'cloud_cover', 'dew_point_2m',
].join(',')

const DAILY_PARAMS = [
  'temperature_2m_max', 'temperature_2m_min', 'weather_code',
  'precipitation_probability_max', 'sunrise', 'sunset',
].join(',')

const HOURLY_PARAMS = [
  'temperature_2m', 'weather_code', 'precipitation_probability', 'wind_speed_10m',
].join(',')

export function buildForecastUrl(lat: number, lon: number): string {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: CURRENT_PARAMS,
    daily: DAILY_PARAMS,
    hourly: HOURLY_PARAMS,
    forecast_days: '7',
    timezone: 'auto',
    wind_speed_unit: 'kmh',
  })
  return `${BASE_URL}?${params}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseWeatherResponse(data: any, location: GeoLocation): WeatherData {
  const c = data.current

  const hourlyByDay: Record<string, HourlyForecast[]> = {}
  data.hourly.time.forEach((time: string, i: number) => {
    const day = time.split('T')[0]
    if (!hourlyByDay[day]) hourlyByDay[day] = []
    hourlyByDay[day].push({
      time,
      temperature: data.hourly.temperature_2m[i],
      wmoCode: data.hourly.weather_code[i],
      precipitationProbability: data.hourly.precipitation_probability[i],
      windSpeed: data.hourly.wind_speed_10m[i],
    })
  })

  const daily: DailyForecast[] = data.daily.time.map((date: string, i: number) => ({
    date,
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i],
    wmoCode: data.daily.weather_code[i],
    precipitationProbability: data.daily.precipitation_probability_max[i],
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i],
    hourly: hourlyByDay[date] ?? [],
  }))

  return {
    location,
    current: {
      temperature: c.temperature_2m,
      feelsLike: c.apparent_temperature,
      humidity: c.relative_humidity_2m,
      windSpeed: c.wind_speed_10m,
      windDirection: c.wind_direction_10m,
      uvIndex: c.uv_index,
      visibility: Math.round(c.visibility / 1000),
      wmoCode: c.weather_code,
      isDay: c.is_day === 1,
      precipitationProbability: c.precipitation_probability,
      pressure: c.surface_pressure ?? null,
      cloudCover: c.cloud_cover ?? null,
      dewPoint: c.dew_point_2m ?? null,
    },
    daily,
    timezone: data.timezone,
    hasSevereCondition: isSevereWmo(c.weather_code),
  }
}

export async function fetchWeather(lat: number, lon: number, location: GeoLocation): Promise<WeatherData> {
  const url = buildForecastUrl(lat, lon)
  const res = await fetch(url, { next: { revalidate: 1800 } })  // 30-min cache
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`)
  const data = await res.json()
  return parseWeatherResponse(data, location)
}
