import type { HourlyForecast } from '@/types/weather'

interface HourlyWindStripProps {
  hours: HourlyForecast[]
}

export function HourlyWindStrip({ hours }: HourlyWindStripProps) {
  if (hours.length < 12) return null

  const slice = hours.slice(0, 12)
  const validSpeeds = slice.map(h => h.windSpeed).filter(Number.isFinite)
  const maxWind = Math.max(...validSpeeds, 1)

  return (
    <div className="glass-card p-4" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider mb-3">
        Wind Forecast
      </h2>
      <div className="grid grid-cols-12 gap-1 mt-3">
        {slice.map((h, i) => {
          const speed = Number.isFinite(h.windSpeed) ? h.windSpeed : 0
          const pct = Math.max(4, (speed / maxWind) * 100)
          const label = i === 0 ? 'Now' : `+${i}h`
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-full h-16 bg-white/10 rounded-full relative flex items-end overflow-hidden">
                <div
                  className="w-full rounded-full bg-gradient-to-t from-sky-400/70 to-sky-300/40"
                  style={{ height: `${pct}%` }}
                />
              </div>
              <span className="text-white/60 text-xs tabular-nums">{Math.round(Number.isFinite(h.windSpeed) ? h.windSpeed : 0)}</span>
              <span className="text-white/40 text-xs">{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
