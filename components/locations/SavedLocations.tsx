'use client'

import { useRouter } from 'next/navigation'
import { useWeatherStore } from '@/lib/store/weather-store'
import type { GeoLocation } from '@/types/weather'

export function SavedLocations() {
  const router = useRouter()
  const { savedLocations, removeSavedLocation } = useWeatherStore()

  if (savedLocations.length === 0) return null

  const navigate = (city: GeoLocation) => {
    const slug = encodeURIComponent(city.name.toLowerCase().replace(/\s+/g, '-'))
    router.push(`/city/${slug}?lat=${city.lat}&lon=${city.lon}&name=${encodeURIComponent(city.name)}&country=${encodeURIComponent(city.country)}${city.admin1 ? `&admin1=${encodeURIComponent(city.admin1)}` : ''}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-white/50 text-sm self-center mr-1">Saved:</span>
      {savedLocations.map((city) => (
        <div
          key={city.name}
          className="flex items-center gap-1 glass-card-dark px-3 py-1.5"
        >
          <button
            onClick={() => navigate(city)}
            className="text-white text-sm font-medium hover:text-white/80 transition-colors"
          >
            📍 {city.name}
          </button>
          <button
            onClick={() => removeSavedLocation(city.name)}
            className="text-white/30 hover:text-white/70 text-xs ml-1 transition-colors"
            aria-label={`Remove ${city.name}`}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
