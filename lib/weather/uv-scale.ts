export interface UvBand {
  label: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme'
  textClass: string
  bgClass: string
  tip: string
}

export function getUvBand(uv: number): UvBand {
  if (uv < 3) {
    return { label: 'Low', textClass: 'text-green-300', bgClass: 'bg-green-500/20', tip: 'Minimal sun protection needed.' }
  }
  if (uv < 6) {
    return { label: 'Moderate', textClass: 'text-yellow-300', bgClass: 'bg-yellow-500/20', tip: 'Wear sunglasses and SPF 30 if outside for more than an hour.' }
  }
  if (uv < 8) {
    return { label: 'High', textClass: 'text-orange-300', bgClass: 'bg-orange-500/20', tip: 'Seek shade midday; SPF 30+ recommended.' }
  }
  if (uv < 11) {
    return { label: 'Very High', textClass: 'text-red-300', bgClass: 'bg-red-500/20', tip: 'Avoid sun 10am-4pm; SPF 50+, hat, and long sleeves.' }
  }
  return { label: 'Extreme', textClass: 'text-purple-300', bgClass: 'bg-purple-500/20', tip: 'Stay indoors when possible; unprotected skin burns in minutes.' }
}
