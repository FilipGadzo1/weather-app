import { toDisplayTemp } from '../weather-store'

describe('toDisplayTemp', () => {
  it('returns celsius rounded when unit is C', () => {
    expect(toDisplayTemp(25.7, 'C')).toBe(26)
    expect(toDisplayTemp(-10.3, 'C')).toBe(-10)
    expect(toDisplayTemp(0, 'C')).toBe(0)
  })

  it('converts celsius to fahrenheit', () => {
    expect(toDisplayTemp(0, 'F')).toBe(32)
    expect(toDisplayTemp(100, 'F')).toBe(212)
    expect(toDisplayTemp(-40, 'F')).toBe(-40)
  })
})
