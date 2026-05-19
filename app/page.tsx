import { SearchBar } from '@/components/search/SearchBar'
import { SavedLocations } from '@/components/locations/SavedLocations'
import { WeatherBackground } from '@/components/weather/WeatherBackground'

export default function HomePage() {
  return (
    <WeatherBackground backgroundKey="clear-night">
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">
              🌤 Skye
            </h1>
            <p className="text-white/60 text-lg">
              Weather intelligence, powered by AI
            </p>
          </div>

          <SearchBar placeholder="Search for any city..." />

          <SavedLocations />

          <p className="text-center text-white/30 text-sm">
            Search a city to see the forecast + AI activity suggestions
          </p>
        </div>
      </div>
    </WeatherBackground>
  )
}
