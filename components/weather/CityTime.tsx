'use client'

import { useState, useEffect } from 'react'

function formatTime(timezone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  }).format(new Date())
}

export function CityTime({ timezone }: { timezone: string }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    setTime(formatTime(timezone))
    const id = setInterval(() => setTime(formatTime(timezone)), 1000)
    return () => clearInterval(id)
  }, [timezone])

  return (
    <p
      className="text-white/45 text-xs mt-0.5 tabular-nums"
      style={{ fontFamily: 'var(--font-outfit)' }}
    >
      {time} · local time
    </p>
  )
}
