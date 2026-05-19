interface WeatherIconProps {
  iconKey: string
  size?: number
  className?: string
}

const ICONS: Record<string, string> = {
  clear: '☀️',
  cloudy: '⛅',
  fog: '🌫️',
  rain: '🌧️',
  snow: '❄️',
  storm: '⛈️',
}

export function WeatherIcon({ iconKey, size = 48, className = '' }: WeatherIconProps) {
  const emoji = ICONS[iconKey] ?? '🌤️'
  return (
    <span
      className={`inline-block select-none ${className}`}
      style={{ fontSize: size }}
      role="img"
      aria-label={iconKey}
    >
      {emoji}
    </span>
  )
}
