import { getMoonPhase } from '../moon-phase'
import type { MoonPhaseInfo } from '../moon-phase'

const SYNODIC_MONTH = 29.53058867
// Known new moon: 2000-01-06T18:14:00Z (JD ~2451550.26, within new moon window)
const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z')

describe('getMoonPhase', () => {
  it('returns New Moon for known new moon date', () => {
    expect(getMoonPhase(KNOWN_NEW_MOON).phase).toBe('New Moon')
  })

  it('returns Full Moon ~15 days after known new moon', () => {
    // 2000-01-21T18:00Z is age ~15.15d, pct ~0.513 — within Full Moon window (0.5–0.5339)
    const fullMoon = new Date('2000-01-21T18:00:00Z')
    expect(getMoonPhase(fullMoon).phase).toBe('Full Moon')
  })

  it('illumination is always between 0 and 100', () => {
    for (let i = 0; i < 30; i++) {
      const date = new Date(KNOWN_NEW_MOON.getTime() + i * 86400000)
      const { illumination } = getMoonPhase(date)
      expect(illumination).toBeGreaterThanOrEqual(0)
      expect(illumination).toBeLessThanOrEqual(100)
    }
  })

  it('ageInDays is always between 0 and 29.5', () => {
    for (let i = 0; i < 30; i++) {
      const date = new Date(KNOWN_NEW_MOON.getTime() + i * 86400000)
      const { ageInDays } = getMoonPhase(date)
      expect(ageInDays).toBeGreaterThanOrEqual(0)
      expect(ageInDays).toBeLessThan(SYNODIC_MONTH)
    }
  })

  it('emoji is a non-empty string', () => {
    for (let i = 0; i < 30; i++) {
      const date = new Date(KNOWN_NEW_MOON.getTime() + i * 86400000)
      const { emoji } = getMoonPhase(date)
      expect(typeof emoji).toBe('string')
      expect(emoji.length).toBeGreaterThan(0)
    }
  })

  it('all 8 phase names appear across a full synodic month', () => {
    const allPhases = new Set<MoonPhaseInfo['phase']>()
    // Sample every 0.5 days over one full synodic month
    const steps = Math.ceil(SYNODIC_MONTH / 0.5)
    for (let i = 0; i <= steps; i++) {
      const date = new Date(KNOWN_NEW_MOON.getTime() + i * 0.5 * 86400000)
      allPhases.add(getMoonPhase(date).phase)
    }
    const expected: MoonPhaseInfo['phase'][] = [
      'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
      'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent',
    ]
    for (const phase of expected) {
      expect(allPhases.has(phase)).toBe(true)
    }
  })

  it('returns Waxing Crescent about 3 days after new moon', () => {
    const date = new Date(KNOWN_NEW_MOON.getTime() + 3 * 86400000)
    expect(getMoonPhase(date).phase).toBe('Waxing Crescent')
  })

  it('returns First Quarter about 7.4 days after new moon', () => {
    const date = new Date(KNOWN_NEW_MOON.getTime() + 7.4 * 86400000)
    expect(getMoonPhase(date).phase).toBe('First Quarter')
  })

  it('returns Waxing Gibbous about 10 days after new moon', () => {
    const date = new Date(KNOWN_NEW_MOON.getTime() + 10 * 86400000)
    expect(getMoonPhase(date).phase).toBe('Waxing Gibbous')
  })

  it('returns Waning Gibbous about 18 days after new moon', () => {
    const date = new Date(KNOWN_NEW_MOON.getTime() + 18 * 86400000)
    expect(getMoonPhase(date).phase).toBe('Waning Gibbous')
  })

  it('returns Last Quarter about 22 days after new moon', () => {
    const date = new Date(KNOWN_NEW_MOON.getTime() + 22 * 86400000)
    expect(getMoonPhase(date).phase).toBe('Last Quarter')
  })

  it('returns Waning Crescent about 26 days after new moon', () => {
    const date = new Date(KNOWN_NEW_MOON.getTime() + 26 * 86400000)
    expect(getMoonPhase(date).phase).toBe('Waning Crescent')
  })
})
