'use client'

import { Sun, Calendar, Cloud, Sparkles } from 'lucide-react'
import type { TabKey } from './TabBar'

const NAV_ITEMS: { key: TabKey; label: string; Icon: React.ElementType }[] = [
  { key: 'today',      label: 'Today',    Icon: Sun      },
  { key: 'week',       label: 'Week',     Icon: Calendar },
  { key: 'atmosphere', label: 'Atmos',    Icon: Cloud    },
  { key: 'insights',   label: 'Insights', Icon: Sparkles },
]

interface MobileNavProps {
  active: TabKey
  onChange: (tab: TabKey) => void
}

export function MobileNav({ active, onChange }: MobileNavProps) {
  return (
    <nav
      className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-1.5 rounded-full border border-white/15"
      style={{
        background: 'rgba(8,13,26,0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {NAV_ITEMS.map(({ key, label, Icon }) => {
        const isActive = active === key
        return (
          <button
            key={key}
            type="button"
            aria-current={String(isActive) as 'true' | 'false'}
            aria-label={label}
            onClick={() => onChange(key)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-full transition-all duration-150 ${
              isActive ? 'bg-blue-500/20' : ''
            }`}
          >
            <Icon
              size={18}
              className={isActive ? 'text-blue-400' : 'text-white/40'}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span
              className={`text-[10px] leading-none ${isActive ? 'text-blue-400 font-semibold' : 'text-white/40'}`}
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
