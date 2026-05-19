# Weather App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-quality weather app with Next.js 14, real Open-Meteo data, and Claude-powered Activity Advisor + Alert Explainer features.

**Architecture:** Next.js 14 App Router with Server Components for data fetching (city detail page fetches weather server-side) and Client Components for interactive UI (search, saved locations, Claude features). Claude API calls are proxied through Next.js API routes — never exposed to the client.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Zustand (localStorage persist), Framer Motion, @anthropic-ai/sdk, Open-Meteo API (no key), Jest + React Testing Library

---

## File Map

```
weather-app/
├── .env.local                              # ANTHROPIC_API_KEY (gitignored)
├── .env.example                            # Template
├── jest.config.ts
├── jest.setup.ts
│
├── app/
│   ├── layout.tsx                          # Root layout, fonts, metadata
│   ├── page.tsx                            # Home: search + saved locations
│   ├── globals.css                         # Base styles, CSS variables, animations
│   └── city/
│   │   └── [slug]/
│   │       └── page.tsx                    # City detail (server component, fetches weather)
│   └── api/
│       ├── geocode/route.ts                # GET ?q=city → [{name,lat,lon,country}]
│       ├── claude/activities/route.ts      # POST → streaming activity suggestions
│       └── claude/explain-alert/route.ts  # POST → plain-language alert explanation
│
├── components/
│   ├── search/SearchBar.tsx                # Debounced input + dropdown autocomplete
│   ├── weather/
│   │   ├── WeatherBackground.tsx          # Dynamic gradient + CSS particle animations
│   │   ├── WeatherCard.tsx                # Current conditions hero (glassmorphism)
│   │   ├── WeatherIcon.tsx                # SVG icon by WMO code
│   │   └── ForecastStrip.tsx              # 5-day cards + expandable hourly
│   ├── claude/
│   │   ├── ActivityAdvisor.tsx            # Streaming Claude activity suggestions
│   │   └── AlertExplainer.tsx             # Severe weather plain-language explainer
│   └── locations/SavedLocations.tsx       # Pinned city chips (localStorage)
│
├── lib/
│   ├── weather/
│   │   ├── open-meteo.ts                  # Open-Meteo forecast fetch
│   │   ├── geocoding.ts                   # Open-Meteo geocoding fetch
│   │   └── wmo-codes.ts                   # WMO code → label, severity, icon key
│   ├── claude/prompts.ts                  # Claude prompt builders
│   └── store/weather-store.ts             # Zustand store (currentCity, savedLocations, unit)
│
└── types/weather.ts                       # Shared TypeScript interfaces
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json` (via npx)
- Create: `jest.config.ts`
- Create: `jest.setup.ts`
- Create: `.env.example`

- [ ] **Step 1: Create Next.js app**

```bash
cd C:\Users\Filip\Desktop\projects\weather-app
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*"
```

When prompted: TypeScript=Yes, ESLint=Yes, Tailwind=Yes, src/ dir=No, App Router=Yes, import alias=Yes (@/*)

- [ ] **Step 2: Install dependencies**

```bash
npm install zustand framer-motion @anthropic-ai/sdk
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event ts-jest @types/jest
```

- [ ] **Step 3: Install shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted: Default style=Default, Base color=Slate, CSS variables=Yes.

Then add the components you'll need:

```bash
npx shadcn@latest add button card badge skeleton input
```

- [ ] **Step 4: Create jest.config.ts**

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default createJestConfig(config)
```

- [ ] **Step 5: Create jest.setup.ts**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Create .env.example**

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

- [ ] **Step 7: Create .env.local**

```
ANTHROPIC_API_KEY=<your actual key>
```

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Expected: Server running at http://localhost:3000 with default Next.js page.

- [ ] **Step 9: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold Next.js 14 weather app with shadcn, zustand, framer-motion"
```

---

## Task 2: TypeScript Types

**Files:**
- Create: `types/weather.ts`

- [ ] **Step 1: Create types/weather.ts**

```typescript
export interface GeoLocation {
  name: string
  country: string
  admin1?: string  // state/region
  lat: number
  lon: number
}

export interface CurrentWeather {
  temperature: number          // °C
  feelsLike: number            // °C
  humidity: number             // %
  windSpeed: number            // km/h
  windDirection: number        // degrees
  uvIndex: number
  visibility: number           // km
  wmoCode: number
  isDay: boolean
  precipitationProbability: number  // %
}

export interface DailyForecast {
  date: string                 // ISO date "2026-05-19"
  tempMax: number
  tempMin: number
  wmoCode: number
  precipitationProbability: number
  sunrise: string
  sunset: string
  hourly: HourlyForecast[]
}

export interface HourlyForecast {
  time: string                 // ISO datetime
  temperature: number
  wmoCode: number
  precipitationProbability: number
  windSpeed: number
}

export interface WeatherData {
  location: GeoLocation
  current: CurrentWeather
  daily: DailyForecast[]       // 7 days
  timezone: string
  hasSevereCondition: boolean  // true if current wmoCode >= 45
}

export interface WmoInfo {
  label: string
  description: string
  iconKey: string              // maps to WeatherIcon variants
  isSevere: boolean
}

export type TemperatureUnit = 'C' | 'F'
```

- [ ] **Step 2: Commit**

```bash
git add types/weather.ts
git commit -m "feat: add shared TypeScript weather types"
```

---

## Task 3: WMO Codes Utility

**Files:**
- Create: `lib/weather/wmo-codes.ts`
- Create: `lib/weather/__tests__/wmo-codes.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// lib/weather/__tests__/wmo-codes.test.ts
import { getWmoInfo, isSevereWmo, getBackgroundKey } from '../wmo-codes'

describe('getWmoInfo', () => {
  it('returns clear sky info for code 0', () => {
    const info = getWmoInfo(0)
    expect(info.label).toBe('Clear sky')
    expect(info.isSevere).toBe(false)
    expect(info.iconKey).toBe('clear')
  })

  it('returns thunderstorm info for code 95', () => {
    const info = getWmoInfo(95)
    expect(info.label).toContain('Thunderstorm')
    expect(info.isSevere).toBe(true)
  })

  it('returns fallback for unknown code', () => {
    const info = getWmoInfo(999)
    expect(info.label).toBe('Unknown')
  })
})

describe('isSevereWmo', () => {
  it('returns false for clear sky', () => expect(isSevereWmo(0)).toBe(false))
  it('returns true for fog (code 45)', () => expect(isSevereWmo(45)).toBe(true))
  it('returns true for thunderstorm (code 95)', () => expect(isSevereWmo(95)).toBe(true))
})

describe('getBackgroundKey', () => {
  it('returns "clear-day" for code 0 during day', () => {
    expect(getBackgroundKey(0, true)).toBe('clear-day')
  })
  it('returns "clear-night" for code 0 at night', () => {
    expect(getBackgroundKey(0, false)).toBe('clear-night')
  })
  it('returns "storm" for thunderstorm code', () => {
    expect(getBackgroundKey(95, true)).toBe('storm')
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npx jest lib/weather/__tests__/wmo-codes.test.ts
```

Expected: FAIL — cannot find module '../wmo-codes'

- [ ] **Step 3: Implement lib/weather/wmo-codes.ts**

```typescript
import type { WmoInfo } from '@/types/weather'

const WMO_MAP: Record<number, WmoInfo> = {
  0:  { label: 'Clear sky',              description: 'Clear skies', iconKey: 'clear',   isSevere: false },
  1:  { label: 'Mainly clear',           description: 'Mainly clear', iconKey: 'clear',  isSevere: false },
  2:  { label: 'Partly cloudy',          description: 'Some clouds', iconKey: 'cloudy',  isSevere: false },
  3:  { label: 'Overcast',              description: 'Overcast skies', iconKey: 'cloudy', isSevere: false },
  45: { label: 'Fog',                    description: 'Foggy conditions', iconKey: 'fog', isSevere: true  },
  48: { label: 'Icy fog',               description: 'Depositing rime fog', iconKey: 'fog', isSevere: true },
  51: { label: 'Light drizzle',         description: 'Light drizzle', iconKey: 'rain',   isSevere: false },
  53: { label: 'Moderate drizzle',      description: 'Moderate drizzle', iconKey: 'rain', isSevere: false },
  55: { label: 'Dense drizzle',         description: 'Dense drizzle', iconKey: 'rain',   isSevere: false },
  61: { label: 'Slight rain',           description: 'Slight rain', iconKey: 'rain',     isSevere: false },
  63: { label: 'Moderate rain',         description: 'Moderate rain', iconKey: 'rain',   isSevere: false },
  65: { label: 'Heavy rain',            description: 'Heavy rainfall', iconKey: 'rain',  isSevere: true  },
  71: { label: 'Slight snow',           description: 'Slight snowfall', iconKey: 'snow', isSevere: false },
  73: { label: 'Moderate snow',         description: 'Moderate snowfall', iconKey: 'snow', isSevere: false },
  75: { label: 'Heavy snow',            description: 'Heavy snowfall', iconKey: 'snow',  isSevere: true  },
  77: { label: 'Snow grains',           description: 'Snow grains', iconKey: 'snow',     isSevere: false },
  80: { label: 'Slight showers',        description: 'Slight rain showers', iconKey: 'rain', isSevere: false },
  81: { label: 'Moderate showers',      description: 'Moderate rain showers', iconKey: 'rain', isSevere: false },
  82: { label: 'Violent showers',       description: 'Violent rain showers', iconKey: 'rain', isSevere: true },
  85: { label: 'Slight snow showers',   description: 'Slight snow showers', iconKey: 'snow', isSevere: false },
  86: { label: 'Heavy snow showers',    description: 'Heavy snow showers', iconKey: 'snow', isSevere: true },
  95: { label: 'Thunderstorm',          description: 'Thunderstorm', iconKey: 'storm',   isSevere: true  },
  96: { label: 'Thunderstorm with hail', description: 'Thunderstorm with slight hail', iconKey: 'storm', isSevere: true },
  99: { label: 'Thunderstorm with heavy hail', description: 'Thunderstorm with heavy hail', iconKey: 'storm', isSevere: true },
}

const FALLBACK: WmoInfo = { label: 'Unknown', description: 'Unknown conditions', iconKey: 'clear', isSevere: false }

export function getWmoInfo(code: number): WmoInfo {
  return WMO_MAP[code] ?? FALLBACK
}

export function isSevereWmo(code: number): boolean {
  return getWmoInfo(code).isSevere
}

export function getBackgroundKey(code: number, isDay: boolean): string {
  if (code >= 95) return 'storm'
  if (code >= 71) return 'snow'
  if (code >= 51) return 'rain'
  if (code >= 45) return 'fog'
  if (code >= 2)  return 'cloudy'
  return isDay ? 'clear-day' : 'clear-night'
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npx jest lib/weather/__tests__/wmo-codes.test.ts
```

Expected: PASS — 6 tests pass

- [ ] **Step 5: Commit**

```bash
git add lib/weather/wmo-codes.ts lib/weather/__tests__/wmo-codes.test.ts
git commit -m "feat: add WMO code utility with severity detection"
```

---

## Task 4: Open-Meteo API Client

**Files:**
- Create: `lib/weather/open-meteo.ts`
- Create: `lib/weather/__tests__/open-meteo.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// lib/weather/__tests__/open-meteo.test.ts
import { buildForecastUrl, parseWeatherResponse } from '../open-meteo'

describe('buildForecastUrl', () => {
  it('builds correct URL with lat/lon', () => {
    const url = buildForecastUrl(51.5074, -0.1278)
    expect(url).toContain('latitude=51.5074')
    expect(url).toContain('longitude=-0.1278')
    expect(url).toContain('current=')
    expect(url).toContain('daily=')
    expect(url).toContain('hourly=')
  })
})

describe('parseWeatherResponse', () => {
  const mockLocation = { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 }

  it('parses current weather correctly', () => {
    const mockApiResponse = {
      timezone: 'Europe/London',
      current: {
        temperature_2m: 18,
        apparent_temperature: 16,
        relative_humidity_2m: 70,
        wind_speed_10m: 15,
        wind_direction_10m: 270,
        uv_index: 3,
        visibility: 10000,
        weather_code: 2,
        is_day: 1,
        precipitation_probability: 10,
      },
      daily: {
        time: ['2026-05-19'],
        temperature_2m_max: [20],
        temperature_2m_min: [12],
        weather_code: [2],
        precipitation_probability_max: [10],
        sunrise: ['2026-05-19T05:30'],
        sunset: ['2026-05-19T21:00'],
      },
      hourly: {
        time: ['2026-05-19T00:00'],
        temperature_2m: [15],
        weather_code: [2],
        precipitation_probability: [5],
        wind_speed_10m: [10],
      },
    }

    const result = parseWeatherResponse(mockApiResponse, mockLocation)
    expect(result.current.temperature).toBe(18)
    expect(result.current.wmoCode).toBe(2)
    expect(result.current.isDay).toBe(true)
    expect(result.daily).toHaveLength(1)
    expect(result.daily[0].tempMax).toBe(20)
    expect(result.hasSevereCondition).toBe(false)
  })

  it('detects severe condition for thunderstorm', () => {
    const mockApiResponse = {
      timezone: 'Europe/London',
      current: {
        temperature_2m: 22,
        apparent_temperature: 20,
        relative_humidity_2m: 85,
        wind_speed_10m: 40,
        wind_direction_10m: 180,
        uv_index: 1,
        visibility: 3000,
        weather_code: 95,
        is_day: 1,
        precipitation_probability: 90,
      },
      daily: {
        time: ['2026-05-19'],
        temperature_2m_max: [23],
        temperature_2m_min: [18],
        weather_code: [95],
        precipitation_probability_max: [90],
        sunrise: ['2026-05-19T05:30'],
        sunset: ['2026-05-19T21:00'],
      },
      hourly: { time: [], temperature_2m: [], weather_code: [], precipitation_probability: [], wind_speed_10m: [] },
    }
    const result = parseWeatherResponse(mockApiResponse, mockLocation)
    expect(result.hasSevereCondition).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npx jest lib/weather/__tests__/open-meteo.test.ts
```

Expected: FAIL — cannot find module

- [ ] **Step 3: Implement lib/weather/open-meteo.ts**

```typescript
import type { GeoLocation, WeatherData, DailyForecast, HourlyForecast } from '@/types/weather'
import { isSevereWmo } from './wmo-codes'

const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

const CURRENT_PARAMS = [
  'temperature_2m', 'apparent_temperature', 'relative_humidity_2m',
  'wind_speed_10m', 'wind_direction_10m', 'uv_index', 'visibility',
  'weather_code', 'is_day', 'precipitation_probability',
].join(',')

const DAILY_PARAMS = [
  'temperature_2m_max', 'temperature_2m_min', 'weather_code',
  'precipitation_probability_max', 'sunrise', 'sunset',
].join(',')

const HOURLY_PARAMS = [
  'temperature_2m', 'weather_code', 'precipitation_probability', 'wind_speed_10m',
].join(',')

export function buildForecastUrl(lat: number, lon: number): string {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: CURRENT_PARAMS,
    daily: DAILY_PARAMS,
    hourly: HOURLY_PARAMS,
    forecast_days: '7',
    timezone: 'auto',
    wind_speed_unit: 'kmh',
  })
  return `${BASE_URL}?${params}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseWeatherResponse(data: any, location: GeoLocation): WeatherData {
  const c = data.current

  const hourlyByDay: Record<string, HourlyForecast[]> = {}
  data.hourly.time.forEach((time: string, i: number) => {
    const day = time.split('T')[0]
    if (!hourlyByDay[day]) hourlyByDay[day] = []
    hourlyByDay[day].push({
      time,
      temperature: data.hourly.temperature_2m[i],
      wmoCode: data.hourly.weather_code[i],
      precipitationProbability: data.hourly.precipitation_probability[i],
      windSpeed: data.hourly.wind_speed_10m[i],
    })
  })

  const daily: DailyForecast[] = data.daily.time.map((date: string, i: number) => ({
    date,
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i],
    wmoCode: data.daily.weather_code[i],
    precipitationProbability: data.daily.precipitation_probability_max[i],
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i],
    hourly: hourlyByDay[date] ?? [],
  }))

  return {
    location,
    current: {
      temperature: c.temperature_2m,
      feelsLike: c.apparent_temperature,
      humidity: c.relative_humidity_2m,
      windSpeed: c.wind_speed_10m,
      windDirection: c.wind_direction_10m,
      uvIndex: c.uv_index,
      visibility: Math.round(c.visibility / 1000),
      wmoCode: c.weather_code,
      isDay: c.is_day === 1,
      precipitationProbability: c.precipitation_probability,
    },
    daily,
    timezone: data.timezone,
    hasSevereCondition: isSevereWmo(c.weather_code),
  }
}

export async function fetchWeather(lat: number, lon: number, location: GeoLocation): Promise<WeatherData> {
  const url = buildForecastUrl(lat, lon)
  const res = await fetch(url, { next: { revalidate: 1800 } })  // 30-min cache
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`)
  const data = await res.json()
  return parseWeatherResponse(data, location)
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npx jest lib/weather/__tests__/open-meteo.test.ts
```

Expected: PASS — 3 tests pass

- [ ] **Step 5: Commit**

```bash
git add lib/weather/open-meteo.ts lib/weather/__tests__/open-meteo.test.ts
git commit -m "feat: add Open-Meteo API client with response parser"
```

---

## Task 5: Geocoding Client

**Files:**
- Create: `lib/weather/geocoding.ts`
- Create: `lib/weather/__tests__/geocoding.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// lib/weather/__tests__/geocoding.test.ts
import { buildGeocodingUrl, parseGeocodingResponse } from '../geocoding'

describe('buildGeocodingUrl', () => {
  it('builds correct URL', () => {
    const url = buildGeocodingUrl('London')
    expect(url).toContain('name=London')
    expect(url).toContain('count=5')
  })
})

describe('parseGeocodingResponse', () => {
  it('parses results correctly', () => {
    const mockResponse = {
      results: [
        { name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.5074, longitude: -0.1278 },
        { name: 'London', country: 'Canada', admin1: 'Ontario', latitude: 42.9849, longitude: -81.2453 },
      ],
    }
    const results = parseGeocodingResponse(mockResponse)
    expect(results).toHaveLength(2)
    expect(results[0].name).toBe('London')
    expect(results[0].lat).toBe(51.5074)
    expect(results[0].country).toBe('United Kingdom')
  })

  it('returns empty array when no results', () => {
    expect(parseGeocodingResponse({})).toEqual([])
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npx jest lib/weather/__tests__/geocoding.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement lib/weather/geocoding.ts**

```typescript
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
```

- [ ] **Step 4: Run tests**

```bash
npx jest lib/weather/__tests__/geocoding.test.ts
```

Expected: PASS — 3 tests pass

- [ ] **Step 5: Commit**

```bash
git add lib/weather/geocoding.ts lib/weather/__tests__/geocoding.test.ts
git commit -m "feat: add geocoding client for city search"
```

---

## Task 6: Zustand Store

**Files:**
- Create: `lib/store/weather-store.ts`

- [ ] **Step 1: Create lib/store/weather-store.ts**

```typescript
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GeoLocation, TemperatureUnit } from '@/types/weather'

interface WeatherStore {
  currentCity: GeoLocation | null
  savedLocations: GeoLocation[]
  temperatureUnit: TemperatureUnit
  setCurrentCity: (city: GeoLocation) => void
  addSavedLocation: (city: GeoLocation) => void
  removeSavedLocation: (name: string) => void
  toggleTemperatureUnit: () => void
  isSaved: (name: string) => boolean
}

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set, get) => ({
      currentCity: null,
      savedLocations: [],
      temperatureUnit: 'C',
      setCurrentCity: (city) => set({ currentCity: city }),
      addSavedLocation: (city) => {
        const existing = get().savedLocations
        if (existing.length >= 5) return
        if (existing.some((s) => s.name === city.name)) return
        set({ savedLocations: [...existing, city] })
      },
      removeSavedLocation: (name) =>
        set({ savedLocations: get().savedLocations.filter((s) => s.name !== name) }),
      toggleTemperatureUnit: () =>
        set({ temperatureUnit: get().temperatureUnit === 'C' ? 'F' : 'C' }),
      isSaved: (name) => get().savedLocations.some((s) => s.name === name),
    }),
    { name: 'weather-app-storage' }
  )
)

export function toDisplayTemp(celsius: number, unit: TemperatureUnit): number {
  return unit === 'F' ? Math.round((celsius * 9) / 5 + 32) : Math.round(celsius)
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/store/weather-store.ts
git commit -m "feat: add Zustand store for city state and saved locations"
```

---

## Task 7: Geocoding API Route

**Files:**
- Create: `app/api/geocode/route.ts`

- [ ] **Step 1: Create app/api/geocode/route.ts**

```typescript
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
```

- [ ] **Step 2: Verify route works**

Start dev server (`npm run dev`) and open:
```
http://localhost:3000/api/geocode?q=London
```

Expected: JSON array with London entries (name, lat, lon, country).

- [ ] **Step 3: Commit**

```bash
git add app/api/geocode/route.ts
git commit -m "feat: add geocoding API route"
```

---

## Task 8: Claude Prompts

**Files:**
- Create: `lib/claude/prompts.ts`

- [ ] **Step 1: Create lib/claude/prompts.ts**

```typescript
import type { CurrentWeather, GeoLocation } from '@/types/weather'
import { getWmoInfo } from '@/lib/weather/wmo-codes'

export function buildActivityPrompt(location: GeoLocation, weather: CurrentWeather): string {
  const condition = getWmoInfo(weather.wmoCode)
  const tempStr = `${Math.round(weather.temperature)}°C (feels like ${Math.round(weather.feelsLike)}°C)`

  return `You are a friendly local guide for ${location.name}, ${location.country}.

Current weather: ${condition.label}. Temperature: ${tempStr}. Wind: ${weather.windSpeed} km/h. 
Humidity: ${weather.humidity}%. UV Index: ${weather.uvIndex}. 
Precipitation chance: ${weather.precipitationProbability}%.

Suggest 5 activities that are perfect for this weather right now. For each activity:
- Give it a catchy name (2-4 words)
- Write one sentence explaining why it's ideal for this specific weather
- Add a relevant emoji

Format as a numbered list. Be specific to the weather conditions — don't suggest outdoor activities in heavy rain, don't suggest indoor activities on a perfect sunny day. Be enthusiastic and practical.`
}

export function buildAlertPrompt(location: GeoLocation, weather: CurrentWeather): string {
  const condition = getWmoInfo(weather.wmoCode)

  return `You are a friendly but clear safety advisor.

Location: ${location.name}, ${location.country}
Severe weather condition: ${condition.label}
Temperature: ${Math.round(weather.temperature)}°C, Wind: ${weather.windSpeed} km/h, Visibility: ${weather.visibility} km

Explain this weather condition in plain language. Cover:
1. What exactly is happening with the weather (1-2 sentences, no jargon)
2. What people should avoid doing right now
3. What people should do to stay safe
4. How long this type of condition typically lasts

Keep it under 150 words. Be direct and helpful, not alarmist.`
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/claude/prompts.ts
git commit -m "feat: add Claude prompt builders for activity advisor and alert explainer"
```

---

## Task 9: Claude API Routes

**Files:**
- Create: `app/api/claude/activities/route.ts`
- Create: `app/api/claude/explain-alert/route.ts`

- [ ] **Step 1: Create activities route (streaming)**

```typescript
// app/api/claude/activities/route.ts
import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildActivityPrompt } from '@/lib/claude/prompts'
import type { GeoLocation, CurrentWeather } from '@/types/weather'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  const body = await request.json() as { location: GeoLocation; weather: CurrentWeather }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await anthropic.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 600,
          messages: [{
            role: 'user',
            content: buildActivityPrompt(body.location, body.weather),
          }],
        })

        for await (const chunk of response) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
      } catch (err) {
        controller.enqueue(encoder.encode('\n[Error generating suggestions]'))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
```

- [ ] **Step 2: Create explain-alert route**

```typescript
// app/api/claude/explain-alert/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildAlertPrompt } from '@/lib/claude/prompts'
import type { GeoLocation, CurrentWeather } from '@/types/weather'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  const body = await request.json() as { location: GeoLocation; weather: CurrentWeather }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: buildAlertPrompt(body.location, body.weather),
      }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return NextResponse.json({ explanation: text })
  } catch {
    return NextResponse.json({ error: 'Claude API unavailable' }, { status: 502 })
  }
}
```

- [ ] **Step 3: Verify routes exist**

```bash
npm run dev
```

Confirm no TypeScript errors in terminal.

- [ ] **Step 4: Commit**

```bash
git add app/api/claude/
git commit -m "feat: add Claude streaming activities route and alert explainer route"
```

---

## Task 10: Global Styles and WeatherBackground

**Files:**
- Modify: `app/globals.css`
- Create: `components/weather/WeatherBackground.tsx`

- [ ] **Step 1: Update app/globals.css**

Replace the entire file with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-from: #0f172a;
  --bg-to: #1e293b;
}

body {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-from), var(--bg-to));
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes drift {
  from { transform: translateX(-10%); }
  to   { transform: translateX(110%); }
}

@keyframes rain-fall {
  from { transform: translateY(-100px) rotate(20deg); opacity: 0; }
  to   { transform: translateY(100vh) rotate(20deg); opacity: 0.6; }
}

@keyframes snow-fall {
  0%   { transform: translateY(-20px) translateX(0px); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 0.8; }
  100% { transform: translateY(100vh) translateX(30px); opacity: 0; }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 0.8; }
}

.glass-card {
  @apply backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl;
}

.glass-card-dark {
  @apply backdrop-blur-md bg-black/20 border border-white/10 rounded-2xl;
}
```

- [ ] **Step 2: Create components/weather/WeatherBackground.tsx**

```tsx
'use client'

import { useMemo } from 'react'

interface WeatherBackgroundProps {
  backgroundKey: string
  children: React.ReactNode
}

const BG_STYLES: Record<string, { from: string; to: string; via?: string }> = {
  'clear-day':   { from: '#0ea5e9', via: '#38bdf8', to: '#7dd3fc' },
  'clear-night': { from: '#0f172a', via: '#1e1b4b', to: '#312e81' },
  cloudy:        { from: '#334155', via: '#475569', to: '#64748b' },
  fog:           { from: '#374151', via: '#4b5563', to: '#6b7280' },
  rain:          { from: '#164e63', via: '#0e7490', to: '#155e75' },
  snow:          { from: '#bfdbfe', via: '#e0f2fe', to: '#f0f9ff' },
  storm:         { from: '#1c1917', via: '#292524', to: '#44403c' },
}

function RainParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-px bg-blue-300/40"
          style={{
            left: `${Math.random() * 100}%`,
            height: `${20 + Math.random() * 30}px`,
            animationName: 'rain-fall',
            animationDuration: `${0.6 + Math.random() * 0.8}s`,
            animationDelay: `${Math.random() * 2}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
          }}
        />
      ))}
    </div>
  )
}

function SnowParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-white/60"
          style={{
            left: `${Math.random() * 100}%`,
            animationName: 'snow-fall',
            animationDuration: `${3 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 5}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
          }}
        />
      ))}
    </div>
  )
}

function SunGlow() {
  return (
    <div
      className="absolute top-0 right-0 w-96 h-96 rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)',
        animationName: 'pulse-glow',
        animationDuration: '4s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'ease-in-out',
      }}
    />
  )
}

export function WeatherBackground({ backgroundKey, children }: WeatherBackgroundProps) {
  const style = BG_STYLES[backgroundKey] ?? BG_STYLES['clear-day']

  const gradient = useMemo(() => {
    if (style.via) {
      return `linear-gradient(135deg, ${style.from}, ${style.via}, ${style.to})`
    }
    return `linear-gradient(135deg, ${style.from}, ${style.to})`
  }, [style])

  return (
    <div className="relative min-h-screen" style={{ background: gradient }}>
      {backgroundKey === 'rain' && <RainParticles />}
      {backgroundKey === 'snow' && <SnowParticles />}
      {backgroundKey === 'clear-day' && <SunGlow />}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
```

- [ ] **Step 3: Verify no TypeScript errors**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css components/weather/WeatherBackground.tsx
git commit -m "feat: add global styles, glassmorphism utilities, and WeatherBackground with animations"
```

---

## Task 11: WeatherIcon Component

**Files:**
- Create: `components/weather/WeatherIcon.tsx`

- [ ] **Step 1: Create components/weather/WeatherIcon.tsx**

```tsx
interface WeatherIconProps {
  iconKey: string
  size?: number
  className?: string
}

const ICONS: Record<string, string> = {
  clear: '☀️',
  cloudy: '⛅',
  fog: '🌫️',
  rain: '🌧️',
  snow: '❄️',
  storm: '⛈️',
}

export function WeatherIcon({ iconKey, size = 48, className = '' }: WeatherIconProps) {
  const emoji = ICONS[iconKey] ?? '🌤️'
  return (
    <span
      className={`inline-block select-none ${className}`}
      style={{ fontSize: size }}
      role="img"
      aria-label={iconKey}
    >
      {emoji}
    </span>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/weather/WeatherIcon.tsx
git commit -m "feat: add WeatherIcon component"
```

---

## Task 12: WeatherCard Component

**Files:**
- Create: `components/weather/WeatherCard.tsx`

- [ ] **Step 1: Create components/weather/WeatherCard.tsx**

```tsx
import type { CurrentWeather, GeoLocation, TemperatureUnit } from '@/types/weather'
import { getWmoInfo } from '@/lib/weather/wmo-codes'
import { toDisplayTemp } from '@/lib/store/weather-store'
import { WeatherIcon } from './WeatherIcon'

interface WeatherCardProps {
  location: GeoLocation
  weather: CurrentWeather
  unit: TemperatureUnit
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 p-3 glass-card-dark">
      <span className="text-xs text-white/60 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  )
}

export function WeatherCard({ location, weather, unit }: WeatherCardProps) {
  const info = getWmoInfo(weather.wmoCode)
  const temp = toDisplayTemp(weather.temperature, unit)
  const feelsLike = toDisplayTemp(weather.feelsLike, unit)

  const windDirs = ['N','NE','E','SE','S','SW','W','NW']
  const windDir = windDirs[Math.round(weather.windDirection / 45) % 8]

  return (
    <div className="glass-card p-6 md:p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {location.name}
          </h1>
          <p className="text-white/70 text-sm mt-0.5">
            {location.admin1 ? `${location.admin1}, ` : ''}{location.country}
          </p>
          <p className="text-white/80 mt-2 text-base">{info.label}</p>
        </div>
        <WeatherIcon iconKey={info.iconKey} size={64} />
      </div>

      <div className="mt-4 flex items-end gap-3">
        <span className="text-7xl md:text-8xl font-thin text-white leading-none">
          {temp}°
        </span>
        <span className="text-3xl text-white/60 mb-2">{unit}</span>
      </div>

      <p className="text-white/60 text-sm mt-1">
        Feels like {feelsLike}°{unit}
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-6">
        <StatPill label="Humidity" value={`${weather.humidity}%`} />
        <StatPill label="Wind" value={`${weather.windSpeed} km/h ${windDir}`} />
        <StatPill label="UV" value={String(weather.uvIndex)} />
        <StatPill label="Visibility" value={`${weather.visibility} km`} />
        <StatPill label="Precip." value={`${weather.precipitationProbability}%`} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/weather/WeatherCard.tsx
git commit -m "feat: add WeatherCard hero component with glassmorphism design"
```

---

## Task 13: ForecastStrip Component

**Files:**
- Create: `components/weather/ForecastStrip.tsx`

- [ ] **Step 1: Create components/weather/ForecastStrip.tsx**

```tsx
'use client'

import { useState } from 'react'
import type { DailyForecast, TemperatureUnit } from '@/types/weather'
import { getWmoInfo } from '@/lib/weather/wmo-codes'
import { toDisplayTemp } from '@/lib/store/weather-store'
import { WeatherIcon } from './WeatherIcon'

interface ForecastStripProps {
  daily: DailyForecast[]
  unit: TemperatureUnit
}

function DayCard({
  day,
  unit,
  isSelected,
  onClick,
}: {
  day: DailyForecast
  unit: TemperatureUnit
  isSelected: boolean
  onClick: () => void
}) {
  const info = getWmoInfo(day.wmoCode)
  const date = new Date(day.date + 'T12:00:00')
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

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
                  <span className="text-white/40 text-xs">{hour.precipitationProbability}%</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/weather/ForecastStrip.tsx
git commit -m "feat: add ForecastStrip with 7-day cards and expandable hourly view"
```

---

## Task 14: SearchBar Component

**Files:**
- Create: `components/search/SearchBar.tsx`

- [ ] **Step 1: Create components/search/SearchBar.tsx**

```tsx
'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { GeoLocation } from '@/types/weather'
import { useWeatherStore } from '@/lib/store/weather-store'

let debounceTimer: ReturnType<typeof setTimeout>

export function SearchBar({ placeholder = 'Search city...' }: { placeholder?: string }) {
  const router = useRouter()
  const setCurrentCity = useWeatherStore((s) => s.setCurrentCity)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeoLocation[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const search = useCallback((q: string) => {
    clearTimeout(debounceTimer)
    if (q.trim().length < 2) { setResults([]); setOpen(false); return }
    debounceTimer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setResults(data)
        setOpen(data.length > 0)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [])

  const selectCity = useCallback((city: GeoLocation) => {
    setCurrentCity(city)
    setQuery(city.name)
    setOpen(false)
    const slug = encodeURIComponent(city.name.toLowerCase().replace(/\s+/g, '-'))
    router.push(`/city/${slug}?lat=${city.lat}&lon=${city.lon}&name=${encodeURIComponent(city.name)}&country=${encodeURIComponent(city.country)}${city.admin1 ? `&admin1=${encodeURIComponent(city.admin1)}` : ''}`)
  }, [router, setCurrentCity])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.closest('.search-container')?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="search-container relative w-full max-w-lg">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-lg">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); search(e.target.value) }}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 glass-card text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30 text-lg transition-all"
        />
        {loading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 animate-spin text-sm">⏳</span>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full glass-card overflow-hidden z-50 shadow-2xl">
          {results.map((city, i) => (
            <button
              key={`${city.name}-${city.lat}-${i}`}
              onClick={() => selectCity(city)}
              className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/10 last:border-0"
            >
              <span className="text-white font-medium">{city.name}</span>
              {city.admin1 && <span className="text-white/60 text-sm ml-2">{city.admin1},</span>}
              <span className="text-white/60 text-sm ml-2">{city.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/search/SearchBar.tsx
git commit -m "feat: add SearchBar with debounced autocomplete and city navigation"
```

---

## Task 15: SavedLocations Component

**Files:**
- Create: `components/locations/SavedLocations.tsx`

- [ ] **Step 1: Create components/locations/SavedLocations.tsx**

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { useWeatherStore } from '@/lib/store/weather-store'
import type { GeoLocation } from '@/types/weather'

export function SavedLocations() {
  const router = useRouter()
  const { savedLocations, removeSavedLocation } = useWeatherStore()

  if (savedLocations.length === 0) return null

  const navigate = (city: GeoLocation) => {
    const slug = encodeURIComponent(city.name.toLowerCase().replace(/\s+/g, '-'))
    router.push(`/city/${slug}?lat=${city.lat}&lon=${city.lon}&name=${encodeURIComponent(city.name)}&country=${encodeURIComponent(city.country)}${city.admin1 ? `&admin1=${encodeURIComponent(city.admin1)}` : ''}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-white/50 text-sm self-center mr-1">Saved:</span>
      {savedLocations.map((city) => (
        <div
          key={city.name}
          className="flex items-center gap-1 glass-card-dark px-3 py-1.5 group"
        >
          <button
            onClick={() => navigate(city)}
            className="text-white text-sm font-medium hover:text-white/80 transition-colors"
          >
            📍 {city.name}
          </button>
          <button
            onClick={() => removeSavedLocation(city.name)}
            className="text-white/30 hover:text-white/70 text-xs ml-1 transition-colors"
            aria-label={`Remove ${city.name}`}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/locations/SavedLocations.tsx
git commit -m "feat: add SavedLocations chip bar with navigation and removal"
```

---

## Task 16: ActivityAdvisor Component

**Files:**
- Create: `components/claude/ActivityAdvisor.tsx`

- [ ] **Step 1: Create components/claude/ActivityAdvisor.tsx**

```tsx
'use client'

import { useState } from 'react'
import type { GeoLocation, CurrentWeather } from '@/types/weather'

interface ActivityAdvisorProps {
  location: GeoLocation
  weather: CurrentWeather
}

export function ActivityAdvisor({ location, weather }: ActivityAdvisorProps) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)

  const fetchActivities = async () => {
    setLoading(true)
    setStarted(true)
    setText('')

    try {
      const res = await fetch('/api/claude/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, weather }),
      })

      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setText((prev) => prev + decoder.decode(value, { stream: true }))
      }
    } catch {
      setText('Unable to generate activity suggestions right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-white font-semibold text-lg">Activity Advisor</h2>
          <p className="text-white/60 text-sm">Powered by Claude AI</p>
        </div>
        <span className="text-2xl">🎯</span>
      </div>

      {!started ? (
        <div className="text-center py-4">
          <p className="text-white/60 text-sm mb-4">
            Get personalized activity suggestions based on today's weather in {location.name}.
          </p>
          <button
            onClick={fetchActivities}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-medium rounded-xl transition-colors"
          >
            ✨ Suggest Activities for Today
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {loading && !text && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 glass-card-dark rounded-xl animate-pulse" />
              ))}
            </div>
          )}
          {text && (
            <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
              {text}
              {loading && <span className="inline-block w-1 h-4 bg-white/70 animate-pulse ml-0.5" />}
            </div>
          )}
          {!loading && text && (
            <button
              onClick={fetchActivities}
              className="mt-3 text-white/50 text-xs hover:text-white/80 transition-colors"
            >
              ↺ Refresh suggestions
            </button>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/claude/ActivityAdvisor.tsx
git commit -m "feat: add ActivityAdvisor with Claude streaming and skeleton loading"
```

---

## Task 17: AlertExplainer Component

**Files:**
- Create: `components/claude/AlertExplainer.tsx`

- [ ] **Step 1: Create components/claude/AlertExplainer.tsx**

```tsx
'use client'

import { useState } from 'react'
import type { GeoLocation, CurrentWeather } from '@/types/weather'
import { getWmoInfo } from '@/lib/weather/wmo-codes'

interface AlertExplainerProps {
  location: GeoLocation
  weather: CurrentWeather
}

export function AlertExplainer({ location, weather }: AlertExplainerProps) {
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const info = getWmoInfo(weather.wmoCode)

  const fetchExplanation = async () => {
    if (explanation) { setExpanded(true); return }
    setLoading(true)
    setExpanded(true)
    try {
      const res = await fetch('/api/claude/explain-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, weather }),
      })
      const data = await res.json()
      setExplanation(data.explanation ?? data.error ?? 'Unable to fetch explanation.')
    } catch {
      setExplanation('Unable to fetch explanation right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card border-l-4 border-amber-400 p-4 md:p-6">
      <button
        onClick={fetchExplanation}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="text-left">
            <p className="text-amber-300 font-semibold text-sm uppercase tracking-wide">Severe Weather Advisory</p>
            <p className="text-white font-medium">{info.label}</p>
          </div>
        </div>
        <span className="text-white/50 text-lg">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/10">
          {loading ? (
            <div className="space-y-2">
              <div className="h-4 glass-card-dark rounded animate-pulse w-3/4" />
              <div className="h-4 glass-card-dark rounded animate-pulse w-full" />
              <div className="h-4 glass-card-dark rounded animate-pulse w-2/3" />
            </div>
          ) : (
            <p className="text-white/80 text-sm leading-relaxed">{explanation}</p>
          )}
          <p className="text-white/40 text-xs mt-3">Explained by Claude AI</p>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/claude/AlertExplainer.tsx
git commit -m "feat: add AlertExplainer collapsible component with Claude explanation"
```

---

## Task 18: Home Page

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Skye — Weather & Activities',
  description: 'Real-time weather with AI-powered activity suggestions',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Update app/page.tsx**

```tsx
import { SearchBar } from '@/components/search/SearchBar'
import { SavedLocations } from '@/components/locations/SavedLocations'
import { WeatherBackground } from '@/components/weather/WeatherBackground'

export default function HomePage() {
  return (
    <WeatherBackground backgroundKey="clear-night">
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">
              🌤 Skye
            </h1>
            <p className="text-white/60 text-lg">
              Weather intelligence, powered by AI
            </p>
          </div>

          <SearchBar placeholder="Search for any city..." />

          <SavedLocations />

          <p className="text-center text-white/30 text-sm">
            Search a city to see the forecast + AI activity suggestions
          </p>
        </div>
      </div>
    </WeatherBackground>
  )
}
```

- [ ] **Step 3: Verify home page renders**

```bash
npm run dev
```

Open http://localhost:3000 — expect: dark night-sky gradient, "Skye" heading, search bar. No errors in console.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat: add home page with hero search and app layout"
```

---

## Task 19: City Detail Page

**Files:**
- Create: `app/city/[slug]/page.tsx`

- [ ] **Step 1: Create app/city/[slug]/page.tsx**

```tsx
import { notFound } from 'next/navigation'
import { fetchWeather } from '@/lib/weather/open-meteo'
import { getBackgroundKey } from '@/lib/weather/wmo-codes'
import { WeatherBackground } from '@/components/weather/WeatherBackground'
import { WeatherCard } from '@/components/weather/WeatherCard'
import { ForecastStrip } from '@/components/weather/ForecastStrip'
import { ActivityAdvisor } from '@/components/claude/ActivityAdvisor'
import { AlertExplainer } from '@/components/claude/AlertExplainer'
import { CityPageClient } from './CityPageClient'
import type { GeoLocation } from '@/types/weather'

interface PageProps {
  params: { slug: string }
  searchParams: { lat?: string; lon?: string; name?: string; country?: string; admin1?: string }
}

export default async function CityPage({ searchParams }: PageProps) {
  const { lat, lon, name, country, admin1 } = searchParams

  if (!lat || !lon || !name || !country) {
    notFound()
  }

  const location: GeoLocation = {
    name: decodeURIComponent(name),
    country: decodeURIComponent(country),
    admin1: admin1 ? decodeURIComponent(admin1) : undefined,
    lat: parseFloat(lat),
    lon: parseFloat(lon),
  }

  let weatherData
  try {
    weatherData = await fetchWeather(location.lat, location.lon, location)
  } catch {
    return (
      <WeatherBackground backgroundKey="cloudy">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="glass-card p-8 text-center max-w-md">
            <p className="text-4xl mb-4">⚠️</p>
            <h2 className="text-white text-xl font-semibold mb-2">Weather data unavailable</h2>
            <p className="text-white/60 text-sm">Unable to fetch forecast for {location.name}. Please try again.</p>
            <a href="/" className="mt-4 inline-block text-sky-400 hover:text-sky-300 text-sm">← Back to search</a>
          </div>
        </div>
      </WeatherBackground>
    )
  }

  const bgKey = getBackgroundKey(weatherData.current.wmoCode, weatherData.current.isDay)

  return (
    <WeatherBackground backgroundKey={bgKey}>
      <div className="min-h-screen px-4 py-6 max-w-3xl mx-auto">
        {/* Header nav */}
        <div className="flex items-center justify-between mb-6">
          <a href="/" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1">
            ← Search
          </a>
          <CityPageClient location={location} />
        </div>

        <div className="space-y-4">
          <WeatherCard
            location={weatherData.location}
            weather={weatherData.current}
            unit="C"
          />

          {weatherData.hasSevereCondition && (
            <AlertExplainer location={location} weather={weatherData.current} />
          )}

          <ForecastStrip daily={weatherData.daily} unit="C" />

          <ActivityAdvisor location={location} weather={weatherData.current} />
        </div>
      </div>
    </WeatherBackground>
  )
}
```

- [ ] **Step 2: Create app/city/[slug]/CityPageClient.tsx**

This is a small client component for the pin button (needs Zustand):

```tsx
'use client'

import { useWeatherStore } from '@/lib/store/weather-store'
import type { GeoLocation } from '@/types/weather'

export function CityPageClient({ location }: { location: GeoLocation }) {
  const { isSaved, addSavedLocation, removeSavedLocation } = useWeatherStore()
  const saved = isSaved(location.name)

  return (
    <button
      onClick={() => saved ? removeSavedLocation(location.name) : addSavedLocation(location)}
      className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all
        ${saved ? 'glass-card text-amber-300 hover:text-white' : 'glass-card-dark text-white/60 hover:text-white'}`}
    >
      {saved ? '📍 Saved' : '+ Save location'}
    </button>
  )
}
```

- [ ] **Step 3: Test the full flow**

```bash
npm run dev
```

1. Open http://localhost:3000
2. Type "London" in the search bar
3. Select "London, England, United Kingdom"
4. Verify: redirected to `/city/london?lat=...&lon=...`
5. Verify: WeatherCard shows London weather with temperature and stats
6. Verify: ForecastStrip shows 7 days
7. Verify: Click "Suggest Activities" → streaming text appears
8. If severe WMO code: AlertExplainer card visible

- [ ] **Step 4: Commit**

```bash
git add app/city/
git commit -m "feat: add city detail page with server-side weather fetch and all Claude features"
```

---

## Task 20: Temperature Unit Toggle

**Files:**
- Create: `components/weather/UnitToggle.tsx`
- Modify: `app/city/[slug]/CityPageClient.tsx`
- Modify: `app/city/[slug]/page.tsx`

The temperature unit toggle needs to be client-side (reads from Zustand). Refactor WeatherCard and ForecastStrip to accept unit from a shared client wrapper.

- [ ] **Step 1: Create components/weather/UnitToggle.tsx**

```tsx
'use client'

import { useWeatherStore } from '@/lib/store/weather-store'

export function UnitToggle() {
  const { temperatureUnit, toggleTemperatureUnit } = useWeatherStore()
  return (
    <button
      onClick={toggleTemperatureUnit}
      className="glass-card-dark px-3 py-1.5 text-white/70 hover:text-white text-sm font-medium transition-colors"
    >
      °{temperatureUnit === 'C' ? 'F' : 'C'} Switch
    </button>
  )
}
```

- [ ] **Step 2: Update CityPageClient.tsx to include unit toggle**

Replace the file content:

```tsx
'use client'

import { useWeatherStore } from '@/lib/store/weather-store'
import type { GeoLocation } from '@/types/weather'

export function CityPageClient({ location }: { location: GeoLocation }) {
  const { isSaved, addSavedLocation, removeSavedLocation, temperatureUnit, toggleTemperatureUnit } = useWeatherStore()
  const saved = isSaved(location.name)

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTemperatureUnit}
        className="glass-card-dark px-3 py-1.5 text-white/70 hover:text-white text-sm font-medium transition-colors"
      >
        °{temperatureUnit === 'C' ? 'F' : 'C'}
      </button>
      <button
        onClick={() => saved ? removeSavedLocation(location.name) : addSavedLocation(location)}
        className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all
          ${saved ? 'glass-card text-amber-300 hover:text-white' : 'glass-card-dark text-white/60 hover:text-white'}`}
      >
        {saved ? '📍 Saved' : '+ Save'}
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Create a client wrapper for unit-aware weather display**

Create `app/city/[slug]/WeatherDisplay.tsx`:

```tsx
'use client'

import { useWeatherStore } from '@/lib/store/weather-store'
import { WeatherCard } from '@/components/weather/WeatherCard'
import { ForecastStrip } from '@/components/weather/ForecastStrip'
import type { WeatherData } from '@/types/weather'

export function WeatherDisplay({ weatherData }: { weatherData: WeatherData }) {
  const { temperatureUnit } = useWeatherStore()
  return (
    <>
      <WeatherCard
        location={weatherData.location}
        weather={weatherData.current}
        unit={temperatureUnit}
      />
      <ForecastStrip daily={weatherData.daily} unit={temperatureUnit} />
    </>
  )
}
```

- [ ] **Step 4: Update city page to use WeatherDisplay**

In `app/city/[slug]/page.tsx`, replace the `WeatherCard` and `ForecastStrip` JSX with:

```tsx
<WeatherDisplay weatherData={weatherData} />
```

And add the import:
```tsx
import { WeatherDisplay } from './WeatherDisplay'
```

Remove the old imports for `WeatherCard` and `ForecastStrip`.

- [ ] **Step 5: Test unit toggle**

Open a city page, click °F button — verify all temperatures switch to Fahrenheit and back.

- [ ] **Step 6: Commit**

```bash
git add components/weather/UnitToggle.tsx app/city/[slug]/
git commit -m "feat: add temperature unit toggle with °C/°F switching"
```

---

## Task 21: Run All Tests and Final Verification

- [ ] **Step 1: Run full test suite**

```bash
npx jest --passWithNoTests
```

Expected: All tests pass (wmo-codes, open-meteo, geocoding).

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 3: ESLint check**

```bash
npx eslint . --ext .ts,.tsx
```

Expected: No errors (warnings OK).

- [ ] **Step 4: Build check**

```bash
npm run build
```

Expected: Successful production build, no errors.

- [ ] **Step 5: Manual QA checklist**

Run `npm run dev` and verify each item:

- [ ] Home page renders dark gradient, search bar, app title
- [ ] Typing "Paris" in search shows autocomplete dropdown with French cities
- [ ] Selecting a city navigates to `/city/paris?...`
- [ ] WeatherCard shows temperature, condition, humidity, wind, UV, visibility
- [ ] ForecastStrip shows 7 cards; clicking one expands hourly view
- [ ] "Suggest Activities" button → skeleton loading → streaming text appears
- [ ] If severe WMO code in current weather → AlertExplainer card shows; expand → Claude explanation loads
- [ ] °F toggle switches all temperatures
- [ ] "+ Save" pins city; returns to home and chip appears in SavedLocations
- [ ] Clicking saved city chip navigates to that city's page
- [ ] × on a chip removes it
- [ ] Mobile layout (375px viewport): single column, no horizontal overflow
- [ ] No console errors during normal usage

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete weather app with Claude AI features, glassmorphism design, fully responsive"
```

---

## Environment Setup Reminder

Before running, ensure `.env.local` contains:
```
ANTHROPIC_API_KEY=sk-ant-...
```

Without this key, the dev server will start but Claude features will return errors gracefully (the UI handles this with fallback messages).
