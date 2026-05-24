'use server'

import { generateAllCityBgs, checkCityBgUrls, type CityBgUrls } from '@/lib/city-backgrounds'

export async function generateCityBackgrounds(slug: string, cityName: string): Promise<CityBgUrls> {
  // Check again server-side in case another request already generated them
  const existing = await checkCityBgUrls(slug)
  if (existing) return existing
  return generateAllCityBgs(slug, cityName)
}
