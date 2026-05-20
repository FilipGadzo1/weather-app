import { degreesToCompass } from '../wind-direction'

describe('degreesToCompass', () => {
  it('0 → N', () => expect(degreesToCompass(0)).toBe('N'))
  it('45 → NE', () => expect(degreesToCompass(45)).toBe('NE'))
  it('90 → E', () => expect(degreesToCompass(90)).toBe('E'))
  it('135 → SE', () => expect(degreesToCompass(135)).toBe('SE'))
  it('180 → S', () => expect(degreesToCompass(180)).toBe('S'))
  it('225 → SW', () => expect(degreesToCompass(225)).toBe('SW'))
  it('270 → W', () => expect(degreesToCompass(270)).toBe('W'))
  it('315 → NW', () => expect(degreesToCompass(315)).toBe('NW'))
  it('360 → N (wraps)', () => expect(degreesToCompass(360)).toBe('N'))
  it('337 → NW (rounding)', () => expect(degreesToCompass(337)).toBe('NW'))
  it('23 → NE (rounding)', () => expect(degreesToCompass(23)).toBe('NE'))
})
