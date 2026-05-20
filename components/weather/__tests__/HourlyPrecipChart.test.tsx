import { render } from '@testing-library/react'
import { HourlyPrecipChart } from '../HourlyPrecipChart'
import type { HourlyForecast } from '@/types/weather'

function makeHour(i: number, precipitationAmount: number): HourlyForecast {
  const h = String(i).padStart(2, '0')
  return {
    time: `2026-05-20T${h}:00`,
    temperature: 20,
    wmoCode: 0,
    precipitationProbability: 0,
    windSpeed: 10,
    humidity: 50,
    pressure: 1013,
    apparentTemperature: 20,
    uvIndex: 0,
    precipitationAmount,
    windDirection: 0,
  }
}

function makeHours(n: number, precip = 1): HourlyForecast[] {
  return Array.from({ length: n }, (_, i) => makeHour(i, precip))
}

describe('HourlyPrecipChart', () => {
  it('returns null when hours.length < 24', () => {
    const { container } = render(<HourlyPrecipChart hours={makeHours(10)} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when all precipitationAmount = 0', () => {
    const { container } = render(<HourlyPrecipChart hours={makeHours(24, 0)} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders when at least one hour has precipitationAmount > 0', () => {
    const hours = makeHours(24, 0)
    hours[5] = makeHour(5, 2.5)
    const { container } = render(<HourlyPrecipChart hours={hours} />)
    expect(container.firstChild).not.toBeNull()
  })

  it('renders 24 bar containers', () => {
    const { container } = render(<HourlyPrecipChart hours={makeHours(24)} />)
    const bars = container.querySelectorAll('.bg-white\\/10')
    expect(bars).toHaveLength(24)
  })

  it('shows "total" text', () => {
    const { getByText } = render(<HourlyPrecipChart hours={makeHours(24, 1)} />)
    expect(getByText(/total/)).toBeTruthy()
  })

  it('shows "Now" label', () => {
    const { getByText } = render(<HourlyPrecipChart hours={makeHours(24, 1)} />)
    expect(getByText('Now')).toBeTruthy()
  })
})
