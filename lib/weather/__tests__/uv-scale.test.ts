import { getUvBand } from '../uv-scale'

describe('getUvBand', () => {
  it.each([
    [0, 'Low'],
    [2.9, 'Low'],
    [3, 'Moderate'],
    [5.9, 'Moderate'],
    [6, 'High'],
    [7.9, 'High'],
    [8, 'Very High'],
    [10.9, 'Very High'],
    [11, 'Extreme'],
    [15, 'Extreme'],
  ])('maps UV %s to label %s', (uv, label) => {
    expect(getUvBand(uv).label).toBe(label)
  })

  it('returns correct color classes for High band', () => {
    const band = getUvBand(7)
    expect(band.textClass).toBe('text-orange-300')
    expect(band.bgClass).toBe('bg-orange-500/20')
  })

  it('tip is non-empty for all bands', () => {
    [0, 4, 7, 9, 12].forEach((uv) => {
      expect(getUvBand(uv).tip.length).toBeGreaterThan(0)
    })
  })
})
