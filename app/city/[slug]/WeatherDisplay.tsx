'use client'

import { useWeatherStore } from '@/lib/store/weather-store'
import { WeatherCard } from '@/components/weather/WeatherCard'
import { ForecastStrip } from '@/components/weather/ForecastStrip'
import { HourlyChart } from '@/components/weather/HourlyChart'
import { ExtendedStatsCard } from '@/components/weather/ExtendedStatsCard'
import { PrecipitationBarChart } from '@/components/weather/PrecipitationBarChart'
import { WeekSparkline } from '@/components/weather/WeekSparkline'
import { SunriseSunsetCard } from '@/components/weather/SunriseSunsetCard'
import { HourlyWindStrip } from '@/components/weather/HourlyWindStrip'
import { HourlyConditionStrip } from '@/components/weather/HourlyConditionStrip'
import { WeatherSummaryCard } from '@/components/weather/WeatherSummaryCard'
import { BestTimeCard } from '@/components/weather/BestTimeCard'
import { TomorrowCard } from '@/components/weather/TomorrowCard'
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
      <HourlyChart hours={next24} unit={temperatureUnit} />
      <HourlyWindStrip hours={next24} />
      <HourlyConditionStrip hours={next24} timezone={weatherData.timezone} />
      <WeatherSummaryCard weather={weatherData.current} daily={weatherData.daily} unit={temperatureUnit} />
      <BestTimeCard hours={next24} />
      <ExtendedStatsCard weather={weatherData.current} unit={temperatureUnit} />
      <WeekSparkline daily={weatherData.daily} unit={temperatureUnit} />
      <ForecastStrip daily={weatherData.daily} unit={temperatureUnit} />
      <PrecipitationBarChart daily={weatherData.daily} timezone={weatherData.timezone} />
      <SunriseSunsetCard daily={weatherData.daily} timezone={weatherData.timezone} />
      <TomorrowCard daily={weatherData.daily} unit={temperatureUnit} timezone={weatherData.timezone} />
    </>
  )
}
