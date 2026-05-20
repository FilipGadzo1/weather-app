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

interface WeatherCardProps {
  location: GeoLocation
  weather: CurrentWeather
  unit: TemperatureUnit
  sunTimes: { sunrise: string | null; sunset: string | null }
  timezone: string
  backgroundKey: string
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

function RainParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-px bg-blue-300/40"
          style={{
            left: `${(i * 5.7) % 100}%`,
            height: `${18 + (i * 7) % 28}px`,
            animationName: 'rain-fall',
            animationDuration: `${0.6 + (i * 0.04) % 0.8}s`,
            animationDelay: `${(i * 0.1) % 2}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
          }}
        />
      ))}
    </div>
  )
}

function SnowParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-white/60"
          style={{
            left: `${(i * 4.2) % 100}%`,
            animationName: 'snow-fall',
            animationDuration: `${3 + (i * 0.13) % 4}s`,
            animationDelay: `${(i * 0.17) % 5}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
          }}
        />
      ))}
    </div>
  )
}

function SunGlow() {
  return (
    <div
      className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%)',
        animationName: 'pulse-glow',
        animationDuration: '4s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'ease-in-out',
      }}
    />
  )
}

export function WeatherCard({ location, weather, unit, sunTimes, timezone, backgroundKey }: WeatherCardProps) {
  const info = getWmoInfo(weather.wmoCode)
  const temp = toDisplayTemp(weather.temperature, unit)
  const feelsLike = toDisplayTemp(weather.feelsLike, unit)
  const windDir = degreesToCompass(weather.windDirection)
  const banner = getComfortBanner(weather)
  const bgImage = BG_IMAGES[backgroundKey] ?? BG_IMAGES['clear-night']

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        minHeight: '360px',
      }}
    >
      {/* Bottom-up gradient overlay for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(4,8,20,0.92) 0%, rgba(4,8,20,0.65) 40%, rgba(4,8,20,0.2) 70%, transparent 100%)',
        }}
      />

      {/* Weather particles */}
      {(backgroundKey === 'rain' || backgroundKey === 'storm') && <RainParticles />}
      {backgroundKey === 'snow' && <SnowParticles />}
      {backgroundKey === 'clear-day' && <SunGlow />}

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col justify-end" style={{ minHeight: '360px' }}>
        {/* Top row: location block + large icon */}
        <div className="flex items-start justify-between gap-4 mb-auto pt-2">
          <div className="flex flex-col gap-0.5 min-w-0">
            <p
              className="text-xs text-white/60 uppercase tracking-[0.2em] font-medium"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {location.admin1 ? `${location.admin1}, ` : ''}{location.country}
            </p>
            <h1
              className="text-3xl md:text-4xl font-bold text-white leading-tight truncate drop-shadow-lg"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {location.name}
            </h1>
            <p
              className="text-white/70 text-sm mt-1"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {info.label}
            </p>
          </div>
          <div className="shrink-0 opacity-95 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <WeatherIcon iconKey={info.iconKey} size={88} />
          </div>
        </div>

        {/* Temperature hero */}
        <div className="mt-8 flex items-end gap-2">
          <span
            className="text-8xl md:text-9xl font-bold text-white leading-none tracking-tight drop-shadow-lg"
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
            className="text-white/60 text-sm"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            Feels like{' '}
            <span className="text-white/85 font-medium">
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
        <div className="mt-5 border-t border-white/15" />

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
    </div>
  )
}
