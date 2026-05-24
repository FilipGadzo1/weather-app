'use client'

import { useState } from 'react'
import type { GeoLocation, CurrentWeather } from '@/types/weather'
import { getWmoInfo } from '@/lib/weather/wmo-codes'

interface AlertExplainerProps {
  location: GeoLocation
  weather: CurrentWeather
}

export function AlertExplainer({ location, weather }: AlertExplainerProps) {
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const info = getWmoInfo(weather.wmoCode)

  const fetchExplanation = async () => {
    if (explanation) { setExpanded(true); return }
    setLoading(true)
    setExpanded(true)
    try {
      const res = await fetch('/api/claude/explain-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, weather }),
      })
      const data = await res.json()
      setExplanation(data.explanation ?? data.error ?? 'Unable to fetch explanation.')
    } catch {
      setExplanation('Unable to fetch explanation right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card border-l-4 border-amber-400 p-4 md:p-6" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <button
        onClick={fetchExplanation}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="text-left">
            <p className="text-amber-300 font-semibold text-sm uppercase tracking-wide">Severe Weather Advisory</p>
            <p className="text-white font-medium">{info.label}</p>
          </div>
        </div>
        <span className="text-white/50 text-lg">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/10">
          {loading ? (
            <div className="space-y-2">
              <div className="h-4 glass-card-dark rounded animate-pulse w-3/4" />
              <div className="h-4 glass-card-dark rounded animate-pulse w-full" />
              <div className="h-4 glass-card-dark rounded animate-pulse w-2/3" />
            </div>
          ) : (
            <p className="text-white/80 text-sm leading-relaxed">{explanation}</p>
          )}
          <p className="text-white/40 text-xs mt-3">Explained by Claude AI</p>
        </div>
      )}
    </div>
  )
}
