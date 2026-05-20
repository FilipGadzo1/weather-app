import type { HourlyForecast } from '@/types/weather'

interface HourlyPrecipChartProps {
  hours: HourlyForecast[]
}

export function HourlyPrecipChart({ hours }: HourlyPrecipChartProps) {
  if (hours.length < 24) return null
  const amounts = hours.map(h => Number.isFinite(h.precipitationAmount) ? h.precipitationAmount : 0)
  const maxPrecip = Math.max(...amounts)
  if (maxPrecip === 0) return null

  const totalMm = amounts.reduce((sum, v) => sum + v, 0)
  const showLabel = (i: number) => [0, 6, 12, 18, 23].includes(i)
  const hourLabel = (i: number) => {
    if (i === 0) return 'Now'
    const h = parseInt(hours[i].time.slice(11, 13), 10)
    return h < 12 ? `${h === 0 ? 12 : h}am` : h === 12 ? '12pm' : `${h - 12}pm`
  }

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider">Precipitation</h2>
        <span className="text-white/40 text-xs">{totalMm.toFixed(1)}mm total · Peak {maxPrecip.toFixed(1)}mm/h</span>
      </div>
      <div className="flex gap-px">
        {hours.map((h, i) => {
          const heightPct = (amounts[i] / maxPrecip) * 100
          return (
            <div key={h.time} className="flex flex-col items-center flex-1">
              <div className="h-12 bg-white/10 rounded-sm relative flex items-end overflow-hidden w-full">
                <div
                  className="w-full rounded-t-sm"
                  style={{ height: `${heightPct}%`, backgroundColor: 'rgba(56,189,248,0.7)' }}
                />
              </div>
              <span className="text-white/40 mt-1" style={{ fontSize: '9px' }}>
                {showLabel(i) ? hourLabel(i) : ''}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
