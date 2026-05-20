import { findBestWindow } from '@/lib/weather/best-time'
import type { HourlyForecast } from '@/types/weather'

interface BestTimeCardProps {
  hours: HourlyForecast[]
}

function badgeClass(score: number): string {
  if (score >= 80) return 'bg-green-500/20 text-green-300'
  if (score >= 60) return 'bg-yellow-500/20 text-yellow-300'
  return 'bg-orange-500/20 text-orange-300'
}

export function BestTimeCard({ hours }: BestTimeCardProps) {
  const window = findBestWindow(hours)
  if (!window) return null
  return (
    <div className="glass-card p-4">
      <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider mb-3">
        Best Time Outside
      </h2>
      <div className="flex items-center gap-4">
        <span className="text-3xl" aria-hidden="true">🌤️</span>
        <div>
          <p className="text-white text-lg font-semibold">{window.label}</p>
          <p className="text-white/60 text-sm mt-0.5">{window.reason}</p>
          <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs ${badgeClass(window.score)}`}>
            {window.score}/100
          </span>
        </div>
      </div>
    </div>
  )
}
