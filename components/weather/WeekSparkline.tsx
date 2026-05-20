import type { DailyForecast, TemperatureUnit } from '@/types/weather'
import { toDisplayTemp } from '@/lib/store/weather-store'

interface WeekSparklineProps {
  daily: DailyForecast[]
  unit: TemperatureUnit
}

export function WeekSparkline({ daily, unit }: WeekSparklineProps) {
  if (daily.length < 2) return null

  const padX = 20
  const padY = 10
  const chartW = 260
  const chartH = 60

  const allTemps = [
    ...daily.map(d => toDisplayTemp(d.tempMax, unit)),
    ...daily.map(d => toDisplayTemp(d.tempMin, unit)),
  ]
  if (allTemps.some(t => !Number.isFinite(t))) return null
  let tMin = Math.min(...allTemps)
  let tMax = Math.max(...allTemps)
  if (tMin === tMax) tMax = tMin + 1

  const x = (i: number) => padX + (i / Math.max(daily.length - 1, 1)) * chartW
  const y = (t: number) => padY + chartH - ((t - tMin) / (tMax - tMin)) * chartH

  const highPoints = daily.map((d, i) => `${x(i)},${y(toDisplayTemp(d.tempMax, unit))}`).join(' ')
  const lowPoints = daily.map((d, i) => `${x(i)},${y(toDisplayTemp(d.tempMin, unit))}`).join(' ')

  return (
    <div className="glass-card p-4">
      <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider">
        7-Day Temperature Trend
      </h2>
      <svg viewBox="0 0 300 80" className="w-full mt-3" aria-hidden="true">
        {/* High polyline */}
        <polyline
          points={highPoints}
          stroke="rgba(251,146,60,0.8)"
          strokeWidth="2"
          fill="none"
          strokeLinejoin="round"
        />
        {/* Low polyline */}
        <polyline
          points={lowPoints}
          stroke="rgba(56,189,248,0.8)"
          strokeWidth="2"
          fill="none"
          strokeLinejoin="round"
        />
        {/* High dots */}
        {daily.map((d, i) => (
          <circle
            key={`high-${i}`}
            cx={x(i)}
            cy={y(toDisplayTemp(d.tempMax, unit))}
            r="3"
            fill="rgba(251,146,60,0.9)"
          />
        ))}
        {/* Low dots */}
        {daily.map((d, i) => (
          <circle
            key={`low-${i}`}
            cx={x(i)}
            cy={y(toDisplayTemp(d.tempMin, unit))}
            r="3"
            fill="rgba(56,189,248,0.9)"
          />
        ))}
        {/* Day labels */}
        {daily.map((day, i) => (
          <text
            key={`label-${i}`}
            x={x(i)}
            y={padY + chartH + 14}
            textAnchor="middle"
            fontSize="8"
            fill="rgba(255,255,255,0.5)"
          >
            {new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'short',
              timeZone: 'UTC',
            })}
          </text>
        ))}
        {/* Min label */}
        <text
          x={padX - 4}
          y={y(tMin) + 3}
          textAnchor="end"
          fontSize="7"
          fill="rgba(255,255,255,0.4)"
        >
          {Math.round(tMin)}°
        </text>
        {/* Max label */}
        <text
          x={padX - 4}
          y={y(tMax) + 3}
          textAnchor="end"
          fontSize="7"
          fill="rgba(255,255,255,0.4)"
        >
          {Math.round(tMax)}°
        </text>
      </svg>
    </div>
  )
}
