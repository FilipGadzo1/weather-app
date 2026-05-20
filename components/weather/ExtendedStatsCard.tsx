import type { CurrentWeather, TemperatureUnit } from '@/types/weather'
import { toDisplayTemp } from '@/lib/store/weather-store'

interface ExtendedStatsCardProps {
  weather: CurrentWeather
  unit: TemperatureUnit
}

function StatBlock({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 glass-card-dark rounded-xl">
      <span className="text-xl" aria-hidden="true">{emoji}</span>
      <span className="text-xs text-white/60 uppercase tracking-wider text-center">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  )
}

export function ExtendedStatsCard({ weather, unit }: ExtendedStatsCardProps) {
  const { pressure, cloudCover, dewPoint, visibility } = weather
  if (pressure === null && cloudCover === null && dewPoint === null && !Number.isFinite(visibility)) {
    return null
  }

  const pressureValue = pressure !== null ? `${Math.round(pressure)} hPa` : '—'
  const cloudValue = cloudCover !== null ? `${Math.round(cloudCover)}%` : '—'
  const dewValue = dewPoint !== null ? `${toDisplayTemp(dewPoint, unit)}°${unit}` : '—'
  const visibilityValue = Number.isFinite(visibility) && visibility >= 0
    ? (visibility > 999 ? '999+ km' : `${Math.round(visibility)} km`)
    : '—'

  return (
    <div className="glass-card p-6">
      <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider mb-4">
        Atmosphere
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatBlock emoji="🌡️" label="Pressure" value={pressureValue} />
        <StatBlock emoji="☁️" label="Cloud Cover" value={cloudValue} />
        <StatBlock emoji="💧" label="Dew Point" value={dewValue} />
        <StatBlock emoji="👁️" label="Visibility" value={visibilityValue} />
      </div>
    </div>
  )
}
