import { getDewPointComfort } from '@/lib/weather/dew-point'

interface DewPointBadgeProps {
  dewPointC: number | null
}

export function DewPointBadge({ dewPointC }: DewPointBadgeProps) {
  if (dewPointC === null || !Number.isFinite(dewPointC)) return null
  const comfort = getDewPointComfort(dewPointC)
  return (
    <span className={`mt-1 inline-block px-1.5 py-0.5 rounded text-xs ${comfort.bgColor} ${comfort.color}`}>
      {comfort.label}
    </span>
  )
}
