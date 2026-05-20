import { render, screen } from '@testing-library/react'
import { WeatherSummaryCard } from '../WeatherSummaryCard'
import type { CurrentWeather } from '@/types/weather'

jest.mock('@/lib/weather/summarize', () => ({
  buildWeatherSummary: () => 'Sunny with calm winds.',
}))

const baseWeather: CurrentWeather = {
  temperature: 18, feelsLike: 16, humidity: 60,
  windSpeed: 2, windDirection: 180, uvIndex: 4,
  visibility: 15, wmoCode: 0, isDay: true,
  precipitationProbability: 0,
  pressure: 1013, cloudCover: 30, dewPoint: 10,
}

describe('WeatherSummaryCard', () => {
  it('renders "At a Glance" heading', () => {
    render(<WeatherSummaryCard weather={baseWeather} daily={[]} unit="C" />)
    expect(screen.getByText('At a Glance')).toBeInTheDocument()
  })

  it('renders the summary text containing "calm"', () => {
    render(<WeatherSummaryCard weather={baseWeather} daily={[]} unit="C" />)
    expect(screen.getByText('Sunny with calm winds.')).toBeInTheDocument()
  })
})
