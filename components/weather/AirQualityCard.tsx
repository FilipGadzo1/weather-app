import type { AirQualityData } from '@/types/weather'
import { getAqiCategory } from '@/lib/weather/aqi-scale'

interface AirQualityCardProps {
  data: AirQualityData
}

export default function AirQualityCard({ data }: AirQualityCardProps) {
  if (data.usAqi === null || data.usAqi < 0) return null

  const category = getAqiCategory(data.usAqi)

  return (
    <div className="glass-card p-6" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
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
      {/* AQI Progress bar */}
      <div className="mt-4">
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${category.barClass}`}
            style={{ width: `${Math.min(Math.max((data.usAqi / 500) * 100, 0), 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-white/40 text-xs">0</span>
          <span className="text-white/40 text-xs">250</span>
          <span className="text-white/40 text-xs">500</span>
        </div>
      </div>
    </div>
  )
}
