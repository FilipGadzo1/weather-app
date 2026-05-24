interface WeatherIconProps {
  iconKey: string
  size?: number
  className?: string
  isDay?: boolean
}

const ICONS: Record<string, string> = {
  clear: '☀️',
  'clear-night': '🌙',
  cloudy: '⛅',
  'cloudy-night': '☁️',
  fog: '🌫️',
  rain: '🌧️',
  snow: '❄️',
  storm: '⛈️',
}

function resolveIconKey(iconKey: string, isDay: boolean): string {
  if (!isDay) {
    if (iconKey === 'clear') return 'clear-night'
    if (iconKey === 'cloudy') return 'cloudy-night'
  }
  return iconKey
}

export function WeatherIcon({ iconKey, size = 48, className = '', isDay = true }: WeatherIconProps) {
  const resolved = resolveIconKey(iconKey, isDay)
  const emoji = ICONS[resolved] ?? '🌤️'
  return (
    <span
      className={`inline-block select-none ${className}`}
      style={{ fontSize: size }}
      role="img"
      aria-label={resolved}
    >
      {emoji}
    </span>
  )
}
