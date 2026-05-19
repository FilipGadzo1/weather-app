'use client'

import { useState, useRef, useEffect } from 'react'
import type { GeoLocation, CurrentWeather } from '@/types/weather'
import { useWeatherStore } from '@/lib/store/weather-store'

interface WhatToWearProps {
  location: GeoLocation
  weather: CurrentWeather
}

const FALLBACK = 'Dress for the weather and check current conditions.'

export function WhatToWear({ location, weather }: WhatToWearProps) {
  const { temperatureUnit } = useWeatherStore()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const [hidden, setHidden] = useState(false)
  const abortRef = useRef<AbortController | undefined>(undefined)

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  const fetchWear = async () => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setLoading(true)
    setStarted(true)
    setText('')

    try {
      const res = await fetch('/api/claude/wear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, weather, unit: temperatureUnit }),
        signal: abortRef.current.signal,
      })

      if (res.status === 503) {
        setHidden(true)
        return
      }

      const data: { text?: string } = await res.json()
      setText(data.text?.trim() || FALLBACK)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setText(FALLBACK)
    } finally {
      setLoading(false)
    }
  }

  if (hidden) return null

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-white font-semibold text-lg">What to Wear</h2>
          <p className="text-white/60 text-sm">Powered by Claude AI</p>
        </div>
        <span className="text-2xl" aria-hidden="true">👕</span>
      </div>

      {!started ? (
        <div className="text-center py-2">
          <button
            onClick={fetchWear}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-medium rounded-xl transition-colors"
          >
            👕 What should I wear?
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {loading && !text && (
            <button
              disabled
              className="px-6 py-3 bg-sky-500/60 text-white font-medium rounded-xl"
            >
              Thinking…
            </button>
          )}
          {text && (
            <p className="text-white/90 text-sm leading-relaxed">{text}</p>
          )}
          {!loading && text && (
            <button
              onClick={fetchWear}
              className="mt-2 text-white/50 text-xs hover:text-white/80 transition-colors"
            >
              ↺ Retry
            </button>
          )}
        </div>
      )}
    </div>
  )
}
