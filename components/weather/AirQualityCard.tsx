import { AirQualityData } from '@/types/weather'
import { getAqiCategory } from '@/lib/weather/aqi-scale'

interface AirQualityCardProps {
  data: AirQualityData
}

export default function AirQualityCard({ data }: AirQualityCardProps) {
  if (data.usAqi === null) return null

  const category = getAqiCategory(data.usAqi)

  return (
    <div className="glass-card p-6">
      <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider mb-4">
        Air Quality
      </h2>
      <div className="flex items-center gap-6">
        {/* Left: colored AQI badge */}
        <div className={`${category.bgClass} ${category.textClass} rounded-xl px-5 py-4 flex flex-col items-center min-w-[100px]`}>
          <span className="text-4xl font-bold leading-none">{data.usAqi}</span>
          <span className="text-xs font-medium mt-1 text-center">{category.label}</span>
        </div>
        {/* Right: PM stats */}
        <div className="flex gap-6">
          <div className="flex flex-col">
            <span className="text-white/50 text-xs uppercase tracking-wider">PM2.5</span>
            <span className="text-white text-xl font-semibold">
              {data.pm25 !== null ? data.pm25.toFixed(1) : '—'}
            </span>
            <span className="text-white/40 text-xs">µg/m³</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/50 text-xs uppercase tracking-wider">PM10</span>
            <span className="text-white text-xl font-semibold">
              {data.pm10 !== null ? data.pm10.toFixed(1) : '—'}
            </span>
            <span className="text-white/40 text-xs">µg/m³</span>
          </div>
        </div>
      </div>
    </div>
  )
}
