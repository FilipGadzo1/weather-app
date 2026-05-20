import type { ReactNode } from 'react'
import type { CurrentWeather, GeoLocation, TemperatureUnit } from '@/types/weather'
import { getWmoInfo } from '@/lib/weather/wmo-codes'
import { toDisplayTemp } from '@/lib/store/weather-store'
import { formatTimeInZone } from '@/lib/utils/format-time'
import { WeatherIcon } from './WeatherIcon'
import { WindCompass } from './WindCompass'
import { FeelScoreBadge } from './FeelScoreBadge'

interface WeatherCardProps {
  location: GeoLocation
  weather: CurrentWeather
  unit: TemperatureUnit
  sunTimes: { sunrise: string | null; sunset: string | null }
  timezone: string
}

function StatPill({ label, value, children }: { label: string; value: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-0.5 p-3 glass-card-dark">
      <span className="text-xs text-white/60 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
      {children}
    </div>
  )
}

export function WeatherCard({ location, weather, unit, sunTimes, timezone }: WeatherCardProps) {
  const info = getWmoInfo(weather.wmoCode)
  const temp = toDisplayTemp(weather.temperature, unit)
  const feelsLike = toDisplayTemp(weather.feelsLike, unit)

  const windDirs = ['N','NE','E','SE','S','SW','W','NW']
  const windDir = windDirs[((Math.round(weather.windDirection / 45) % 8) + 8) % 8]

  return (
    <div className="glass-card p-6 md:p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {location.name}
          </h1>
          <p className="text-white/70 text-sm mt-0.5">
            {location.admin1 ? `${location.admin1}, ` : ''}{location.country}
          </p>
          <p className="text-white/80 mt-2 text-base">{info.label}</p>
        </div>
        <WeatherIcon iconKey={info.iconKey} size={64} />
      </div>

      <div className="mt-4 flex items-end gap-3">
        <span className="text-7xl md:text-8xl font-thin text-white leading-none">
          {temp}°
        </span>
        <span className="text-3xl text-white/60 mb-2">{unit}</span>
      </div>

      <p className="text-white/60 text-sm mt-1">
        Feels like {feelsLike}°{unit}
      </p>
      <FeelScoreBadge
        feelsLikeC={weather.feelsLike}
        humidity={weather.humidity}
        windSpeed={weather.windSpeed}
      />

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-6">
        <StatPill label="Humidity" value={`${weather.humidity}%`} />
        <StatPill label="Wind" value={`${weather.windSpeed} km/h ${windDir}`}>
          <WindCompass degrees={weather.windDirection} />
        </StatPill>
        <StatPill label="UV" value={String(weather.uvIndex)} />
        <StatPill label="Visibility" value={`${weather.visibility} km`} />
        <StatPill label="Precip." value={`${weather.precipitationProbability}%`} />
        <StatPill label="🌅 Sunrise" value={formatTimeInZone(sunTimes.sunrise, timezone)} />
        <StatPill label="🌇 Sunset" value={formatTimeInZone(sunTimes.sunset, timezone)} />
      </div>
    </div>
  )
}
