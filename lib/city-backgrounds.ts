export interface CityBgUrls {
  day: string
  night: string
  rain: string
  snow: string
  cloudy: string
  storm: string
}

const DEFAULT_BG_URLS: CityBgUrls = {
  day: '/backgrounds/bg-sunny.png',
  night: '/backgrounds/bg-night.png',
  rain: '/backgrounds/bg-rain.png',
  snow: '/backgrounds/bg-snow.png',
  cloudy: '/backgrounds/bg-cloudy.png',
  storm: '/backgrounds/bg-rain.png',
}

export async function checkCityBgUrls(_slug: string): Promise<CityBgUrls | null> {
  return null
}

export async function generateAllCityBgs(_slug: string, _cityName: string): Promise<CityBgUrls> {
  return DEFAULT_BG_URLS
}
