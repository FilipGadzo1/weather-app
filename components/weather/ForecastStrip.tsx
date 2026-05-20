'use client'

import { useState } from 'react'
import type { DailyForecast, TemperatureUnit } from '@/types/weather'
import { getWmoInfo } from '@/lib/weather/wmo-codes'
import { toDisplayTemp } from '@/lib/store/weather-store'
import { WeatherIcon } from './WeatherIcon'
import { computeRangePosition } from '@/lib/weather/temp-range'
import { WindDirectionBadge } from './WindDirectionBadge'

interface ForecastStripProps {
  daily: DailyForecast[]
  unit: TemperatureUnit
}

function DayCard({
  day,
  unit,
  isSelected,
  onClick,
  weekMin,
  weekMax,
}: {
  day: DailyForecast
  unit: TemperatureUnit
  isSelected: boolean
  onClick: () => void
  weekMin: number
  weekMax: number
}) {
  const info = getWmoInfo(day.wmoCode)
  const date = new Date(day.date + 'T12:00:00')
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const rangePos =
    Number.isFinite(day.tempMin) && Number.isFinite(day.tempMax)
      ? computeRangePosition(day.tempMin, day.tempMax, weekMin, weekMax)
      : null

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all min-w-[90px]
        ${isSelected ? 'bg-white/20 border border-white/40' : 'glass-card-dark hover:bg-white/15'}`}
    >
      <span className="text-white/70 text-xs font-medium">{dayName}</span>
      <span className="text-white/50 text-xs">{monthDay}</span>
      <WeatherIcon iconKey={info.iconKey} size={28} />
      <span className="text-white/60 text-xs">{day.precipitationProbability}% 💧</span>
      {day.precipitationSum !== null && day.precipitationSum > 0 && (
        <span className="text-sky-300/70 text-xs">{day.precipitationSum.toFixed(1)}mm</span>
      )}
      {rangePos && (
        <div className="w-full h-1.5 bg-white/10 rounded-full relative overflow-hidden my-1">
          <div
            className="absolute top-0 h-full rounded-full bg-gradient-to-r from-sky-400/70 via-yellow-300/70 to-orange-400/80"
            style={{ left: `${rangePos.leftPct}%`, width: `${rangePos.widthPct}%` }}
          />
        </div>
      )}
      <div className="flex gap-1 text-sm font-semibold">
        <span className="text-white">{toDisplayTemp(day.tempMax, unit)}°</span>
        <span className="text-white/40">/</span>
        <span className="text-white/60">{toDisplayTemp(day.tempMin, unit)}°</span>
      </div>
    </button>
  )
}

export function ForecastStrip({ daily, unit }: ForecastStripProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const weekMin = daily.length ? Math.min(...daily.map(d => d.tempMin)) : 0
  const weekMax = daily.length ? Math.max(...daily.map(d => d.tempMax)) : 0

  const toggleDay = (index: number) => {
    setSelectedDay(selectedDay === index ? null : index)
  }

  return (
    <div className="glass-card p-4 md:p-6">
      <h2 className="text-white/80 text-sm font-medium uppercase tracking-wider mb-4">
        7-Day Forecast
      </h2>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {daily.map((day, i) => (
          <DayCard
            key={day.date}
            day={day}
            unit={unit}
            isSelected={selectedDay === i}
            onClick={() => toggleDay(i)}
            weekMin={weekMin}
            weekMax={weekMax}
          />
        ))}
      </div>

      {selectedDay !== null && daily[selectedDay]?.hourly.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <h3 className="text-white/60 text-xs uppercase tracking-wider mb-3">
            Hourly — {new Date(daily[selectedDay].date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {daily[selectedDay].hourly.map((hour) => {
              const info = getWmoInfo(hour.wmoCode)
              const time = new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
              return (
                <div key={hour.time} className="flex flex-col items-center gap-1 min-w-[56px] text-center">
                  <span className="text-white/50 text-xs">{time}</span>
                  <WeatherIcon iconKey={info.iconKey} size={20} />
                  <span className="text-white text-sm font-medium">{toDisplayTemp(hour.temperature, unit)}°</span>
                  <span className="text-white/40 text-xs">{hour.precipitationProbability}% 🌧</span>
                  <span className="text-white/40 text-xs">{Number.isFinite(hour.windSpeed) ? Math.round(hour.windSpeed) : 0} km/h</span>
                  <WindDirectionBadge degrees={hour.windDirection} />
                  <span className="text-white/40 text-xs">{Number.isFinite(hour.humidity) ? hour.humidity : 0}% 💧</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
