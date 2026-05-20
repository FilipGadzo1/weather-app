'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { GeoLocation } from '@/types/weather'
import { useWeatherStore } from '@/lib/store/weather-store'

export function SearchBar({ placeholder = 'Search city...' }: { placeholder?: string }) {
  const router = useRouter()
  const setCurrentCity = useWeatherStore((s) => s.setCurrentCity)
  const addRecentSearch = useWeatherStore((s) => s.addRecentSearch)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeoLocation[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const search = useCallback((q: string) => {
    clearTimeout(debounceTimer.current)
    if (q.trim().length < 2) { setResults([]); setOpen(false); return }
    debounceTimer.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setResults(data)
        setOpen(data.length > 0)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [])

  const selectCity = useCallback((city: GeoLocation) => {
    setCurrentCity(city)
    addRecentSearch(city)
    setQuery(city.name)
    setOpen(false)
    const slug = encodeURIComponent(city.name.toLowerCase().replace(/\s+/g, '-'))
    router.push(`/city/${slug}?lat=${city.lat}&lon=${city.lon}&name=${encodeURIComponent(city.name)}&country=${encodeURIComponent(city.country)}${city.admin1 ? `&admin1=${encodeURIComponent(city.admin1)}` : ''}`)
  }, [router, setCurrentCity, addRecentSearch])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    return () => clearTimeout(debounceTimer.current)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-lg">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); search(e.target.value) }}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 glass-card text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30 text-lg transition-all"
        />
        {loading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 text-sm animate-spin">⏳</span>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full glass-card overflow-hidden z-50 shadow-2xl">
          {results.map((city, i) => (
            <button
              key={`${city.name}-${city.lat}-${i}`}
              onClick={() => selectCity(city)}
              className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/10 last:border-0"
            >
              <span className="text-white font-medium">{city.name}</span>
              {city.admin1 && <span className="text-white/60 text-sm ml-2">{city.admin1},</span>}
              <span className="text-white/60 text-sm ml-2">{city.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
