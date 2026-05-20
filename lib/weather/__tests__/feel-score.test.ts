import { computeFeelScore } from '../feel-score'

describe('computeFeelScore', () => {
  it('returns Great for pleasant temperature', () => {
    expect(computeFeelScore({ feelsLikeC: 20, humidity: 50, windSpeed: 5 }).label).toBe('Great')
  })

  it('demotes Good to Fair when humidity > 70 and feelsLike >= 18', () => {
    // feelsLike 26 → Good band, humidity 85 > 70 and 26 >= 18 → demote to Fair
    expect(computeFeelScore({ feelsLikeC: 26, humidity: 85, windSpeed: 5 }).label).toBe('Fair')
  })

  it('demotes Uncomfortable to Extreme when wind > 40 and feelsLike < 10', () => {
    // feelsLike 2 → Uncomfortable, wind 50 > 40 and 2 < 10 → demote to Extreme
    expect(computeFeelScore({ feelsLikeC: 2, humidity: 50, windSpeed: 50 }).label).toBe('Extreme')
  })

  it('demotes Great to Good when humidity > 70 and feelsLike >= 18', () => {
    // feelsLike 20 → Great, humidity 71 > 70 and 20 >= 18 → demote to Good
    expect(computeFeelScore({ feelsLikeC: 20, humidity: 71, windSpeed: 5 }).label).toBe('Good')
  })

  it('no humidity demotion when feelsLike < 18', () => {
    expect(computeFeelScore({ feelsLikeC: 15, humidity: 90, windSpeed: 5 }).label).toBe('Good')
  })

  it('no wind demotion when feelsLike >= 10', () => {
    expect(computeFeelScore({ feelsLikeC: 12, humidity: 50, windSpeed: 50 }).label).toBe('Fair')
  })

  it('clamps at Extreme with double demotion from Uncomfortable', () => {
    // feelsLike -10 → Extreme already, two demotions → still Extreme
    expect(computeFeelScore({ feelsLikeC: -10, humidity: 80, windSpeed: 50 }).label).toBe('Extreme')
  })

  it('humidity == 70 exact → no demotion (strict >)', () => {
    expect(computeFeelScore({ feelsLikeC: 20, humidity: 70, windSpeed: 5 }).label).toBe('Great')
  })

  it('wind == 40 exact → no demotion (strict >)', () => {
    expect(computeFeelScore({ feelsLikeC: 2, humidity: 50, windSpeed: 40 }).label).toBe('Uncomfortable')
  })

  it('returns tip strings for various conditions', () => {
    expect(computeFeelScore({ feelsLikeC: 20, humidity: 50, windSpeed: 5 }).tip).toBe('Pleasant')
    expect(computeFeelScore({ feelsLikeC: -8, humidity: 50, windSpeed: 5 }).tip).toBe('Bitter cold')
    expect(computeFeelScore({ feelsLikeC: 40, humidity: 50, windSpeed: 5 }).tip).toBe('Dangerous heat')
  })
})
