export interface AqiCategory {
  label: string
  bgClass: string
  textClass: string
}

export function getAqiCategory(aqi: number): AqiCategory {
  if (aqi <= 50) {
    return { label: 'Good', bgClass: 'bg-green-500/80', textClass: 'text-white' }
  }
  if (aqi <= 100) {
    return { label: 'Moderate', bgClass: 'bg-yellow-400/80', textClass: 'text-black' }
  }
  if (aqi <= 150) {
    return { label: 'Unhealthy for Sensitive', bgClass: 'bg-orange-500/80', textClass: 'text-white' }
  }
  if (aqi <= 200) {
    return { label: 'Unhealthy', bgClass: 'bg-red-500/80', textClass: 'text-white' }
  }
  if (aqi <= 300) {
    return { label: 'Very Unhealthy', bgClass: 'bg-purple-600/80', textClass: 'text-white' }
  }
  return { label: 'Hazardous', bgClass: 'bg-rose-900/80', textClass: 'text-white' }
}
