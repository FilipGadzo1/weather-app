import type { HourlyForecast } from '@/types/weather'
import { getWmoInfo } from '@/lib/weather/wmo-codes'
import { WeatherIcon } from './WeatherIcon'

interface HourlyConditionStripProps {
  hours: HourlyForecast[]
  timezone: string
}

export function HourlyConditionStrip({ hours, timezone }: HourlyConditionStripProps) {
  if (hours.length === 0) return null

  const slice = hours.slice(0, 12)

  function formatHourLabel(iso: string, index: number): string {
    if (index === 0) return 'Now'
    try {
      return new Date(iso).toLocaleTimeString('en-US', {
        hour: 'numeric', hour12: true, timeZone: timezone,
      })
    } catch {
      return iso.slice(11, 13) + ':00'
    }
  }

  return (
    <div className="glass-card p-4" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider mb-3">
        Conditions
      </h2>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 min-w-max pb-1">
          {slice.map((h, i) => {
            const info = getWmoInfo(h.wmoCode)
            const label = formatHourLabel(h.time, i)
            const condWord = info.label.split(' ')[0]
            return (
              <div key={h.time} className="flex flex-col items-center gap-1.5 w-14">
                <span className="text-white/50 text-xs" style={{ fontFamily: 'var(--font-outfit)' }}>{label}</span>
                <WeatherIcon iconKey={info.iconKey} size={28} isDay={h.isDay ?? true} />
                <span className="text-white/60 text-xs text-center">{condWord}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
