export interface MoonPhaseInfo {
  phase: 'New Moon' | 'Waxing Crescent' | 'First Quarter' | 'Waxing Gibbous'
        | 'Full Moon' | 'Waning Gibbous' | 'Last Quarter' | 'Waning Crescent'
  illumination: number   // 0–100 (%)
  emoji: string
  ageInDays: number      // 0–29.5, rounded to 1 decimal
}

export const SYNODIC_MONTH = 29.53058867
const KNOWN_NEW_MOON_JD = 2451550.1

const PHASE_EMOJI: Record<MoonPhaseInfo['phase'], string> = {
  'New Moon': '🌑',
  'Waxing Crescent': '🌒',
  'First Quarter': '🌓',
  'Waxing Gibbous': '🌔',
  'Full Moon': '🌕',
  'Waning Gibbous': '🌖',
  'Last Quarter': '🌗',
  'Waning Crescent': '🌘',
}

function getPhaseLabel(age: number, period: number): MoonPhaseInfo['phase'] {
  const pct = age / period
  if (pct < 0.0339) return 'New Moon'
  if (pct < 0.25)   return 'Waxing Crescent'
  if (pct < 0.2839) return 'First Quarter'
  if (pct < 0.5)    return 'Waxing Gibbous'
  if (pct < 0.5339) return 'Full Moon'
  if (pct < 0.75)   return 'Waning Gibbous'
  if (pct < 0.7839) return 'Last Quarter'
  return 'Waning Crescent'
}

export function getMoonPhase(date: Date): MoonPhaseInfo {
  const JD = date.getTime() / 86400000 + 2440587.5
  const age = ((JD - KNOWN_NEW_MOON_JD) % SYNODIC_MONTH + SYNODIC_MONTH) % SYNODIC_MONTH
  const illumination = Math.round(((1 - Math.cos((2 * Math.PI * age) / SYNODIC_MONTH)) / 2) * 100)
  const phase = getPhaseLabel(age, SYNODIC_MONTH)
  return {
    phase,
    illumination,
    emoji: PHASE_EMOJI[phase],
    ageInDays: Math.round(age * 10) / 10,
  }
}
