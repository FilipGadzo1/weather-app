'use client'

import { useWeatherStore } from '@/lib/store/weather-store'
import type { GeoLocation } from '@/types/weather'

export function CityPageClient({ location }: { location: GeoLocation }) {
  const { isSaved, addSavedLocation, removeSavedLocation } = useWeatherStore()
  const saved = isSaved(location.name)

  return (
    <button
      onClick={() => saved ? removeSavedLocation(location.name) : addSavedLocation(location)}
      className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all
        ${saved ? 'glass-card text-amber-300 hover:text-white' : 'glass-card-dark text-white/60 hover:text-white'}`}
    >
      {saved ? '📍 Saved' : '+ Save location'}
    </button>
  )
}
