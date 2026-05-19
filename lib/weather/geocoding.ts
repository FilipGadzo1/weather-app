import type { GeoLocation } from '@/types/weather'

const BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search'

export function buildGeocodingUrl(query: string): string {
  return `${BASE_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseGeocodingResponse(data: any): GeoLocation[] {
  if (!data.results) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.results.map((r: any) => ({
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    lat: r.latitude,
    lon: r.longitude,
  }))
}

export async function geocodeCity(query: string): Promise<GeoLocation[]> {
  const url = buildGeocodingUrl(query)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Geocoding error: ${res.status}`)
  const data = await res.json()
  return parseGeocodingResponse(data)
}
