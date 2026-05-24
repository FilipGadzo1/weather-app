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
      className="hidden md:flex gap-1 p-1 rounded-xl"
      style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
      role="tablist"
    >
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={active === key}
          onClick={() => onChange(key)}
          className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-150"
          style={{
            fontFamily: 'var(--font-outfit)',
            background: active === key ? 'rgba(255,255,255,0.14)' : 'transparent',
            color: active === key ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)',
            border: active === key ? '1px solid rgba(255,255,255,0.18)' : '1px solid transparent',
            boxShadow: active === key ? '0 2px 8px rgba(0,0,0,0.25)' : 'none',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
