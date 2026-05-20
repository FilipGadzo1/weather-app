import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const latNum = Number(req.nextUrl.searchParams.get('lat'))
  const lonNum = Number(req.nextUrl.searchParams.get('lon'))
  if (!Number.isFinite(latNum) || !Number.isFinite(lonNum) ||
      latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
    return NextResponse.json({ error: 'Invalid lat/lon' }, { status: 400 })
  }

  const params = new URLSearchParams({
    latitude: String(latNum),
    longitude: String(lonNum),
    current: 'temperature_2m,weather_code,is_day',
    timezone: 'auto',
  })
  const url = `https://api.open-meteo.com/v1/forecast?${params}`

  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) throw new Error(`status ${res.status}`)
    const data = await res.json()
    const cur = data?.current
    if (!cur || typeof cur.temperature_2m !== 'number' || typeof cur.weather_code !== 'number') {
      return NextResponse.json({ error: 'Bad upstream response' }, { status: 502 })
    }
    return NextResponse.json({
      temperature: Math.round(cur.temperature_2m),
      wmoCode: cur.weather_code,
      isDay: cur.is_day === 1,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 502 })
  }
}
