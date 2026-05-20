import type { HourlyForecast } from '@/types/weather'

interface HourlyUvChartProps {
  hours: HourlyForecast[]
}

function uvColor(uv: number): string {
  if (uv < 1)  return 'rgba(255,255,255,0.2)'
  if (uv < 3)  return 'rgba(100,220,100,0.7)'
  if (uv < 6)  return 'rgba(255,220,50,0.75)'
  if (uv < 8)  return 'rgba(255,140,0,0.8)'
  if (uv < 11) return 'rgba(220,50,50,0.85)'
  return            'rgba(180,0,220,0.85)'
}

export function HourlyUvChart({ hours }: HourlyUvChartProps) {
  if (hours.length < 24) return null
  if (hours.every(h => h.uvIndex === 0)) return null

  const maxUv = Math.max(...hours.map(h => h.uvIndex))
  const peakIdx = hours.findIndex(h => h.uvIndex === maxUv)

  const showLabel = (i: number) => [0, 6, 12, 18, 23].includes(i)
  const hourLabel = (i: number) => {
    if (i === 0) return 'Now'
    const h = parseInt(hours[i].time.slice(11, 13), 10)
    return h < 12 ? `${h === 0 ? 12 : h}am` : h === 12 ? '12pm' : `${h - 12}pm`
  }

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider">UV Index</h2>
        <span className="text-white/50 text-xs">Peak: {maxUv.toFixed(1)} UV</span>
      </div>
      <div className="flex gap-px">
        {hours.map((h, i) => {
          const heightPct = (Math.min(h.uvIndex, 11) / 11) * 100
          return (
            <div key={h.time} className="flex flex-col items-center flex-1">
              <div className="h-12 bg-white/10 rounded-sm relative flex items-end overflow-hidden w-full">
                <div
                  className="w-full rounded-sm"
                  style={{ height: `${heightPct}%`, backgroundColor: uvColor(h.uvIndex) }}
                />
              </div>
              <span className="text-white/40 text-xs mt-1" style={{ fontSize: '9px' }}>
                {showLabel(i) ? hourLabel(i) : ''}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
