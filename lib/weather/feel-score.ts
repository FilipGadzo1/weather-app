export type FeelScoreLabel = 'Great' | 'Good' | 'Fair' | 'Uncomfortable' | 'Extreme'

export interface FeelScore {
  label: FeelScoreLabel
  tip: string
  color: string
  bgColor: string
}

const ORDER: FeelScoreLabel[] = ['Great', 'Good', 'Fair', 'Uncomfortable', 'Extreme']

function baseBandFromFeelsLike(t: number): FeelScoreLabel {
  if (t < -5)  return 'Extreme'
  if (t < 5)   return 'Uncomfortable'
  if (t <= 12) return 'Fair'
  if (t < 18)  return 'Good'
  if (t < 24)  return 'Great'
  if (t < 28)  return 'Good'
  if (t < 32)  return 'Fair'
  if (t < 38)  return 'Uncomfortable'
  return 'Extreme'
}

function demote(label: FeelScoreLabel, steps: number): FeelScoreLabel {
  const idx = Math.min(ORDER.indexOf(label) + steps, ORDER.length - 1)
  return ORDER[idx]
}

function computeTip(t: number, h: number, w: number): string {
  if (t < -5)  return 'Bitter cold'
  if (t < 5)   return w > 40 ? 'Cold + windy' : 'Cold'
  if (t <= 12) return 'Crisp'
  if (t < 18)  return 'Mild'
  if (t < 24)  return h > 70 ? 'Pleasant, humid' : 'Pleasant'
  if (t < 28)  return h > 70 ? 'Muggy' : 'Warm'
  if (t < 32)  return h > 70 ? 'Hot + humid' : 'Hot'
  if (t < 38)  return 'Very hot'
  return 'Dangerous heat'
}

const styleMap: Record<FeelScoreLabel, Pick<FeelScore, 'color' | 'bgColor'>> = {
  Great:         { color: 'text-green-300',   bgColor: 'bg-green-500/20'   },
  Good:          { color: 'text-emerald-300', bgColor: 'bg-emerald-500/20' },
  Fair:          { color: 'text-yellow-300',  bgColor: 'bg-yellow-500/20'  },
  Uncomfortable: { color: 'text-orange-300',  bgColor: 'bg-orange-500/20'  },
  Extreme:       { color: 'text-red-300',     bgColor: 'bg-red-500/20'     },
}

export function computeFeelScore(input: {
  feelsLikeC: number
  humidity: number
  windSpeed: number
}): FeelScore {
  let label = baseBandFromFeelsLike(input.feelsLikeC)
  let steps = 0
  if (input.humidity > 70 && input.feelsLikeC >= 18) steps += 1
  if (input.windSpeed > 40 && input.feelsLikeC < 10) steps += 1
  label = demote(label, steps)
  const tip = computeTip(input.feelsLikeC, input.humidity, input.windSpeed)
  return { label, tip, ...styleMap[label] }
}
