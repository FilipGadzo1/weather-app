'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type GeoState = 'idle' | 'requesting' | 'locating' | 'reverse-geocoding' | 'error'

const ERROR_MESSAGES: Record<string, string> = {
  PERMISSION_DENIED: 'Location access denied. Search for a city instead.',
  TIMEOUT: 'Could not get your location. Try again.',
  GEOCODE_FAIL: 'Could not identify your location.',
  NO_CITY: 'No city found at your location.',
}

export default function UseMyLocationButton() {
  const router = useRouter()
  const [state, setState] = useState<GeoState>('idle')
  const [error, setError] = useState<string | null>(null)

  if (typeof window === 'undefined' || !('geolocation' in navigator)) {
    return null
  }

  function handleClick() {
    setState('requesting')
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setState('reverse-geocoding')
        const lat = Math.round(position.coords.latitude * 10000) / 10000
        const lon = Math.round(position.coords.longitude * 10000) / 10000

        try {
          const res = await fetch(`/api/geocode/reverse?lat=${lat}&lon=${lon}`)
          if (!res.ok) {
            setError(ERROR_MESSAGES.GEOCODE_FAIL)
            setState('error')
            return
          }
          const data = await res.json()
          if (!data.name) {
            setError(ERROR_MESSAGES.NO_CITY)
            setState('error')
            return
          }
          const slug = encodeURIComponent(data.name.toLowerCase().replace(/\s+/g, '-'))
          router.push(`/city/${slug}?name=${encodeURIComponent(data.name)}&lat=${lat}&lon=${lon}`)
          setState('idle')
        } catch {
          setError(ERROR_MESSAGES.GEOCODE_FAIL)
          setState('error')
        }
      },
      (err) => {
        const msg =
          err.code === err.PERMISSION_DENIED
            ? ERROR_MESSAGES.PERMISSION_DENIED
            : ERROR_MESSAGES.TIMEOUT
        setError(msg)
        setState('error')
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    )
  }

  const isLoading = state === 'requesting' || state === 'locating' || state === 'reverse-geocoding'

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-white/80 hover:text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
      >
        <span className="text-lg">{isLoading ? '⏳' : '📍'}</span>
        {state === 'requesting' && 'Requesting location…'}
        {state === 'locating' && 'Getting coordinates…'}
        {state === 'reverse-geocoding' && 'Finding city…'}
        {(state === 'idle' || state === 'error') && 'Use My Location'}
      </button>
      {state === 'error' && error && (
        <p className="text-amber-300 text-xs text-center max-w-[240px]">{error}</p>
      )}
    </div>
  )
}
