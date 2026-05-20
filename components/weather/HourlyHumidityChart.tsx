import type { HourlyForecast } from '@/types/weather'

interface HourlyHumidityChartProps {
  hours: HourlyForecast[]
}

function humidityColor(pct: number): string {
  if (pct < 30) return 'rgba(251,191,36,0.7)'   // amber, dry
  if (pct < 60) return 'rgba(56,189,248,0.6)'    // sky, comfortable
  if (pct < 80) return 'rgba(99,102,241,0.7)'    // indigo, humid
  return 'rgba(139,92,246,0.8)'                   // violet, very humid
}

const LABEL_INDICES = new Set([0, 6, 12, 18, 23])

export function HourlyHumidityChart({ hours }: HourlyHumidityChartProps) {
  if (hours.length < 24) return null

  return (
    <div className="glass-card p-4">
      <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider">
        Humidity
      </h2>
      <div className="flex gap-px mt-3" aria-hidden="true">
        {hours.slice(0, 24).map((h, i) => {
          const pct = Math.max(0, Math.min(100, Number.isFinite(h.humidity) ? h.humidity : 0))
          return (
            <div key={h.time} className="flex flex-col items-center flex-1">
              <div className="h-12 w-full bg-white/10 rounded-sm flex items-end overflow-hidden">
                <div
                  className="w-full rounded-sm"
                  style={{ height: `${pct}%`, backgroundColor: humidityColor(pct) }}
                />
              </div>
              <span className="text-white/40 text-xs mt-0.5" style={{ fontSize: '9px' }}>
                {LABEL_INDICES.has(i) ? (i === 0 ? 'Now' : `+${i}h`) : ''}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
