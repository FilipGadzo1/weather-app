import { render, screen } from '@testing-library/react'
import { SunriseSunsetCard } from '../SunriseSunsetCard'
import type { DailyForecast } from '@/types/weather'

const mockDaily: DailyForecast[] = [{
  date: '2026-05-20',
  tempMax: 22,
  tempMin: 12,
  wmoCode: 0,
  precipitationProbability: 0,
  sunrise: '2026-05-20T05:30',
  sunset: '2026-05-20T20:30',
  hourly: [],
}]

describe('SunriseSunsetCard', () => {
  it('returns null when daily is empty array', () => {
    const { container } = render(<SunriseSunsetCard daily={[]} timezone="UTC" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders SVG with a circle element (sun dot) when valid daily data provided', () => {
    const { container } = render(<SunriseSunsetCard daily={mockDaily} timezone="UTC" />)
    const circle = container.querySelector('circle')
    expect(circle).toBeInTheDocument()
  })

  it('renders "Sunrise" and "Sunset" labels', () => {
    render(<SunriseSunsetCard daily={mockDaily} timezone="UTC" />)
    expect(screen.getByText('Sunrise')).toBeInTheDocument()
    expect(screen.getByText('Sunset')).toBeInTheDocument()
  })

  it('renders "Daylight" title heading', () => {
    render(<SunriseSunsetCard daily={mockDaily} timezone="UTC" />)
    expect(screen.getAllByText('Daylight')[0]).toBeInTheDocument()
  })
})
