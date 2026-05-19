import { NextRequest, NextResponse } from 'next/server'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse'

function round4(n: number): string {
  return n.toFixed(4)
}

export async function GET(request: NextRequest) {
  const latRaw = request.nextUrl.searchParams.get('lat')
  const lonRaw = request.nextUrl.searchParams.get('lon')

  if (!latRaw || !lonRaw) {
    return NextResponse.json({ error: 'lat and lon are required' }, { status: 400 })
  }

  const lat = parseFloat(latRaw)
  const lon = parseFloat(lonRaw)

  if (
    !Number.isFinite(lat) || !Number.isFinite(lon) ||
    lat < -90 || lat > 90 || lon < -180 || lon > 180
  ) {
    return NextResponse.json({ error: 'lat/lon out of range' }, { status: 400 })
  }

  const url =
    `${NOMINATIM_URL}?lat=${round4(lat)}&lon=${round4(lon)}` +
    `&format=json&zoom=10&addressdetails=1`

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Skye-Weather/1.0 (portfolio weather app)' },
      next: { revalidate: 86400 },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Reverse geocoding upstream error' },
        { status: 502 },
      )
    }

    const data = await res.json()
    const addr = data?.address ?? {}
    const name =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.county ||
      (typeof data?.display_name === 'string' ? data.display_name.split(',')[0]?.trim() : null)

    if (!name) {
      return NextResponse.json({ error: 'No city found at your location.' }, { status: 404 })
    }

    const country = addr.country ?? ''
    const SAFE_NAME = /^[\p{L}\p{N}\s'\-.,()]+$/u
    if (!SAFE_NAME.test(name) || !SAFE_NAME.test(country)) {
      return NextResponse.json({ error: 'No city found at your location.' }, { status: 404 })
    }

    return NextResponse.json({
      name,
      country,
      admin1: addr.state ?? addr.region ?? undefined,
    })
  } catch {
    return NextResponse.json({ error: 'Reverse geocoding failed' }, { status: 502 })
  }
}
