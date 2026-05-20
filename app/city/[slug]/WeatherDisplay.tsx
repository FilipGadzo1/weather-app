'use client'

import type { ReactNode } from 'react'
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

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span
        className="text-white/35 text-xs uppercase tracking-[0.25em] font-medium"
        style={{ fontFamily: 'var(--font-outfit)' }}
      >
        {children}
      </span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  )
}

export function WeatherDisplay({ weatherData, backgroundKey }: { weatherData: WeatherData; backgroundKey: string }) {
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
        backgroundKey={backgroundKey}
      />

      {/* ── Today ──────────────────────────────────── */}
      <SectionLabel>Today</SectionLabel>

      <HourlyChart hours={next24} unit={temperatureUnit} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HourlyWindStrip hours={next24} />
        <HourlyConditionStrip hours={next24} timezone={weatherData.timezone} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HourlyHumidityChart hours={next24} />
        <HourlyUvChart hours={next24} />
      </div>
      <HourlyPrecipChart hours={next24} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WeatherSummaryCard weather={weatherData.current} daily={weatherData.daily} unit={temperatureUnit} />
        <BestTimeCard hours={next24} />
      </div>

      {/* ── Atmosphere ─────────────────────────────── */}
      <SectionLabel>Atmosphere</SectionLabel>

      <ExtendedStatsCard weather={weatherData.current} unit={temperatureUnit} daily={weatherData.daily} />

      {/* ── This Week ──────────────────────────────── */}
      <SectionLabel>This Week</SectionLabel>

      <WeekSparkline daily={weatherData.daily} unit={temperatureUnit} />
      <ForecastStrip daily={weatherData.daily} unit={temperatureUnit} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SunriseSunsetCard daily={weatherData.daily} timezone={weatherData.timezone} />
        <PrecipitationBarChart daily={weatherData.daily} timezone={weatherData.timezone} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MoonPhaseCard />
        <TomorrowCard daily={weatherData.daily} unit={temperatureUnit} timezone={weatherData.timezone} />
      </div>
    </>
  )
}
