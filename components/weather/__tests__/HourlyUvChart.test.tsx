import { render, screen } from '@testing-library/react'
import { HourlyUvChart } from '../HourlyUvChart'
import type { HourlyForecast } from '@/types/weather'

function makeHour(i: number, uvIndex: number): HourlyForecast {
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
    uvIndex,
    precipitationAmount: 0,
    windDirection: 0,
  }
}

const allZeroHours = Array.from({ length: 24 }, (_, i) => makeHour(i, 0))
const activeHours = Array.from({ length: 24 }, (_, i) => makeHour(i, i < 6 ? 0 : i < 18 ? 5 : 0))
const extremeHours = Array.from({ length: 24 }, (_, i) => makeHour(i, 12))

describe('HourlyUvChart', () => {
  it('returns null when hours.length < 24', () => {
    const { container } = render(<HourlyUvChart hours={allZeroHours.slice(0, 12)} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when all uvIndex values are 0', () => {
    const { container } = render(<HourlyUvChart hours={allZeroHours} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders when at least one uvIndex is non-zero', () => {
    const { container } = render(<HourlyUvChart hours={activeHours} />)
    expect(container.firstChild).not.toBeNull()
  })

  it('renders 24 bar containers', () => {
    const { container } = render(<HourlyUvChart hours={activeHours} />)
    // Each bar is a flex-col div wrapping the track + label
    const bars = container.querySelectorAll('.flex-col.items-center.flex-1')
    expect(bars.length).toBe(24)
  })

  it('shows Peak: text with max UV value', () => {
    render(<HourlyUvChart hours={activeHours} />)
    expect(screen.getByText(/Peak:/)).toBeInTheDocument()
  })

  it('clamps bar height at UV >= 11 (does not exceed 100%)', () => {
    const { container } = render(<HourlyUvChart hours={extremeHours} />)
    const fills = container.querySelectorAll('[style*="height"]')
    fills.forEach((fill) => {
      const height = (fill as HTMLElement).style.height
      const pct = parseFloat(height)
      expect(pct).toBeLessThanOrEqual(100)
    })
  })

  it('shows "Now" as label for index 0', () => {
    render(<HourlyUvChart hours={activeHours} />)
    expect(screen.getByText('Now')).toBeInTheDocument()
  })
})
