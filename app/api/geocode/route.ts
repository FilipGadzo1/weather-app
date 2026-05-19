import { NextRequest, NextResponse } from 'next/server'
import { geocodeCity } from '@/lib/weather/geocoding'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')
  if (!q || q.trim().length < 2) {
    return NextResponse.json([], { status: 200 })
  }
  try {
    const results = await geocodeCity(q.trim())
    return NextResponse.json(results)
  } catch {
    return NextResponse.json({ error: 'Geocoding failed' }, { status: 502 })
  }
}
