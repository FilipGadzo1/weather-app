import { render } from '@testing-library/react'
import { WeekSparkline } from '../WeekSparkline'
import { DailyForecast } from '@/types/weather'

jest.mock('@/lib/store/weather-store', () => ({
  toDisplayTemp: (celsius: number, unit: string) =>
    unit === 'F' ? Math.round((celsius * 9) / 5 + 32) : Math.round(celsius),
}))

const makeDaily = (count: number): DailyForecast[] =>
  Array.from({ length: count }, (_, i) => ({
    date: `2026-05-${String(20 + i).padStart(2, '0')}`,
    tempMax: 20 + i,
    tempMin: 10 + i,
    wmoCode: 0,
    precipitationProbability: 0,
    sunrise: '',
    sunset: '',
    hourly: [],
  }))

describe('WeekSparkline', () => {
  it('renders null when daily has 0 entries', () => {
    const { container } = render(<WeekSparkline daily={[]} unit="C" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders null when daily has 1 entry', () => {
    const { container } = render(<WeekSparkline daily={makeDaily(1)} unit="C" />)
    expect(container.firstChild).toBeNull()
  })

  it('with 7 entries, SVG contains exactly 14 circle elements', () => {
    const { container } = render(<WeekSparkline daily={makeDaily(7)} unit="C" />)
    const circles = container.querySelectorAll('circle')
    expect(circles).toHaveLength(14)
  })

  it('with unit F, rendered text labels contain °', () => {
    const { container } = render(<WeekSparkline daily={makeDaily(7)} unit="F" />)
    const texts = Array.from(container.querySelectorAll('text'))
    const degreeTexts = texts.filter(t => t.textContent?.includes('°'))
    expect(degreeTexts.length).toBeGreaterThan(0)
  })
})
