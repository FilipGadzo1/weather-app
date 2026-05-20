interface WindCompassProps {
  degrees: number
  size?: number
}

export function WindCompass({ degrees, size = 24 }: WindCompassProps) {
  if (!Number.isFinite(degrees)) return null

  return (
    <div style={{ width: size, height: size }} className="mt-1 mx-auto">
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        aria-label={`Wind from ${degrees}°`}
        role="img"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
          fill="rgba(255,255,255,0.05)"
        />
        <text
          x="12"
          y="4.5"
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize="4"
          fontFamily="sans-serif"
        >
          N
        </text>
        <g transform={`rotate(${degrees}, 12, 12)`}>
          <path d="M12 4 L14 12 L12 10 L10 12 Z" fill="white" />
        </g>
      </svg>
    </div>
  )
}
