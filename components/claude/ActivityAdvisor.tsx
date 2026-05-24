'use client'

import { useState, useRef, useEffect } from 'react'
import type { GeoLocation, CurrentWeather } from '@/types/weather'

interface ActivityAdvisorProps {
  location: GeoLocation
  weather: CurrentWeather
}

export function ActivityAdvisor({ location, weather }: ActivityAdvisorProps) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const abortRef = useRef<AbortController | undefined>(undefined)

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  const fetchActivities = async () => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setLoading(true)
    setStarted(true)
    setText('')

    try {
      const res = await fetch('/api/claude/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, weather }),
        signal: abortRef.current.signal,
      })

      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setText((prev) => prev + decoder.decode(value, { stream: true }))
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setText('Unable to generate activity suggestions right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card p-6" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-white font-semibold text-lg">Activity Advisor</h2>
          <p className="text-white/60 text-sm">Powered by Claude AI</p>
        </div>
        <span className="text-2xl">🎯</span>
      </div>

      {!started ? (
        <div className="text-center py-4">
          <p className="text-white/60 text-sm mb-4">
            Get personalized activity suggestions based on today&apos;s weather in {location.name}.
          </p>
          <button
            onClick={fetchActivities}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-medium rounded-xl transition-colors"
          >
            ✨ Suggest Activities for Today
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {loading && !text && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 glass-card-dark rounded-xl animate-pulse" />
              ))}
            </div>
          )}
          {text && (
            <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
              {text}
              {loading && <span className="inline-block w-1 h-4 bg-white/70 animate-pulse ml-0.5" />}
            </div>
          )}
          {!loading && text && (
            <button
              onClick={fetchActivities}
              className="mt-3 text-white/50 text-xs hover:text-white/80 transition-colors"
            >
              ↺ Refresh suggestions
            </button>
          )}
        </div>
      )}
    </div>
  )
}
