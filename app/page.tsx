import { SearchBar } from '@/components/search/SearchBar'
import { RecentSearches } from '@/components/search/RecentSearches'
import UseMyLocationButton from '@/components/locations/UseMyLocationButton'
import { SavedLocations } from '@/components/locations/SavedLocations'
import { WeatherBackground } from '@/components/weather/WeatherBackground'

// Star positions are fixed so the layout is stable (no random per-render)
const STARS = [
  { top: '8%',  left: '12%', duration: '2.8s', delay: '0s'    },
  { top: '14%', left: '78%', duration: '3.4s', delay: '0.7s'  },
  { top: '22%', left: '34%', duration: '2.2s', delay: '1.3s'  },
  { top: '31%', left: '91%', duration: '4.1s', delay: '0.3s'  },
  { top: '6%',  left: '55%', duration: '3.0s', delay: '1.8s'  },
  { top: '41%', left: '7%',  duration: '2.6s', delay: '0.9s'  },
  { top: '18%', left: '62%', duration: '3.7s', delay: '2.1s'  },
  { top: '52%', left: '88%', duration: '2.4s', delay: '0.5s'  },
  { top: '37%', left: '47%', duration: '3.1s', delay: '1.6s'  },
  { top: '11%', left: '23%', duration: '4.3s', delay: '0.2s'  },
  { top: '28%', left: '5%',  duration: '2.9s', delay: '2.4s'  },
  { top: '46%', left: '71%', duration: '3.5s', delay: '1.1s'  },
  { top: '57%', left: '19%', duration: '2.7s', delay: '0.8s'  },
  { top: '65%', left: '42%', duration: '3.8s', delay: '1.9s'  },
  { top: '72%', left: '83%', duration: '2.3s', delay: '0.4s'  },
  { top: '4%',  left: '39%', duration: '4.0s', delay: '2.7s'  },
  { top: '33%', left: '67%', duration: '3.2s', delay: '0.6s'  },
  { top: '60%', left: '29%', duration: '2.5s', delay: '1.4s'  },
  { top: '78%', left: '56%', duration: '3.6s', delay: '2.0s'  },
  { top: '48%', left: '95%', duration: '2.1s', delay: '1.0s'  },
]

export default function HomePage() {
  return (
    <WeatherBackground backgroundKey="clear-night">
      {/* Decorative atmospheric layer — stars + radial glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        {/* Radial glow behind the hero title */}
        <div
          className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.045) 0%, transparent 70%)',
          }}
        />
        {/* CSS-only twinkling stars */}
        {STARS.map((s, i) => (
          <span
            key={i}
            className="star"
            style={{
              top: s.top,
              left: s.left,
              '--duration': s.duration,
              '--delay': s.delay,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="min-h-screen flex flex-col relative">
        {/* Hero section */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-10">
          {/* Branding */}
          <div className="text-center mb-10 relative">
            <h1
              className="text-8xl md:text-9xl font-bold text-white leading-none mb-4 drop-shadow-[0_2px_24px_rgba(255,255,255,0.15)]"
              style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
            >
              Skye
            </h1>
            <p
              className="text-white/40 text-xs uppercase tracking-[0.45em] font-light"
              style={{ fontFamily: 'var(--font-outfit)', letterSpacing: '0.45em' }}
            >
              Weather&nbsp;&nbsp;Intelligence
            </p>
          </div>

          {/* Search — primary action */}
          <div className="w-full max-w-xl">
            <SearchBar placeholder="Search any city…" />
          </div>

          {/* Use location */}
          <div className="mt-4">
            <UseMyLocationButton />
          </div>
        </div>

        {/* Bottom tray */}
        <div className="px-4 pb-10 flex flex-col items-center gap-3 w-full max-w-xl mx-auto">
          <RecentSearches />
          <SavedLocations />
        </div>
      </div>
    </WeatherBackground>
  )
}
