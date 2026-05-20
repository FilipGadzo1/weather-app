import { render } from '@testing-library/react'
import AirQualityCard from '@/components/weather/AirQualityCard'
import type { AirQualityData } from '@/types/weather'

const baseData: AirQualityData = {
  usAqi: 50,
  pm25: 10.0,
  pm10: 20.0,
  europeanAqi: 30,
}

describe('AirQualityCard', () => {
  it('renders nothing when usAqi is null', () => {
    const { container } = render(<AirQualityCard data={{ ...baseData, usAqi: null }} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders bar with bg-green-400 for usAqi=50', () => {
    const { container } = render(<AirQualityCard data={{ ...baseData, usAqi: 50 }} />)
    const bar = container.querySelector('.bg-green-400')
    expect(bar).toBeInTheDocument()
  })

  it('renders bar with bg-yellow-400 for usAqi=75', () => {
    const { container } = render(<AirQualityCard data={{ ...baseData, usAqi: 75 }} />)
    const bar = container.querySelector('.bg-yellow-400')
    expect(bar).toBeInTheDocument()
  })

  it('renders bar width at 70% for usAqi=350', () => {
    const { container } = render(<AirQualityCard data={{ ...baseData, usAqi: 350 }} />)
    const bar = container.querySelector('.rounded-full.transition-all') as HTMLElement
    expect(bar).toHaveStyle({ width: '70%' })
  })

  it('renders bar width at 30% for usAqi=150', () => {
    const { container } = render(<AirQualityCard data={{ ...baseData, usAqi: 150 }} />)
    const bar = container.querySelector('.rounded-full.transition-all') as HTMLElement
    expect(bar).toHaveStyle({ width: '30%' })
  })

  it('caps bar width at 100% for usAqi=600', () => {
    const { container } = render(<AirQualityCard data={{ ...baseData, usAqi: 600 }} />)
    const bar = container.querySelector('.rounded-full.transition-all') as HTMLElement
    expect(bar).toHaveStyle({ width: '100%' })
  })

  it('renders bar width at 10% for usAqi=50', () => {
    const { container } = render(<AirQualityCard data={{ ...baseData, usAqi: 50 }} />)
    const bar = container.querySelector('.rounded-full.transition-all') as HTMLElement
    expect(bar).toHaveStyle({ width: '10%' })
  })
})
