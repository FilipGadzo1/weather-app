import type { HourlyForecast } from '@/types/weather'

export interface BestWindow {
  startHour: number
  score: number
  label: string
  reason: string
}

function scoreHour(h: HourlyForecast): number {
  if (!Number.isFinite(h.temperature) || !Number.isFinite(h.precipitationProbability) || !Number.isFinite(h.windSpeed)) {
    return 50  // neutral score for missing data
  }
  let s = 100
  if (h.temperature < 0)        s -= 40
  else if (h.temperature < 8)   s -= 20
  else if (h.temperature < 12)  s -= 10
  else if (h.temperature > 30)  s -= 20
  else if (h.temperature > 25)  s -= 10
  if (h.precipitationProbability > 70) s -= 40
  else if (h.precipitationProbability > 40) s -= 20
  else if (h.precipitationProbability > 20) s -= 10
  if (h.windSpeed > 50) s -= 30
  else if (h.windSpeed > 30) s -= 15
  else if (h.windSpeed > 20) s -= 5
  return Math.max(0, s)
}

function buildLabel(hours: HourlyForecast[], startIdx: number): string {
  const iso = hours[startIdx].time
  const h = parseInt(iso.slice(11, 13), 10)
  if (!Number.isFinite(h)) return 'Soon'
  if (h === 0)  return 'Around 12am'
  if (h < 12)  return `Around ${h}am`
  if (h === 12) return 'Around noon'
  return `Around ${h - 12}pm`
}

function buildReason(h: HourlyForecast): string {
  const parts: string[] = []
  if (h.temperature >= 12 && h.temperature <= 25) parts.push('Mild temps')
  else if (h.temperature < 0) parts.push('Freezing temps')
  else if (h.temperature < 12) parts.push('Cool temps')
  else parts.push('Hot temps')
  if (h.precipitationProbability <= 20) parts.push('low rain chance')
  if (h.windSpeed <= 20) parts.push('calm winds')
  return parts.join(', ')
}

/** Expects hours[0] to represent "now or the next future hour". Returns null if no window scores ≥ 40. */
export function findBestWindow(hours: HourlyForecast[]): BestWindow | null {
  if (hours.length < 2) return null
  const scores = hours.map(scoreHour)
  let bestScore = -1
  let bestIdx = 0
  for (let i = 0; i < scores.length - 1; i++) {
    const windowScore = (scores[i] + scores[i + 1]) / 2
    if (windowScore > bestScore) {
      bestScore = windowScore
      bestIdx = i
    }
  }
  if (bestScore < 40) return null
  return {
    startHour: bestIdx,
    score: Math.round(bestScore),
    label: buildLabel(hours, bestIdx),
    reason: buildReason(hours[bestIdx]),
  }
}
