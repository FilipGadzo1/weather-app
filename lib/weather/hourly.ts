import type { WeatherData, HourlyForecast } from '@/types/weather'

export function getNext24Hours(data: WeatherData): HourlyForecast[] {
  const flat = data.daily.flatMap((d) => d.hourly)
  const now = Date.now()
  const startIdx = flat.findIndex((h) => new Date(h.time).getTime() >= now)
  const i = startIdx === -1 ? 0 : startIdx
  return flat.slice(i, i + 24)
}
