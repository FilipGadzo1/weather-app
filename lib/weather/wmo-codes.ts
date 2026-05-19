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

const FALLBACK: WmoInfo = { label: 'Unknown', description: 'Unknown conditions', iconKey: 'cloudy', isSevere: false }

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
