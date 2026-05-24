'use client'

import { useState, useEffect } from 'react'
import type { DailyForecast } from '@/types/weather'

interface SunriseSunsetCardProps {
  daily: DailyForecast[]
  timezone: string
}

function getSunFraction(sunriseISO: string, sunsetISO: string): number | null {
  if (!sunriseISO || !sunsetISO) return null
  const now = Date.now()
  const rise = new Date(sunriseISO).getTime()
  const set  = new Date(sunsetISO).getTime()
  if (!Number.isFinite(rise) || !Number.isFinite(set) || set <= rise) return null
  if (now <= rise) return 0
  if (now >= set)  return 1
  return (now - rise) / (set - rise)
}

function formatTime(iso: string, timezone: string): string {
  if (!iso) return '--:--'
  try {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: timezone,
    })
  } catch {
    return iso.slice(11, 16) || '--:--'
  }
}

function dayLength(sunriseISO: string, sunsetISO: string): string {
  const rise = new Date(sunriseISO).getTime()
  const set  = new Date(sunsetISO).getTime()
  if (!Number.isFinite(rise) || !Number.isFinite(set) || set <= rise) return '—'
  const diffMin = Math.round((set - rise) / 60000)
  return `${Math.floor(diffMin / 60)}h ${diffMin % 60}m`
}

export function SunriseSunsetCard({ daily, timezone }: SunriseSunsetCardProps) {
  const [t, setT] = useState<number | null>(null)

  useEffect(() => {
    if (daily.length === 0 || !daily[0]) return
    const { sunrise, sunset } = daily[0]
    setT(getSunFraction(sunrise, sunset))
  }, [daily])

  if (daily.length === 0 || !daily[0]) return null

  const { sunrise, sunset } = daily[0]

  const arcLength = Math.PI * 90
  const angle = t !== null ? Math.PI * t : 0
  const cx = 10 + 90 * (1 - Math.cos(angle))
  const cy = 100 - 90 * Math.sin(angle)

  return (
    <div className="glass-card p-4" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider mb-3">Daylight</h2>
      <svg viewBox="0 0 200 110" className="w-full max-w-xs mx-auto block">
        <path
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="none"
          stroke="rgba(251,191,36,0.7)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={arcLength * (1 - (t ?? 0))}
        />
        <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        {t !== null && <circle cx={cx} cy={cy} r="6" fill="#fbbf24" />}
        <text x="100" y="14" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9">Noon</text>
      </svg>
      <div className="grid grid-cols-3 mt-3 text-center">
        <div>
          <span className="text-xl">🌅</span>
          <p className="text-white/80 text-sm mt-1 font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>{formatTime(sunrise, timezone)}</p>
          <p className="text-white/50 text-xs">Sunrise</p>
        </div>
        <div>
          <p className="text-white/70 text-sm font-medium">{dayLength(sunrise, sunset)}</p>
          <p className="text-white/50 text-xs">Daylight</p>
        </div>
        <div>
          <span className="text-xl">🌇</span>
          <p className="text-white/80 text-sm mt-1 font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>{formatTime(sunset, timezone)}</p>
          <p className="text-white/50 text-xs">Sunset</p>
        </div>
      </div>
    </div>
  )
}
