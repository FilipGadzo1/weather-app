import { act, renderHook } from '@testing-library/react'
import { useWeatherStore } from '../weather-store'
import type { GeoLocation } from '@/types/weather'
import { toDisplayTemp } from '../weather-store'

const city = (name: string): GeoLocation => ({
  name, country: 'US', lat: 0, lon: 0,
})

describe('recentSearches', () => {
  beforeEach(() => {
    useWeatherStore.setState({ recentSearches: [] })
  })

  it('adds a city most-recent-first', () => {
    const { result } = renderHook(() => useWeatherStore())
    act(() => result.current.addRecentSearch(city('Paris')))
    act(() => result.current.addRecentSearch(city('Tokyo')))
    expect(result.current.recentSearches[0].name).toBe('Tokyo')
    expect(result.current.recentSearches[1].name).toBe('Paris')
  })

  it('dedupes by name+country, moving to front', () => {
    const { result } = renderHook(() => useWeatherStore())
    act(() => result.current.addRecentSearch(city('Paris')))
    act(() => result.current.addRecentSearch(city('Tokyo')))
    act(() => result.current.addRecentSearch(city('Paris')))
    expect(result.current.recentSearches).toHaveLength(2)
    expect(result.current.recentSearches[0].name).toBe('Paris')
  })

  it('caps at 5, dropping the oldest', () => {
    const { result } = renderHook(() => useWeatherStore())
    ;['A','B','C','D','E','F'].forEach((n) =>
      act(() => result.current.addRecentSearch(city(n)))
    )
    expect(result.current.recentSearches).toHaveLength(5)
    expect(result.current.recentSearches.map((s) => s.name)).not.toContain('A')
  })

  it('clearRecentSearches empties the list', () => {
    const { result } = renderHook(() => useWeatherStore())
    act(() => result.current.addRecentSearch(city('Paris')))
    act(() => result.current.clearRecentSearches())
    expect(result.current.recentSearches).toHaveLength(0)
  })
})

describe('toDisplayTemp', () => {
  it('returns celsius rounded when unit is C', () => {
    expect(toDisplayTemp(25.7, 'C')).toBe(26)
    expect(toDisplayTemp(-10.3, 'C')).toBe(-10)
    expect(toDisplayTemp(0, 'C')).toBe(0)
  })

  it('converts celsius to fahrenheit', () => {
    expect(toDisplayTemp(0, 'F')).toBe(32)
    expect(toDisplayTemp(100, 'F')).toBe(212)
    expect(toDisplayTemp(-40, 'F')).toBe(-40)
  })
})
