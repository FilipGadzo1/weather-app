'use client'

import { useState, useEffect } from 'react'
import { getMoonPhase, SYNODIC_MONTH } from '@/lib/weather/moon-phase'

interface MoonPhaseCardProps {
  date?: Date
}

export function MoonPhaseCard({ date }: MoonPhaseCardProps) {
  const [moon, setMoon] = useState(() => getMoonPhase(new Date(0)))

  useEffect(() => {
    setMoon(getMoonPhase(date ?? new Date()))
  }, [date])
  const age = moon.ageInDays
  const isWaxing = age < SYNODIC_MONTH / 2

  // shadowRadius: large at new moon (age=0), shrinks toward full moon (age≈14.77), grows back
  // cos(π·age/SYNODIC) → 1 at new moon, 0 at full moon; right edge of shadow is always at disc center
  const shadowRadius = Math.round(34 * Math.abs(Math.cos((Math.PI * age) / SYNODIC_MONTH)))

  // Waxing: shadow pushed LEFT → right side is lit; Waning: shadow pushed RIGHT → left side is lit
  const shadowCx = isWaxing ? 40 - shadowRadius : 40 + shadowRadius

  return (
    <div className="glass-card p-4" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider mb-4">
        Moon Phase
      </h2>
      <div className="flex items-center gap-6">
        <svg viewBox="0 0 80 80" className="w-20 h-20 flex-shrink-0">
          <circle cx="40" cy="40" r="36" fill="rgba(10,20,40,0.8)" />
          {moon.illumination > 1 && (
            <circle cx="40" cy="40" r="34" fill="rgba(220,220,200,0.85)" />
          )}
          {moon.illumination > 1 && moon.illumination < 99 && (
            <ellipse
              cx={shadowCx}
              cy="40"
              rx={Math.max(0, shadowRadius)}
              ry="34"
              fill="rgba(10,20,40,0.92)"
            />
          )}
          <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        </svg>

        <div className="flex flex-col gap-1">
          <span className="text-2xl">{moon.emoji}</span>
          <p className="text-white font-semibold text-base">{moon.phase}</p>
          <p className="text-white/60 text-sm">{moon.illumination}% illuminated</p>
          <p className="text-white/40 text-xs">Day {moon.ageInDays} of 29.5</p>
        </div>
      </div>
    </div>
  )
}
