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
import { HourlyHumidityChart } from '@/components/weather/HourlyHumidityChart'
import { MoonPhaseCard } from '@/components/weather/MoonPhaseCard'
import { HourlyUvChart } from '@/components/weather/HourlyUvChart'
import { HourlyPrecipChart } from '@/components/weather/HourlyPrecipChart'
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
      {/* Hero card – full width */}
      <WeatherCard
        location={weatherData.location}
        weather={weatherData.current}
        unit={temperatureUnit}
        sunTimes={{ sunrise: weatherData.daily[0]?.sunrise ?? null, sunset: weatherData.daily[0]?.sunset ?? null }}
        timezone={weatherData.timezone}
      />

      {/* 24-hour temperature chart – full width */}
      <HourlyChart hours={next24} unit={temperatureUnit} />

      {/* Hourly detail – 2-col on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HourlyWindStrip hours={next24} />
        <HourlyConditionStrip hours={next24} timezone={weatherData.timezone} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HourlyHumidityChart hours={next24} />
        <HourlyUvChart hours={next24} />
      </div>
      <HourlyPrecipChart hours={next24} />

      {/* Summary + best time – 2-col on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WeatherSummaryCard weather={weatherData.current} daily={weatherData.daily} unit={temperatureUnit} />
        <BestTimeCard hours={next24} />
      </div>

      {/* Atmosphere – full width */}
      <ExtendedStatsCard weather={weatherData.current} unit={temperatureUnit} daily={weatherData.daily} />

      {/* Week overview – full width */}
      <WeekSparkline daily={weatherData.daily} unit={temperatureUnit} />
      <ForecastStrip daily={weatherData.daily} unit={temperatureUnit} />

      {/* Sun + precipitation – 2-col on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SunriseSunsetCard daily={weatherData.daily} timezone={weatherData.timezone} />
        <PrecipitationBarChart daily={weatherData.daily} timezone={weatherData.timezone} />
      </div>

      {/* Moon + tomorrow – 2-col on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MoonPhaseCard />
        <TomorrowCard daily={weatherData.daily} unit={temperatureUnit} timezone={weatherData.timezone} />
      </div>
    </>
  )
}
