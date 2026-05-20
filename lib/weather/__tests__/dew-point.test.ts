import { getDewPointComfort } from '../dew-point'

describe('getDewPointComfort', () => {
  it('dewC=9 → Dry', () => {
    expect(getDewPointComfort(9).label).toBe('Dry')
  })

  it('dewC=10 → Comfortable (boundary, strict < 10 so 10 is NOT Dry)', () => {
    expect(getDewPointComfort(10).label).toBe('Comfortable')
  })

  it('dewC=14 → Comfortable', () => {
    expect(getDewPointComfort(14).label).toBe('Comfortable')
  })

  it('dewC=15 → Noticeable (boundary)', () => {
    expect(getDewPointComfort(15).label).toBe('Noticeable')
  })

  it('dewC=17 → Noticeable', () => {
    expect(getDewPointComfort(17).label).toBe('Noticeable')
  })

  it('dewC=18 → Muggy (boundary)', () => {
    expect(getDewPointComfort(18).label).toBe('Muggy')
  })

  it('dewC=20 → Muggy', () => {
    expect(getDewPointComfort(20).label).toBe('Muggy')
  })

  it('dewC=21 → Oppressive (boundary — falls to else)', () => {
    expect(getDewPointComfort(21).label).toBe('Oppressive')
  })

  it('dewC=30 → Oppressive', () => {
    expect(getDewPointComfort(30).label).toBe('Oppressive')
  })

  it('dewC=-5 → Dry (below zero)', () => {
    expect(getDewPointComfort(-5).label).toBe('Dry')
  })

  it('dewC=NaN → Dry (non-finite guard)', () => {
    expect(getDewPointComfort(NaN).label).toBe('Dry')
  })
})
