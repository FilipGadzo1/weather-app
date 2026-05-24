'use client'

import AirQualityCard from '@/components/weather/AirQualityCard'
import { UvIndexCard } from '@/components/weather/UvIndexCard'
import type { AirQualityData } from '@/types/weather'

interface CityInsightsProps {
  airQuality: AirQualityData | null
  uvIndex: number
}

export function CityInsights({ airQuality, uvIndex }: CityInsightsProps) {
  return (
    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
      {airQuality && <AirQualityCard data={airQuality} />}
      <UvIndexCard uvIndex={uvIndex} />
    </div>
  )
}
