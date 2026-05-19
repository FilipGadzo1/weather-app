import { formatTimeInZone } from '../format-time'

describe('formatTimeInZone', () => {
  it('returns em-dash for null input', () => {
    expect(formatTimeInZone(null, 'America/New_York')).toBe('—')
  })

  it('formats an ISO string in the given timezone (12-hour, AM/PM)', () => {
    // 2026-05-19T10:30:00Z is 06:30 AM in America/New_York (EDT, UTC-4)
    const out = formatTimeInZone('2026-05-19T10:30:00Z', 'America/New_York')
    expect(out).toMatch(/6:30\s?AM/i)
  })

  it('formats correctly for a non-US zone', () => {
    // 2026-05-19T10:30:00Z is 12:30 PM in Europe/Berlin (CEST, UTC+2)
    const out = formatTimeInZone('2026-05-19T10:30:00Z', 'Europe/Berlin')
    expect(out).toMatch(/12:30\s?PM/i)
  })

  it('returns em-dash for invalid timezone', () => {
    expect(formatTimeInZone('2026-05-19T10:30:00Z', 'auto')).toBe('—')
  })
})
