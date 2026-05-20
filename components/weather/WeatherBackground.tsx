'use client'

interface WeatherBackgroundProps {
  backgroundKey: string
  children: React.ReactNode
}

const BG_IMAGES: Record<string, string> = {
  'clear-day':   '/backgrounds/bg-sunny.png',
  'clear-night': '/backgrounds/bg-night.png',
  cloudy:        '/backgrounds/bg-cloudy.png',
  fog:           '/backgrounds/bg-cloudy.png',
  rain:          '/backgrounds/bg-rain.png',
  snow:          '/backgrounds/bg-snow.png',
  storm:         '/backgrounds/bg-rain.png',
  aurora:        '/backgrounds/bg-aurora.png',
}

const BG_OVERLAYS: Record<string, string> = {
  'clear-day':   'rgba(14,74,110,0.35)',
  'clear-night': 'rgba(5,8,30,0.55)',
  cloudy:        'rgba(30,41,59,0.50)',
  fog:           'rgba(55,65,81,0.55)',
  rain:          'rgba(7,42,60,0.55)',
  snow:          'rgba(186,230,253,0.25)',
  storm:         'rgba(10,10,15,0.65)',
  aurora:        'rgba(5,10,30,0.45)',
}

function RainParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-px bg-blue-300/40"
          style={{
            left: `${(i * 5.3) % 100}%`,
            height: `${20 + (i * 7) % 30}px`,
            animationName: 'rain-fall',
            animationDuration: `${0.6 + (i * 0.04) % 0.8}s`,
            animationDelay: `${(i * 0.1) % 2}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
          }}
        />
      ))}
    </div>
  )
}

function SnowParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-white/60"
          style={{
            left: `${(i * 3.37) % 100}%`,
            animationName: 'snow-fall',
            animationDuration: `${3 + (i * 0.13) % 4}s`,
            animationDelay: `${(i * 0.17) % 5}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
          }}
        />
      ))}
    </div>
  )
}

function SunGlow() {
  return (
    <div
      className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)',
        animationName: 'pulse-glow',
        animationDuration: '4s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'ease-in-out',
      }}
    />
  )
}

export function WeatherBackground({ backgroundKey, children }: WeatherBackgroundProps) {
  const image = BG_IMAGES[backgroundKey] ?? BG_IMAGES['clear-night']
  const overlay = BG_OVERLAYS[backgroundKey] ?? BG_OVERLAYS['clear-night']

  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Color overlay for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: overlay }}
      />
      {/* Atmospheric particles */}
      {backgroundKey === 'rain' && <RainParticles />}
      {backgroundKey === 'storm' && <RainParticles />}
      {backgroundKey === 'snow' && <SnowParticles />}
      {backgroundKey === 'clear-day' && <SunGlow />}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
