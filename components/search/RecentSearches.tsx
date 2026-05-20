'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWeatherStore } from '@/lib/store/weather-store'

export function RecentSearches() {
  const router = useRouter()
  const { recentSearches, clearRecentSearches, setCurrentCity } = useWeatherStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || recentSearches.length === 0) return null

  function handleClick(city: (typeof recentSearches)[0]) {
    setCurrentCity(city)
    const slug = encodeURIComponent(city.name.toLowerCase().replace(/\s+/g, '-'))
    const params = new URLSearchParams({
      name: city.name,
      lat: String(city.lat),
      lon: String(city.lon),
      country: city.country,
    })
    if (city.admin1) params.set('admin1', city.admin1)
    router.push(`/city/${slug}?${params}`)
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <p className="text-white/50 text-xs uppercase tracking-wider">Recent</p>
        <button
          onClick={clearRecentSearches}
          className="text-xs text-white/50 hover:text-white/80 underline transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentSearches.map((city) => (
          <button
            key={`${city.name}-${city.country}`}
            onClick={() => handleClick(city)}
            className="glass-card px-3 py-1.5 text-sm text-white/80 hover:bg-white/15 transition-colors rounded-xl"
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  )
}
