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
  pressure: number | null      // hPa
  cloudCover: number | null    // %
  dewPoint: number | null      // °C
}

export interface DailyForecast {
  date: string                 // ISO date "2026-05-19"
  tempMax: number
  tempMin: number
  wmoCode: number
  precipitationProbability: number
  precipitationSum: number | null  // mm of precipitation
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
  humidity: number             // % relative humidity
  pressure: number | null      // hPa
  apparentTemperature: number
  uvIndex: number              // UV index 0–11+
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

export interface AirQualityData {
  usAqi: number | null
  pm25: number | null      // µg/m³
  pm10: number | null      // µg/m³
  europeanAqi: number | null
}
