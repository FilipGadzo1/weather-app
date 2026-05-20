import type { CurrentWeather, DailyForecast, TemperatureUnit } from '@/types/weather'
import { toDisplayTemp } from '@/lib/store/weather-store'
import { getPressureTrend } from '@/lib/weather/pressure-trend'
import { DewPointBadge } from './DewPointBadge'
import { Thermometer, Cloud, Droplets, Eye } from 'lucide-react'

interface ExtendedStatsCardProps {
  weather: CurrentWeather
  unit: TemperatureUnit
  daily?: DailyForecast[]
}

function StatBlock({ icon, label, value, suffix, children }: {
  icon: React.ReactNode; label: string; value: string; suffix?: React.ReactNode; children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 glass-card-stat rounded-xl">
      <span aria-hidden="true">{icon}</span>
      <span className="text-xs text-white/60 uppercase tracking-wider text-center">{label}</span>
      <span className="text-sm font-semibold text-white">
        {value}{suffix}
      </span>
      {children}
    </div>
  )
}

export function ExtendedStatsCard({ weather, unit, daily }: ExtendedStatsCardProps) {
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

  const trend = daily ? getPressureTrend(daily) : null
  const trendSuffix = trend === 'rising'  ? <span className="text-green-300 ml-1">↑</span> :
                      trend === 'falling' ? <span className="text-red-300 ml-1">↓</span> :
                      trend === 'steady'  ? <span className="text-white/40 ml-1">→</span> :
                      null

  return (
    <div className="glass-card p-6">
      <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider mb-4">
        Atmosphere
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatBlock icon={<Thermometer size={16} className="text-white/50" />} label="Pressure" value={pressureValue} suffix={trendSuffix} />
        <StatBlock icon={<Cloud size={16} className="text-white/50" />} label="Cloud Cover" value={cloudValue} />
        <StatBlock icon={<Droplets size={16} className="text-white/50" />} label="Dew Point" value={dewValue}>
          <DewPointBadge dewPointC={dewPoint} />
        </StatBlock>
        <StatBlock icon={<Eye size={16} className="text-white/50" />} label="Visibility" value={visibilityValue} />
      </div>
    </div>
  )
}
