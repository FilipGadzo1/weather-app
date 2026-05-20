'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GeoLocation, TemperatureUnit } from '@/types/weather'

interface WeatherStore {
  currentCity: GeoLocation | null
  savedLocations: GeoLocation[]
  temperatureUnit: TemperatureUnit
  recentSearches: GeoLocation[]
  setCurrentCity: (city: GeoLocation) => void
  addSavedLocation: (city: GeoLocation) => void
  removeSavedLocation: (name: string) => void
  toggleTemperatureUnit: () => void
  isSaved: (name: string) => boolean
  addRecentSearch: (city: GeoLocation) => void
  clearRecentSearches: () => void
}

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set, get) => ({
      currentCity: null,
      savedLocations: [],
      temperatureUnit: 'C',
      recentSearches: [],
      setCurrentCity: (city) => set({ currentCity: city }),
      addSavedLocation: (city) => {
        const existing = get().savedLocations
        if (existing.length >= 5) return
        if (existing.some((s) => s.name === city.name && s.country === city.country)) return
        set({ savedLocations: [...existing, city] })
      },
      removeSavedLocation: (name) =>
        set({ savedLocations: get().savedLocations.filter((s) => s.name !== name) }),
      toggleTemperatureUnit: () =>
        set({ temperatureUnit: get().temperatureUnit === 'C' ? 'F' : 'C' }),
      isSaved: (name) => get().savedLocations.some((s) => s.name === name),
      addRecentSearch: (city) => {
        const filtered = get().recentSearches.filter(
          (s) => !(s.name === city.name && s.country === city.country)
        )
        set({ recentSearches: [city, ...filtered].slice(0, 5) })
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    { name: 'weather-app-storage' }
  )
)

export function toDisplayTemp(celsius: number, unit: TemperatureUnit): number {
  return unit === 'F' ? Math.round((celsius * 9) / 5 + 32) : Math.round(celsius)
}
