import { render, screen } from '@testing-library/react'
import { BestTimeCard } from '../BestTimeCard'
import type { HourlyForecast } from '@/types/weather'

function makeHour(temperature: number, precipitationProbability: number, windSpeed: number): HourlyForecast {
  return {
    time: '2026-05-20T12:00', temperature, wmoCode: 0, precipitationProbability, windSpeed,
    humidity: 50, pressure: 1013, apparentTemperature: temperature, uvIndex: 0,
    precipitationAmount: 0, windDirection: 0,
  }
}

const TERRIBLE = makeHour(-10, 90, 60)
const IDEAL    = makeHour(18, 0, 5)

describe('BestTimeCard', () => {
  it('returns null (renders nothing) when all hours are terrible', () => {
    const { container } = render(<BestTimeCard hours={[TERRIBLE, TERRIBLE, TERRIBLE]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders label, reason, and score badge when hours are ideal', () => {
    render(<BestTimeCard hours={[IDEAL, IDEAL, IDEAL]} />)
    expect(screen.getByText(/Around/i)).toBeInTheDocument()
    expect(screen.getByText(/Mild temps/i)).toBeInTheDocument()
    expect(screen.getByText(/\/100/)).toBeInTheDocument()
  })

  it('container.firstChild is null for bad hours', () => {
    const { container } = render(<BestTimeCard hours={[TERRIBLE, TERRIBLE]} />)
    expect(container.firstChild).toBeNull()
  })
})
