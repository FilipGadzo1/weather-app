import { render, screen } from '@testing-library/react'
import { ExtendedStatsCard } from '../ExtendedStatsCard'
import type { CurrentWeather } from '@/types/weather'

jest.mock('@/lib/store/weather-store', () => ({
  toDisplayTemp: (temp: number) => temp,
}))

const baseWeather: CurrentWeather = {
  temperature: 20,
  feelsLike: 19,
  humidity: 50,
  windSpeed: 10,
  windDirection: 180,
  uvIndex: 3,
  visibility: 15,
  wmoCode: 0,
  isDay: true,
  precipitationProbability: 10,
  pressure: 1013,
  cloudCover: 25,
  dewPoint: 10,
}

describe('ExtendedStatsCard null guard', () => {
  it('returns null when all stats are unavailable', () => {
    const weather: CurrentWeather = {
      ...baseWeather,
      pressure: null,
      cloudCover: null,
      dewPoint: null,
      visibility: NaN,
    }
    const { container } = render(<ExtendedStatsCard weather={weather} unit="C" />)
    expect(container.firstChild).toBeNull()
  })
})

describe('ExtendedStatsCard visibility', () => {
  it('renders "15 km" for visibility 15', () => {
    render(<ExtendedStatsCard weather={{ ...baseWeather, visibility: 15 }} unit="C" />)
    expect(screen.getByText('15 km')).toBeInTheDocument()
  })

  it('renders "0 km" for visibility 0 (fog case)', () => {
    render(<ExtendedStatsCard weather={{ ...baseWeather, visibility: 0 }} unit="C" />)
    expect(screen.getByText('0 km')).toBeInTheDocument()
  })

  it('renders "999+ km" for visibility 1500', () => {
    render(<ExtendedStatsCard weather={{ ...baseWeather, visibility: 1500 }} unit="C" />)
    expect(screen.getByText('999+ km')).toBeInTheDocument()
  })
})
