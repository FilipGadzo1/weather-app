import { render, screen } from '@testing-library/react'
import { TomorrowCard } from '../TomorrowCard'
import type { DailyForecast } from '@/types/weather'

jest.mock('@/lib/store/weather-store', () => ({
  toDisplayTemp: (t: number, u: string) => u === 'F' ? Math.round(t * 9 / 5 + 32) : Math.round(t),
}))

jest.mock('@/lib/weather/wmo-codes', () => ({
  getWmoInfo: () => ({ label: 'Sunny', iconKey: 'clear-day', description: '', isSevere: false }),
}))

jest.mock('../WeatherIcon', () => ({
  WeatherIcon: () => <div data-testid="weather-icon" />,
}))

const today: DailyForecast = {
  date: '2026-05-20', tempMax: 22, tempMin: 12, wmoCode: 0,
  precipitationProbability: 10, sunrise: '2026-05-20T05:30', sunset: '2026-05-20T20:30', hourly: [],
}

const tomorrow: DailyForecast = {
  date: '2026-05-21', tempMax: 18, tempMin: 8, wmoCode: 1,
  precipitationProbability: 40, sunrise: '2026-05-21T05:31', sunset: '2026-05-21T20:29', hourly: [],
}

describe('TomorrowCard', () => {
  it('returns null when daily has only 1 entry', () => {
    const { container } = render(
      <TomorrowCard daily={[today]} unit="C" timezone="UTC" />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders "Tomorrow" heading', () => {
    render(<TomorrowCard daily={[today, tomorrow]} unit="C" timezone="UTC" />)
    expect(screen.getByText('Tomorrow')).toBeInTheDocument()
  })

  it('renders high temp "18°C" for tempMax=18, unit=C', () => {
    render(<TomorrowCard daily={[today, tomorrow]} unit="C" timezone="UTC" />)
    expect(screen.getByText('18°C')).toBeInTheDocument()
  })

  it('renders converted high temp "64°F" for tempMax=18, unit=F', () => {
    render(<TomorrowCard daily={[today, tomorrow]} unit="F" timezone="UTC" />)
    expect(screen.getByText('64°F')).toBeInTheDocument()
  })

  it('renders "40%" rain probability', () => {
    render(<TomorrowCard daily={[today, tomorrow]} unit="C" timezone="UTC" />)
    expect(screen.getByText('40%')).toBeInTheDocument()
  })
})
