'use client'

import { useMemo } from 'react'

interface WeatherBackgroundProps {
  backgroundKey: string
  children: React.ReactNode
}

const BG_STYLES: Record<string, { from: string; to: string; via?: string }> = {
  'clear-day':   { from: '#0ea5e9', via: '#38bdf8', to: '#7dd3fc' },
  'clear-night': { from: '#0f172a', via: '#1e1b4b', to: '#312e81' },
  cloudy:        { from: '#334155', via: '#475569', to: '#64748b' },
  fog:           { from: '#374151', via: '#4b5563', to: '#6b7280' },
  rain:          { from: '#164e63', via: '#0e7490', to: '#155e75' },
  snow:          { from: '#bfdbfe', via: '#e0f2fe', to: '#f0f9ff' },
  storm:         { from: '#1c1917', via: '#292524', to: '#44403c' },
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
  const style = BG_STYLES[backgroundKey] ?? BG_STYLES['clear-day']

  const gradient = useMemo(() => {
    if (style.via) {
      return `linear-gradient(135deg, ${style.from}, ${style.via}, ${style.to})`
    }
    return `linear-gradient(135deg, ${style.from}, ${style.to})`
  }, [style])

  return (
    <div className="relative min-h-screen" style={{ background: gradient }}>
      {backgroundKey === 'rain' && <RainParticles />}
      {backgroundKey === 'snow' && <SnowParticles />}
      {backgroundKey === 'clear-day' && <SunGlow />}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
