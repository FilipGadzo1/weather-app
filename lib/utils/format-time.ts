export function formatTimeInZone(iso: string | null, timezone: string): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  }).format(new Date(iso))
}
