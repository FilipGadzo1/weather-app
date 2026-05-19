import { buildGeocodingUrl, parseGeocodingResponse } from '../geocoding'

describe('buildGeocodingUrl', () => {
  it('builds correct URL', () => {
    const url = buildGeocodingUrl('London')
    expect(url).toContain('name=London')
    expect(url).toContain('count=5')
  })
})

describe('parseGeocodingResponse', () => {
  it('parses results correctly', () => {
    const mockResponse = {
      results: [
        { name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.5074, longitude: -0.1278 },
        { name: 'London', country: 'Canada', admin1: 'Ontario', latitude: 42.9849, longitude: -81.2453 },
      ],
    }
    const results = parseGeocodingResponse(mockResponse)
    expect(results).toHaveLength(2)
    expect(results[0].name).toBe('London')
    expect(results[0].lat).toBe(51.5074)
    expect(results[0].country).toBe('United Kingdom')
  })

  it('returns empty array when no results', () => {
    expect(parseGeocodingResponse({})).toEqual([])
  })
})
