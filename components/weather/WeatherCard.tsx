import type { ReactNode } from 'react'
import type { CurrentWeather, GeoLocation, TemperatureUnit } from '@/types/weather'
import { getWmoInfo } from '@/lib/weather/wmo-codes'
import { toDisplayTemp } from '@/lib/store/weather-store'
import { formatTimeInZone } from '@/lib/utils/format-time'
import { WeatherIcon } from './WeatherIcon'
import { WindCompass } from './WindCompass'
import { FeelScoreBadge } from './FeelScoreBadge'
import { getComfortBanner } from '@/lib/weather/comfort-banner'
import { degreesToCompass } from '@/lib/weather/wind-direction'

interface WeatherCardProps {
  location: GeoLocation
  weather: CurrentWeather
  unit: TemperatureUnit
  sunTimes: { sunrise: string | null; sunset: string | null }
  timezone: string
}

function StatItem({
  label,
  value,
  children,
}: {
  label: string
  value: string
  children?: ReactNode
}) {
  return (
    <div className="glass-card-stat flex flex-col items-center gap-1 px-3 py-3">
      <span
        className="text-[10px] text-white/50 uppercase tracking-widest"
        style={{ fontFamily: 'var(--font-outfit)' }}
      >
        {label}
      </span>
      <span
        className="text-sm font-semibold text-white/90 leading-tight"
        style={{ fontFamily: 'var(--font-outfit)' }}
      >
        {value}
      </span>
      {children}
    </div>
  )
}

export function WeatherCard({ location, weather, unit, sunTimes, timezone }: WeatherCardProps) {
  const info = getWmoInfo(weather.wmoCode)
  const temp = toDisplayTemp(weather.temperature, unit)
  const feelsLike = toDisplayTemp(weather.feelsLike, unit)
  const windDir = degreesToCompass(weather.windDirection)
  const banner = getComfortBanner(weather)

  return (
    <div className="glass-card-hero p-6 md:p-8">
      {/* Top row: location block + large icon */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5 min-w-0">
          <p
            className="text-xs text-white/50 uppercase tracking-[0.2em] font-medium"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            {location.admin1 ? `${location.admin1}, ` : ''}{location.country}
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold text-white leading-tight truncate"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {location.name}
          </h1>
          <p
            className="text-white/60 text-sm mt-1"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            {info.label}
          </p>
        </div>
        <div className="shrink-0 opacity-90 drop-shadow-[0_0_16px_rgba(255,255,255,0.25)]">
          <WeatherIcon iconKey={info.iconKey} size={96} />
        </div>
      </div>

      {/* Temperature hero */}
      <div className="mt-5 flex items-end gap-2">
        <span
          className="text-8xl md:text-9xl font-bold text-white leading-none tracking-tight"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {temp}
        </span>
        <div className="flex flex-col mb-3 gap-0.5">
          <span
            className="text-3xl text-white/70 font-light"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            °{unit}
          </span>
        </div>
      </div>

      {/* Feels like + badges */}
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <span
          className="text-white/55 text-sm"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Feels like{' '}
          <span className="text-white/80 font-medium">
            {feelsLike}°{unit}
          </span>
        </span>
        <FeelScoreBadge
          feelsLikeC={weather.feelsLike}
          humidity={weather.humidity}
          windSpeed={weather.windSpeed}
        />
      </div>

      {/* Comfort banner */}
      {banner && (
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm mt-3 ${banner.bgClass}`}
        >
          <span>{banner.icon}</span>
          <span className={banner.colorClass} style={{ fontFamily: 'var(--font-outfit)' }}>
            {banner.message}
          </span>
        </div>
      )}

      {/* Divider */}
      <div className="mt-6 border-t border-white/10" />

      {/* Stats strip */}
      <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        <StatItem label="Humidity" value={`${weather.humidity}%`} />
        <StatItem label="Wind" value={`${weather.windSpeed} km/h ${windDir}`}>
          <WindCompass degrees={weather.windDirection} />
        </StatItem>
        <StatItem label="UV Index" value={String(weather.uvIndex)} />
        <StatItem label="Visibility" value={`${weather.visibility} km`} />
        <StatItem label="Precip." value={`${weather.precipitationProbability}%`} />
        <StatItem
          label="Sunrise"
          value={formatTimeInZone(sunTimes.sunrise, timezone)}
        />
        <StatItem
          label="Sunset"
          value={formatTimeInZone(sunTimes.sunset, timezone)}
        />
      </div>
    </div>
  )
}
