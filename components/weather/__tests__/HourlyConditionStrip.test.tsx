import { render, screen } from '@testing-library/react'
import { HourlyConditionStrip } from '../HourlyConditionStrip'
import type { HourlyForecast } from '@/types/weather'

jest.mock('@/lib/weather/wmo-codes', () => ({
  getWmoInfo: () => ({ label: 'Clear Sky', iconKey: 'clear-day', description: '', isSevere: false }),
}))

jest.mock('../WeatherIcon', () => ({
  WeatherIcon: () => <div data-testid="weather-icon" />,
}))

function makeHours(n: number): HourlyForecast[] {
  return Array.from({ length: n }, (_, i) => ({
    time: `2026-05-20T${String(i).padStart(2, '0')}:00`,
    temperature: 18,
    wmoCode: 0,
    precipitationProbability: 0,
    windSpeed: 10,
    humidity: 50,
    pressure: 1013,
    apparentTemperature: 18,
    uvIndex: 0,
    precipitationAmount: 0,
    windDirection: 0,
  }))
}

describe('HourlyConditionStrip', () => {
  it('returns null when hours.length === 0', () => {
    const { container } = render(
      <HourlyConditionStrip hours={makeHours(0)} timezone="UTC" />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders when hours.length < 12 but > 0', () => {
    const { container } = render(
      <HourlyConditionStrip hours={makeHours(5)} timezone="UTC" />,
    )
    expect(container.firstChild).not.toBeNull()
  })

  it('renders exactly 12 items when given 12+ hours', () => {
    render(<HourlyConditionStrip hours={makeHours(12)} timezone="UTC" />)
    expect(screen.getAllByTestId('weather-icon')).toHaveLength(12)
  })

  it('first item label text is "Now"', () => {
    render(<HourlyConditionStrip hours={makeHours(12)} timezone="UTC" />)
    const timeLabels = screen.getAllByText('Now')
    expect(timeLabels).toHaveLength(1)
  })

  it('condition label shows first word of getWmoInfo().label', () => {
    render(<HourlyConditionStrip hours={makeHours(12)} timezone="UTC" />)
    const condLabels = screen.getAllByText('Clear')
    expect(condLabels).toHaveLength(12)
  })
})
