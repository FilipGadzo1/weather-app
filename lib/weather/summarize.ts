import type { CurrentWeather, DailyForecast, TemperatureUnit } from '@/types/weather'
import { getWmoInfo } from '@/lib/weather/wmo-codes'
import { toDisplayTemp } from '@/lib/store/weather-store'

export function buildWeatherSummary(
  weather: CurrentWeather,
  daily: DailyForecast[],
  unit: TemperatureUnit
): string {
  const info = getWmoInfo(weather.wmoCode)
  const temp = toDisplayTemp(weather.temperature, unit)
  const high = daily[0] ? toDisplayTemp(daily[0].tempMax, unit) : null
  const low  = daily[0] ? toDisplayTemp(daily[0].tempMin, unit) : null
  const u = unit

  const condSentence = `${info.label} conditions with a current temperature of ${temp}°${u}.`

  const rangeSentence = high !== null && low !== null
    ? `Today's range: ${low}–${high}°${u}.`
    : ''

  const windDesc =
    weather.windSpeed < 5  ? 'calm' :
    weather.windSpeed < 15 ? 'light' :
    weather.windSpeed < 30 ? 'moderate' :
    weather.windSpeed < 50 ? 'strong' : 'very strong'
  const windSentence = `Wind is ${windDesc} at ${Math.round(weather.windSpeed)} km/h.`

  const precipSentence =
    weather.precipitationProbability === 0 ? 'No rain expected.' :
    weather.precipitationProbability < 30  ? `Low chance of rain (${weather.precipitationProbability}%).` :
    weather.precipitationProbability < 60  ? `Moderate chance of rain (${weather.precipitationProbability}%).` :
    `High chance of rain (${weather.precipitationProbability}%).`

  return [condSentence, rangeSentence, windSentence, precipSentence]
    .filter(Boolean)
    .join(' ')
}
