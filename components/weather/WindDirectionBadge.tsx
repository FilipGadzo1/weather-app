import { degreesToCompass } from '@/lib/weather/wind-direction'

interface WindDirectionBadgeProps {
  degrees: number
}

export function WindDirectionBadge({ degrees }: WindDirectionBadgeProps) {
  const safeDeg = Number.isFinite(degrees) ? degrees : 0
  const compass = degreesToCompass(safeDeg)
  return (
    <span className="text-white/40 text-xs flex items-center gap-0.5">
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        role="img"
        aria-label={`Wind from ${compass}`}
        style={{ transform: `rotate(${safeDeg}deg)`, display: 'inline-block' }}
      >
        <polygon points="5,0 8,9 5,7 2,9" fill="rgba(255,255,255,0.5)" />
      </svg>
      {compass}
    </span>
  )
}
