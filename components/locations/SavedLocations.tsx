'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWeatherStore } from '@/lib/store/weather-store'
import type { GeoLocation } from '@/types/weather'

interface QuickWeather {
  temperature: number
  wmoCode: number
  isDay: boolean
}

function SavedLocationChip({
  city,
  onNavigate,
  onRemove,
}: {
  city: GeoLocation
  onNavigate: (city: GeoLocation) => void
  onRemove: (name: string, country: string) => void
}) {
  const [weather, setWeather] = useState<QuickWeather | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api/weather/quick?lat=${city.lat}&lon=${city.lon}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && !controller.signal.aborted) {
          setWeather(data)
        }
      })
      .catch(() => {})
    return () => controller.abort()
  }, [city.lat, city.lon])

  return (
    <div className="flex items-center gap-1 glass-card-dark px-3 py-1.5">
      <button
        onClick={() => onNavigate(city)}
        className="text-white text-sm font-medium hover:text-white/80 transition-colors"
      >
        📍 {city.name}
        {weather !== null && (
          <span className="ml-1 text-white/70"> · {weather.temperature}°</span>
        )}
      </button>
      <button
        onClick={() => onRemove(city.name, city.country)}
        className="text-white/30 hover:text-white/70 text-xs ml-1 transition-colors"
        aria-label={`Remove ${city.name}`}
      >
        ×
      </button>
    </div>
  )
}

export function SavedLocations() {
  const router = useRouter()
  const { savedLocations, removeSavedLocation } = useWeatherStore()

  if (savedLocations.length === 0) return null

  const navigate = (city: GeoLocation) => {
    const slug = encodeURIComponent(city.name.toLowerCase().replace(/\s+/g, '-'))
    router.push(
      `/city/${slug}?lat=${city.lat}&lon=${city.lon}&name=${encodeURIComponent(city.name)}&country=${encodeURIComponent(city.country)}${city.admin1 ? `&admin1=${encodeURIComponent(city.admin1)}` : ''}`
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-white/50 text-sm self-center mr-1">Saved:</span>
      {savedLocations.map((city) => (
        <SavedLocationChip
          key={`${city.name}-${city.country}-${city.lat}-${city.lon}`}
          city={city}
          onNavigate={navigate}
          onRemove={removeSavedLocation}
        />
      ))}
    </div>
  )
}
