import type { DailyForecast, TemperatureUnit } from '@/types/weather'
import { getWmoInfo } from '@/lib/weather/wmo-codes'
import { toDisplayTemp } from '@/lib/store/weather-store'
import { WeatherIcon } from './WeatherIcon'

interface TomorrowCardProps {
  daily: DailyForecast[]
  unit: TemperatureUnit
  timezone: string
}

export function TomorrowCard({ daily, unit, timezone }: TomorrowCardProps) {
  if (!daily[1]) return null

  const tomorrow = daily[1]
  const info = getWmoInfo(tomorrow.wmoCode)

  // Parse date parts directly from ISO string to avoid timezone issues
  const [year, month, day] = tomorrow.date.split('-').map(Number)
  const utcDate = new Date(Date.UTC(year, month - 1, day))
  const dateLabel = utcDate.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC',
  })

  let sunriseLabel = '—'
  if (tomorrow.sunrise) {
    try {
      sunriseLabel = new Date(tomorrow.sunrise).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: timezone,
      })
    } catch {
      sunriseLabel = '—'
    }
  }

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider">Tomorrow</h2>
        <span className="text-white/50 text-xs">{dateLabel}</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <WeatherIcon iconKey={info.iconKey} size={48} />
          <span className="text-white/70 text-xs text-center">{info.label}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex-1">
          <div>
            <p className="text-white/50 text-xs uppercase">High</p>
            <p className="text-orange-300 text-lg font-semibold">{toDisplayTemp(tomorrow.tempMax, unit)}°{unit}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs uppercase">Low</p>
            <p className="text-sky-300 text-lg font-semibold">{toDisplayTemp(tomorrow.tempMin, unit)}°{unit}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs uppercase">Rain</p>
            <p className="text-blue-300 text-lg font-semibold">{tomorrow.precipitationProbability}%</p>
          </div>
          <div>
            <p className="text-white/50 text-xs uppercase">Sunrise</p>
            <p className="text-white/80 text-lg font-semibold">{sunriseLabel}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
