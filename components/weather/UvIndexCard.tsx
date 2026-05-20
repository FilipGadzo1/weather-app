import { getUvBand } from '@/lib/weather/uv-scale'

interface UvIndexCardProps {
  uvIndex: number | null | undefined
}

export function UvIndexCard({ uvIndex }: UvIndexCardProps) {
  if (uvIndex == null || uvIndex < 0) return null

  const rounded = Math.round(uvIndex)
  const band = getUvBand(rounded)

  return (
    <div className="glass-card p-4">
      <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider mb-4">
        UV Index
      </h2>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <span className={`text-5xl font-bold tabular-nums ${band.textClass}`}>
            {rounded}
          </span>
          <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs ${band.bgClass} ${band.textClass}`}>
            {band.label}
          </span>
        </div>
        <p className="text-white/80 text-sm leading-relaxed flex-1">
          {band.tip}
        </p>
      </div>
    </div>
  )
}
