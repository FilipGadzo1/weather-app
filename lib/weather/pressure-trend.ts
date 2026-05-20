import type { DailyForecast } from '@/types/weather'

export type PressureTrend = 'rising' | 'falling' | 'steady'

export function getPressureTrend(daily: DailyForecast[]): PressureTrend | null {
  const hours = daily[0]?.hourly ?? []
  if (hours.length < 2) return null

  const now = Date.now()
  const currentIdx = hours.findIndex(h => new Date(h.time).getTime() >= now)
  const i = currentIdx === -1 ? hours.length - 1 : currentIdx

  const pastIdx = Math.max(0, i - 3)
  const currentPressure = hours[i]?.pressure ?? null
  const pastPressure = hours[pastIdx]?.pressure ?? null

  if (!Number.isFinite(currentPressure) || !Number.isFinite(pastPressure)) return null

  const delta = (currentPressure ?? 0) - (pastPressure ?? 0)
  if (delta > 1)  return 'rising'
  if (delta < -1) return 'falling'
  return 'steady'
}
