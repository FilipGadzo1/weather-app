import type { CurrentWeather } from '@/types/weather'

export interface ComfortBannerInfo {
  message: string
  icon: string
  colorClass: string
  bgClass: string
}

export function getComfortBanner(weather: CurrentWeather): ComfortBannerInfo | null {
  const diff = weather.feelsLike - weather.temperature

  // Dangerous cold takes priority — more urgent than wind-chill framing
  if (weather.feelsLike <= -10) {
    return {
      message: `Dangerous cold — feels like ${Math.round(weather.feelsLike)}°`,
      icon: '🥶',
      colorClass: 'text-blue-300',
      bgClass: 'bg-blue-500/15',
    }
  }

  if (diff <= -5 && weather.windSpeed >= 15) {
    return {
      message: `Feels ${Math.abs(Math.round(diff))}° colder — wind chill`,
      icon: '💨',
      colorClass: 'text-sky-300',
      bgClass: 'bg-sky-500/15',
    }
  }

  if (diff >= 4 && weather.humidity >= 60) {
    return {
      message: `Feels ${Math.round(diff)}° warmer — humidity`,
      icon: '🌡️',
      colorClass: 'text-orange-300',
      bgClass: 'bg-orange-500/15',
    }
  }

  if (weather.temperature >= 30 && weather.humidity >= 70) {
    return {
      message: 'High heat & humidity — stay hydrated',
      icon: '🥵',
      colorClass: 'text-red-300',
      bgClass: 'bg-red-500/15',
    }
  }

  return null
}
