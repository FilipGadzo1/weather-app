import { getAqiCategory } from '../aqi-scale'

describe('getAqiCategory', () => {
  it.each([
    [0, 'Good'],
    [50, 'Good'],
    [51, 'Moderate'],
    [100, 'Moderate'],
    [101, 'Unhealthy for Sensitive'],
    [150, 'Unhealthy for Sensitive'],
    [151, 'Unhealthy'],
    [200, 'Unhealthy'],
    [201, 'Very Unhealthy'],
    [300, 'Very Unhealthy'],
    [301, 'Hazardous'],
    [999, 'Hazardous'],
  ])('maps AQI %i to label %s', (aqi, label) => {
    expect(getAqiCategory(aqi).label).toBe(label)
  })

  it('returns green for Good', () => {
    expect(getAqiCategory(20).bgClass).toContain('bg-green')
    expect(getAqiCategory(20).textClass).toContain('text-white')
  })

  it('returns yellow for Moderate', () => {
    expect(getAqiCategory(75).bgClass).toContain('bg-yellow')
    expect(getAqiCategory(75).textClass).toContain('text-black')
  })

  it('returns rose for Hazardous', () => {
    expect(getAqiCategory(400).bgClass).toContain('bg-rose')
  })
})
