import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchWeather } from '@/lib/weather/open-meteo'
import { getBackgroundKey } from '@/lib/weather/wmo-codes'
import { WeatherBackground } from '@/components/weather/WeatherBackground'
import { ActivityAdvisor } from '@/components/claude/ActivityAdvisor'
import { AlertExplainer } from '@/components/claude/AlertExplainer'
import { CityPageClient } from './CityPageClient'
import { WeatherDisplay } from './WeatherDisplay'
import type { GeoLocation } from '@/types/weather'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lat?: string; lon?: string; name?: string; country?: string; admin1?: string }>
}

export default async function CityPage({ searchParams }: PageProps) {
  const { lat, lon, name, country, admin1 } = await searchParams

  if (!lat || !lon || !name || !country) {
    notFound()
  }

  const location: GeoLocation = {
    name: decodeURIComponent(name),
    country: decodeURIComponent(country),
    admin1: admin1 ? decodeURIComponent(admin1) : undefined,
    lat: parseFloat(lat),
    lon: parseFloat(lon),
  }

  let weatherData
  try {
    weatherData = await fetchWeather(location.lat, location.lon, location)
  } catch {
    return (
      <WeatherBackground backgroundKey="cloudy">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="glass-card p-8 text-center max-w-md">
            <p className="text-4xl mb-4">⚠️</p>
            <h2 className="text-white text-xl font-semibold mb-2">Weather data unavailable</h2>
            <p className="text-white/60 text-sm">Unable to fetch forecast for {location.name}. Please try again.</p>
            <Link href="/" className="mt-4 inline-block text-sky-400 hover:text-sky-300 text-sm">← Back to search</Link>
          </div>
        </div>
      </WeatherBackground>
    )
  }

  const bgKey = getBackgroundKey(weatherData.current.wmoCode, weatherData.current.isDay)

  return (
    <WeatherBackground backgroundKey={bgKey}>
      <div className="min-h-screen px-4 py-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors">
            ← Search
          </Link>
          <CityPageClient location={location} />
        </div>

        <div className="space-y-4">
          <WeatherDisplay weatherData={weatherData} />

          {weatherData.hasSevereCondition && (
            <AlertExplainer location={location} weather={weatherData.current} />
          )}

          <ActivityAdvisor location={location} weather={weatherData.current} />
        </div>
      </div>
    </WeatherBackground>
  )
}
