import { parseAirQualityResponse, fetchAirQuality } from '../air-quality'

describe('parseAirQualityResponse', () => {
  it('extracts AQI and PM values from a full payload', () => {
    const payload = {
      current: {
        us_aqi: 42,
        pm2_5: 8.3,
        pm10: 17.1,
        european_aqi: 35,
      },
    }
    expect(parseAirQualityResponse(payload)).toEqual({
      usAqi: 42,
      pm25: 8.3,
      pm10: 17.1,
      europeanAqi: 35,
    })
  })

  it('returns nulls when fields are missing', () => {
    expect(parseAirQualityResponse({ current: {} })).toEqual({
      usAqi: null,
      pm25: null,
      pm10: null,
      europeanAqi: null,
    })
  })

  it('returns all-null on malformed payload', () => {
    expect(parseAirQualityResponse({})).toEqual({
      usAqi: null, pm25: null, pm10: null, europeanAqi: null,
    })
  })
})

describe('fetchAirQuality', () => {
  const originalFetch = global.fetch
  beforeEach(() => {
    global.fetch = jest.fn()
  })
  afterEach(() => {
    global.fetch = originalFetch
  })

  it('returns parsed data on success', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ current: { us_aqi: 55, pm2_5: 10, pm10: 20, european_aqi: 40 } }),
    })
    const out = await fetchAirQuality(40.7, -74.0)
    expect(out).toEqual({ usAqi: 55, pm25: 10, pm10: 20, europeanAqi: 40 })
  })

  it('returns null on non-ok response', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 })
    expect(await fetchAirQuality(0, 0)).toBeNull()
  })

  it('returns null when fetch throws', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('network'))
    expect(await fetchAirQuality(0, 0)).toBeNull()
  })
})
