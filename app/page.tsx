import { SearchBar } from '@/components/search/SearchBar'
import { RecentSearches } from '@/components/search/RecentSearches'
import UseMyLocationButton from '@/components/locations/UseMyLocationButton'
import { SavedLocations } from '@/components/locations/SavedLocations'
import { WeatherBackground } from '@/components/weather/WeatherBackground'

export default function HomePage() {
  return (
    <WeatherBackground backgroundKey="clear-night">
      <div className="min-h-screen flex flex-col">
        {/* Hero section — takes most of the viewport */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-10">
          {/* Branding */}
          <div className="text-center mb-12">
            <h1
              className="text-8xl md:text-9xl font-bold text-white tracking-tight leading-none mb-3"
              style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
            >
              Skye
            </h1>
            <p className="text-white/50 text-sm uppercase tracking-[0.3em] font-light">
              Weather intelligence
            </p>
          </div>

          {/* Search — the main action */}
          <div className="w-full max-w-xl">
            <SearchBar placeholder="Search any city…" />
          </div>

          {/* Use location */}
          <div className="mt-4">
            <UseMyLocationButton />
          </div>
        </div>

        {/* Bottom tray — recent + saved */}
        <div className="px-4 pb-10 flex flex-col items-center gap-4 w-full max-w-xl mx-auto">
          <RecentSearches />
          <SavedLocations />
        </div>
      </div>
    </WeatherBackground>
  )
}
