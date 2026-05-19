import type { HourlyForecast, TemperatureUnit } from '@/types/weather'
import { toDisplayTemp } from '@/lib/store/weather-store'

interface HourlyChartProps {
  hours: HourlyForecast[]
  unit: TemperatureUnit
}

const VIEW_W = 480
const VIEW_H = 160
const PAD_X = 12
const PAD_TOP = 20
const BAR_AREA_H = 40
const LINE_AREA_H = VIEW_H - PAD_TOP - BAR_AREA_H

export function HourlyChart({ hours, unit }: HourlyChartProps) {
  if (hours.length < 24) {
    return <div className="glass-card p-4 h-40 animate-pulse" />
  }

  const temps = hours.map((h) => toDisplayTemp(h.temperature, unit))
  const tMin = Math.min(...temps)
  const tMax = Math.max(...temps)
  const tRange = Math.max(1, tMax - tMin)

  const xAt = (i: number) =>
    PAD_X + (i * (VIEW_W - 2 * PAD_X)) / (hours.length - 1)
  const yAtTemp = (t: number) =>
    PAD_TOP + LINE_AREA_H - ((t - tMin) / tRange) * LINE_AREA_H

  const points = temps
    .map((t, i) => `${xAt(i).toFixed(1)},${yAtTemp(t).toFixed(1)}`)
    .join(' ')

  const barWidth = (VIEW_W - 2 * PAD_X) / hours.length - 2
  const barTop = PAD_TOP + LINE_AREA_H
  const barMaxH = BAR_AREA_H - 4

  const labels: { i: number; text: string }[] = [
    { i: 0, text: 'Now' },
    { i: 6, text: '+6h' },
    { i: 12, text: '+12h' },
    { i: 18, text: '+18h' },
    { i: 23, text: '+24h' },
  ]

  return (
    <div className="glass-card p-4">
      <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider mb-4">
        Next 24 Hours
      </h2>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="24-hour temperature and precipitation chart"
      >
        {hours.map((h, i) => {
          if (h.precipitationProbability <= 0) return null
          const barH = (h.precipitationProbability / 100) * barMaxH
          const x = xAt(i) - barWidth / 2
          const y = barTop + (barMaxH - barH)
          return (
            <rect
              key={`p-${i}`}
              x={x.toFixed(1)}
              y={y.toFixed(1)}
              width={Math.max(1, barWidth).toFixed(1)}
              height={barH.toFixed(1)}
              fill="rgba(56,189,248,0.6)"
              rx="1"
            />
          )
        })}

        <polyline
          points={points}
          fill="none"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <text
          x={VIEW_W - 4}
          y={yAtTemp(tMax) + 3}
          textAnchor="end"
          fill="rgba(255,255,255,0.5)"
          fontSize="10"
        >
          {tMax}°{unit}
        </text>
        <text
          x={VIEW_W - 4}
          y={yAtTemp(tMin) + 3}
          textAnchor="end"
          fill="rgba(255,255,255,0.5)"
          fontSize="10"
        >
          {tMin}°{unit}
        </text>

        {labels.map(({ i, text }) => (
          <text
            key={text}
            x={xAt(i)}
            y={VIEW_H - 4}
            textAnchor={i === 0 ? 'start' : i === 23 ? 'end' : 'middle'}
            fill="rgba(255,255,255,0.5)"
            fontSize="10"
          >
            {text}
          </text>
        ))}
      </svg>
    </div>
  )
}
