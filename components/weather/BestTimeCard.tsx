import { findBestWindow } from '@/lib/weather/best-time'
import type { HourlyForecast } from '@/types/weather'
import { Sun } from 'lucide-react'

interface BestTimeCardProps {
  hours: HourlyForecast[]
}

function dotClass(score: number): string {
  if (score >= 80) return 'bg-green-400'
  if (score >= 60) return 'bg-yellow-400'
  return 'bg-orange-400'
}

export function BestTimeCard({ hours }: BestTimeCardProps) {
  const window = findBestWindow(hours)
  if (!window) return null
  return (
    <div className="glass-card p-4">
      <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider mb-3">
        Best Time Outside
      </h2>
      <div className="flex items-start gap-4">
        <div className="flex items-center gap-3">
          <Sun size={24} className="text-yellow-300/80 shrink-0" aria-hidden="true" />
          <span className={`glass-card-stat inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs text-white/80`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotClass(window.score)}`} />
            {window.score}/100
          </span>
        </div>
        <div>
          <p className="text-white text-lg font-semibold">{window.label}</p>
          <p className="text-white/60 text-sm mt-0.5">{window.reason}</p>
        </div>
      </div>
    </div>
  )
}
