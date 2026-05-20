'use client'

import { useWeatherStore } from '@/lib/store/weather-store'
import type { GeoLocation } from '@/types/weather'

export function CityPageClient({ location }: { location: GeoLocation }) {
  const { isSaved, addSavedLocation, removeSavedLocation, temperatureUnit, toggleTemperatureUnit } = useWeatherStore()
  const saved = isSaved(location.name, location.country)

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTemperatureUnit}
        className="glass-card-dark px-3 py-1.5 text-white/70 hover:text-white text-sm font-medium transition-colors rounded-lg"
      >
        °{temperatureUnit === 'C' ? 'F' : 'C'}
      </button>
      <button
        onClick={() => saved ? removeSavedLocation(location.name, location.country) : addSavedLocation(location)}
        className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all
          ${saved ? 'glass-card text-amber-300 hover:text-white' : 'glass-card-dark text-white/60 hover:text-white'}`}
      >
        {saved ? '📍 Saved' : '+ Save'}
      </button>
    </div>
  )
}
