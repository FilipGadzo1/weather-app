import type { DailyForecast } from '@/types/weather'

interface PrecipitationBarChartProps {
  daily: DailyForecast[]
  timezone: string
}

function bandClass(p: number): string {
  if (p <= 20) return 'bg-sky-400/30'
  if (p <= 50) return 'bg-sky-400/50'
  if (p <= 80) return 'bg-sky-400/70'
  return 'bg-sky-500/90'
}

export function PrecipitationBarChart({ daily, timezone }: PrecipitationBarChartProps) {
  const days = daily.slice(0, 7)
  if (days.length === 0) return null

  return (
    <div className="glass-card p-4">
      <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider mb-4">
        Precipitation Outlook
      </h2>
      <div className="space-y-2">
        {days.map((day, i) => {
          const prob = day.precipitationProbability ?? 0
          const label = i === 0
            ? 'Today'
            : new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', {
                weekday: 'short',
                timeZone: timezone,
              })
          return (
            <div key={day.date} className="grid items-center gap-2" style={{ gridTemplateColumns: '40px 1fr 36px' }}>
              <span className="text-white/70 text-xs">{label}</span>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${bandClass(prob)}`}
                  style={{ width: `${prob}%` }}
                />
              </div>
              <span className="text-white/80 text-xs tabular-nums text-right">{prob}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
