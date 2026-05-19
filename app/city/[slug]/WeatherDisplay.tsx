'use client'

import { useWeatherStore } from '@/lib/store/weather-store'
import { WeatherCard } from '@/components/weather/WeatherCard'
import { ForecastStrip } from '@/components/weather/ForecastStrip'
import { HourlyChart } from '@/components/weather/HourlyChart'
import { ExtendedStatsCard } from '@/components/weather/ExtendedStatsCard'
import { getNext24Hours } from '@/lib/weather/hourly'
import type { WeatherData } from '@/types/weather'

export function WeatherDisplay({ weatherData }: { weatherData: WeatherData }) {
  const { temperatureUnit } = useWeatherStore()
  const next24 = getNext24Hours(weatherData)
  return (
    <>
      <WeatherCard
        location={weatherData.location}
        weather={weatherData.current}
        unit={temperatureUnit}
        sunTimes={{ sunrise: weatherData.daily[0]?.sunrise ?? null, sunset: weatherData.daily[0]?.sunset ?? null }}
        timezone={weatherData.timezone}
      />
      <HourlyChart hours={next24} unit={temperatureUnit} timezone={weatherData.timezone} />
      <ExtendedStatsCard weather={weatherData.current} unit={temperatureUnit} />
      <ForecastStrip daily={weatherData.daily} unit={temperatureUnit} />
    </>
  )
}
