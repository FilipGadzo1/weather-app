import { render } from '@testing-library/react'
import { HourlyHumidityChart } from '../HourlyHumidityChart'
import type { HourlyForecast } from '@/types/weather'

function makeHours(n: number, humidity = 65): HourlyForecast[] {
  return Array.from({ length: n }, (_, i) => ({
    time: `2026-05-20T${String(i).padStart(2, '0')}:00`,
    temperature: 18,
    wmoCode: 0,
    precipitationProbability: 0,
    windSpeed: 10,
    humidity,
    pressure: 1013,
  }))
}

describe('HourlyHumidityChart', () => {
  it('returns null when hours.length < 24', () => {
    const { container } = render(<HourlyHumidityChart hours={makeHours(10)} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders 24 bar elements when given 24+ hours', () => {
    const { container } = render(<HourlyHumidityChart hours={makeHours(24)} />)
    const bars = container.querySelectorAll('.bg-white\\/10')
    expect(bars).toHaveLength(24)
  })

  it('label "Now" appears for index 0', () => {
    const { container } = render(<HourlyHumidityChart hours={makeHours(24)} />)
    const labels = container.querySelectorAll('span.text-white\\/40')
    expect(labels[0].textContent).toBe('Now')
  })

  it('label "+6h" appears', () => {
    const { container } = render(<HourlyHumidityChart hours={makeHours(24)} />)
    const labels = container.querySelectorAll('span.text-white\\/40')
    expect(labels[6].textContent).toBe('+6h')
  })

  it('humidity 25 uses amber color', () => {
    const { container } = render(<HourlyHumidityChart hours={makeHours(24, 25)} />)
    // The fill divs are direct children of .bg-white/10 containers
    const containers = container.querySelectorAll('.bg-white\\/10')
    const fill = containers[0].firstElementChild as HTMLElement
    expect(fill.style.backgroundColor).toBe('rgba(251, 191, 36, 0.7)')
  })

  it('humidity 50 uses sky color', () => {
    const { container } = render(<HourlyHumidityChart hours={makeHours(24, 50)} />)
    const containers = container.querySelectorAll('.bg-white\\/10')
    const fill = containers[0].firstElementChild as HTMLElement
    expect(fill.style.backgroundColor).toBe('rgba(56, 189, 248, 0.6)')
  })
})
