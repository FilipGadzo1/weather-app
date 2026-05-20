import type { CurrentWeather, DailyForecast, TemperatureUnit } from '@/types/weather'
import { buildWeatherSummary } from '@/lib/weather/summarize'

interface WeatherSummaryCardProps {
  weather: CurrentWeather
  daily: DailyForecast[]
  unit: TemperatureUnit
}

export function WeatherSummaryCard({ weather, daily, unit }: WeatherSummaryCardProps) {
  const summary = buildWeatherSummary(weather, daily, unit)
  return (
    <div className="glass-card p-4">
      <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider">
        At a Glance
      </h2>
      <p className="text-white/80 text-sm leading-relaxed mt-2">{summary}</p>
    </div>
  )
}
