import type { AirQualityData } from '@/types/weather'

const BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'

export function buildAirQualityUrl(lat: number, lon: number): string {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'us_aqi,pm2_5,pm10,european_aqi',
    timezone: 'auto',
  })
  return `${BASE_URL}?${params}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseAirQualityResponse(data: any): AirQualityData {
  const c = data?.current ?? {}
  const num = (v: unknown): number | null =>
    typeof v === 'number' && Number.isFinite(v) ? v : null
  return {
    usAqi: num(c.us_aqi),
    pm25: num(c.pm2_5),
    pm10: num(c.pm10),
    europeanAqi: num(c.european_aqi),
  }
}

export async function fetchAirQuality(
  lat: number,
  lon: number,
): Promise<AirQualityData | null> {
  try {
    const res = await fetch(buildAirQualityUrl(lat, lon), {
      next: { revalidate: 1800 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return parseAirQualityResponse(data)
  } catch {
    return null
  }
}
