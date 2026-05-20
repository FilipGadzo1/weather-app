import { computeFeelScore } from '@/lib/weather/feel-score'

interface FeelScoreBadgeProps {
  feelsLikeC: number
  humidity: number
  windSpeed: number
}

export function FeelScoreBadge({ feelsLikeC, humidity, windSpeed }: FeelScoreBadgeProps) {
  if (!Number.isFinite(feelsLikeC) || !Number.isFinite(humidity) || !Number.isFinite(windSpeed)) return null

  const score = computeFeelScore({ feelsLikeC, humidity, windSpeed })

  return (
    <div className="mt-2 inline-flex items-center gap-2">
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${score.bgColor} ${score.color}`}>
        {score.label}
      </span>
      <span className="text-white/60 text-xs">{score.tip}</span>
    </div>
  )
}
