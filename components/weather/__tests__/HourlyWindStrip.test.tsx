import { render } from '@testing-library/react'
import { HourlyWindStrip } from '../HourlyWindStrip'
import type { HourlyForecast } from '@/types/weather'

function makeHours(n: number, windSpeed = 10): HourlyForecast[] {
  return Array.from({ length: n }, (_, i) => ({
    time: `2026-05-20T${String(i).padStart(2, '0')}:00`,
    temperature: 18,
    wmoCode: 0,
    precipitationProbability: 0,
    windSpeed,
    humidity: 50,
    pressure: 1013,
    apparentTemperature: 18,
    uvIndex: 0,
    precipitationAmount: 0,
    windDirection: 0,
  }))
}

describe('HourlyWindStrip', () => {
  it('returns null when hours.length < 12', () => {
    const { container } = render(<HourlyWindStrip hours={makeHours(5)} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders 12 bar columns when given 12+ hours', () => {
    const { container } = render(<HourlyWindStrip hours={makeHours(12)} />)
    // Each column has a label span with text "Now" or "+Nh"
    const labels = container.querySelectorAll('span.text-white\\/40')
    expect(labels).toHaveLength(12)
  })

  it('first label is "Now" and second is "+1h"', () => {
    const { container } = render(<HourlyWindStrip hours={makeHours(12)} />)
    const labels = container.querySelectorAll('span.text-white\\/40')
    expect(labels[0].textContent).toBe('Now')
    expect(labels[1].textContent).toBe('+1h')
  })

  it('bars have minimum height style of at least 4% when all wind speeds are 0', () => {
    const { container } = render(<HourlyWindStrip hours={makeHours(12, 0)} />)
    const bars = container.querySelectorAll('.bg-gradient-to-t')
    bars.forEach(bar => {
      const heightStr = (bar as HTMLElement).style.height
      const heightPct = parseFloat(heightStr)
      expect(heightPct).toBeGreaterThanOrEqual(4)
    })
  })

  it('bar with max wind speed has height style of 100%', () => {
    // First entry has windSpeed=20, rest have windSpeed=10
    const hours = makeHours(12, 10)
    hours[0] = { ...hours[0], windSpeed: 20 }
    const { container } = render(<HourlyWindStrip hours={hours} />)
    const bars = container.querySelectorAll('.bg-gradient-to-t')
    expect((bars[0] as HTMLElement).style.height).toBe('100%')
  })
})
