import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchWeather } from '@/lib/weather/open-meteo'
import { fetchAirQuality } from '@/lib/weather/air-quality'
import { getBackgroundKey } from '@/lib/weather/wmo-codes'
import { CityPageClient } from './CityPageClient'
import { WeatherDisplay } from './WeatherDisplay'
import { CityInsights } from './CityInsights'
import type { GeoLocation, AirQualityData } from '@/types/weather'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lat?: string; lon?: string; name?: string; country?: string; admin1?: string }>
}

export default async function CityPage({ searchParams }: PageProps) {
  const { lat, lon, name, country, admin1 } = await searchParams

  if (!lat || !lon || !name || !country) {
    notFound()
  }

  const latNum = parseFloat(lat)
  const lonNum = parseFloat(lon)
  if (isNaN(latNum) || isNaN(lonNum) || latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
    notFound()
  }

  const location: GeoLocation = {
    name: decodeURIComponent(name),
    country: decodeURIComponent(country),
    admin1: admin1 ? decodeURIComponent(admin1) : undefined,
    lat: latNum,
    lon: lonNum,
  }

  const [weatherResult, aqiResult] = await Promise.allSettled([
    fetchWeather(latNum, lonNum, location),
    fetchAirQuality(latNum, lonNum),
  ])

  if (weatherResult.status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(160deg, #080d1a 0%, #0d1525 100%)' }}>
        <div className="glass-card p-8 text-center max-w-md">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="text-white text-xl font-semibold mb-2">Weather data unavailable</h2>
          <p className="text-white/60 text-sm">Unable to fetch forecast for {location.name}. Please try again.</p>
          <Link href="/" className="mt-4 inline-block text-sky-400 hover:text-sky-300 text-sm">← Back to search</Link>
        </div>
      </div>
    )
  }
  const weatherData = weatherResult.value

  const airQuality: AirQualityData | null =
    aqiResult.status === 'fulfilled' ? aqiResult.value : null

  const bgKey = getBackgroundKey(weatherData.current.wmoCode, weatherData.current.isDay)

  const BG_IMAGES: Record<string, string> = {
    'clear-day':   '/backgrounds/bg-sunny.png',
    'clear-night': '/backgrounds/bg-night.png',
    cloudy:        '/backgrounds/bg-cloudy.png',
    fog:           '/backgrounds/bg-cloudy.png',
    rain:          '/backgrounds/bg-rain.png',
    snow:          '/backgrounds/bg-snow.png',
    storm:         '/backgrounds/bg-rain.png',
    aurora:        '/backgrounds/bg-aurora.png',
  }
  const bgImage = BG_IMAGES[bgKey] ?? BG_IMAGES['clear-night']

  return (
    <div className="relative min-h-screen">
      {/* Full-screen background image — crisp */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Dark overlay for readability */}
      <div className="fixed inset-0 -z-10" style={{ background: 'rgba(4,8,20,0.15)' }} />

      <div className="relative z-10 px-4 py-6 max-w-3xl mx-auto md:px-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            <span
              className="font-semibold text-white/70 group-hover:text-white transition-colors"
              style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
            >
              Skye
            </span>
          </Link>
          <CityPageClient location={location} />
        </div>

        <div className="space-y-4">
          <WeatherDisplay weatherData={weatherData} backgroundKey={bgKey} />

          <CityInsights
            location={location}
            weather={weatherData.current}
            airQuality={airQuality}
            uvIndex={weatherData.current.uvIndex}
            hasSevereCondition={weatherData.hasSevereCondition}
          />
        </div>
      </div>
    </div>
  )
}
