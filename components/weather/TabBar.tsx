export type TabKey = 'today' | 'week' | 'atmosphere' | 'insights'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'today',      label: 'Today'      },
  { key: 'week',       label: 'This Week'  },
  { key: 'atmosphere', label: 'Atmosphere' },
  { key: 'insights',   label: 'Insights'   },
]

interface TabBarProps {
  active: TabKey
  onChange: (tab: TabKey) => void
}

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div
      className="hidden md:flex gap-1 p-1 rounded-xl border border-white/10"
      style={{ background: 'rgba(255,255,255,0.04)' }}
      role="tablist"
    >
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={active === key}
          onClick={() => onChange(key)}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-150 ${
            active === key
              ? 'bg-blue-500 text-white'
              : 'text-white/50 hover:text-white/80'
          }`}
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
