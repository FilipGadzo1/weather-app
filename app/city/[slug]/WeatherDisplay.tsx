'use client'

import { useWeatherStore } from '@/lib/store/weather-store'
import { WeatherCard } from '@/components/weather/WeatherCard'
import { ForecastStrip } from '@/components/weather/ForecastStrip'
import type { WeatherData } from '@/types/weather'

export function WeatherDisplay({ weatherData }: { weatherData: WeatherData }) {
  const { temperatureUnit } = useWeatherStore()
  return (
    <>
      <WeatherCard
        location={weatherData.location}
        weather={weatherData.current}
        unit={temperatureUnit}
      />
      <ForecastStrip daily={weatherData.daily} unit={temperatureUnit} />
    </>
  )
}
