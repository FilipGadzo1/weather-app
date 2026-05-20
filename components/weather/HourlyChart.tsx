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
  const feelsLikeTemps = hours.map(h => toDisplayTemp(h.apparentTemperature, unit))

  const allTemps = [...temps, ...feelsLikeTemps].filter(Number.isFinite)
  const tMin = allTemps.length ? Math.min(...allTemps) : 0
  const tMax = allTemps.length ? Math.max(...allTemps) : 1
  const tRange = Math.max(1, tMax - tMin)

  const xAt = (i: number) =>
    PAD_X + (i * (VIEW_W - 2 * PAD_X)) / (hours.length - 1)
  const yAtTemp = (t: number) =>
    PAD_TOP + LINE_AREA_H - ((t - tMin) / tRange) * LINE_AREA_H

  const points = temps
    .map((t, i) => `${xAt(i).toFixed(1)},${yAtTemp(t).toFixed(1)}`)
    .join(' ')

  const feelsPoints = feelsLikeTemps
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
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider">
          Next 24 Hours
        </h2>
        <div className="flex gap-3">
          <span className="flex items-center gap-1.5 text-xs text-white/50">
            <svg width="16" height="4"><line x1="0" y1="2" x2="16" y2="2" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/></svg>
            Temp
          </span>
          <span className="flex items-center gap-1.5 text-xs text-white/50">
            <svg width="16" height="4"><line x1="0" y1="2" x2="16" y2="2" stroke="rgba(251,146,60,0.7)" strokeWidth="1.5" strokeDasharray="4 3"/></svg>
            Feels like
          </span>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="24-hour temperature, feels-like, and precipitation chart"
      >
        <defs>
          <linearGradient id="tempAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* Area fill under temperature line */}
        <path
          d={[
            `M ${xAt(0).toFixed(1)},${(PAD_TOP + LINE_AREA_H).toFixed(1)}`,
            ...temps.map((t, i) => `L ${xAt(i).toFixed(1)},${yAtTemp(t).toFixed(1)}`),
            `L ${xAt(hours.length - 1).toFixed(1)},${(PAD_TOP + LINE_AREA_H).toFixed(1)}`,
            'Z',
          ].join(' ')}
          fill="url(#tempAreaFill)"
        />

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
          points={feelsPoints}
          fill="none"
          stroke="rgba(251,146,60,0.7)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

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
