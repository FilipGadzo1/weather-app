import { getWmoInfo, isSevereWmo, getBackgroundKey } from '../wmo-codes'

describe('getWmoInfo', () => {
  it('returns clear sky info for code 0', () => {
    const info = getWmoInfo(0)
    expect(info.label).toBe('Clear sky')
    expect(info.isSevere).toBe(false)
    expect(info.iconKey).toBe('clear')
  })

  it('returns thunderstorm info for code 95', () => {
    const info = getWmoInfo(95)
    expect(info.label).toContain('Thunderstorm')
    expect(info.isSevere).toBe(true)
  })

  it('returns fallback for unknown code', () => {
    const info = getWmoInfo(999)
    expect(info.label).toBe('Unknown')
  })
})

describe('isSevereWmo', () => {
  it('returns false for clear sky', () => expect(isSevereWmo(0)).toBe(false))
  it('returns true for fog (code 45)', () => expect(isSevereWmo(45)).toBe(true))
  it('returns true for thunderstorm (code 95)', () => expect(isSevereWmo(95)).toBe(true))
})

describe('getBackgroundKey', () => {
  it('returns "clear-day" for code 0 during day', () => {
    expect(getBackgroundKey(0, true)).toBe('clear-day')
  })
  it('returns "clear-night" for code 0 at night', () => {
    expect(getBackgroundKey(0, false)).toBe('clear-night')
  })
  it('returns "storm" for thunderstorm code', () => {
    expect(getBackgroundKey(95, true)).toBe('storm')
  })
})
