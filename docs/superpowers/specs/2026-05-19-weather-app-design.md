# Weather App — Design Spec

**Date:** 2026-05-19  
**Status:** Approved  
**Scope:** Medium (no accounts, localStorage persistence)

---

## Overview

A portfolio-quality weather web app built with Next.js + React + Claude API. The app lets users search any city, view current conditions and a 5-day forecast, save up to 5 locations, and get Claude-powered AI features: an Activity Advisor and an Alert Explainer.

---

## Goals

- Top-notch visual design (dark-first, glassmorphism, dynamic backgrounds)
- Fully functional with real weather data (no mocked APIs)
- Claude as a genuine feature, not a gimmick: activity suggestions + alert translation
- No user accounts — localStorage for all persistence
- Portfolio-ready: clean code, responsive, polished

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Weather API | Open-Meteo (free, no key needed) |
| Geocoding | Open-Meteo Geocoding API |
| AI | Claude API via `@anthropic-ai/sdk` (claude-sonnet-4-6) |
| State | Zustand |
| Persistence | localStorage (saved cities) |

---

## Pages

### `/` — Home / Search
- Full-screen search experience
- Autocomplete dropdown as user types (geocoding API)
- Shows saved locations below the search bar if any exist

### `/city/[slug]` — City Detail
- `slug` = URL-encoded city name (e.g., `new-york`)
- Coordinates resolved via geocoding on first visit, cached in state
- Contains all weather components for that city

---

## Components

### `SearchBar`
- Debounced input (300ms) → geocoding API call
- Dropdown with up to 5 city suggestions (name, country, region)
- On select: navigates to `/city/[slug]`, stores `{name, lat, lon}` in Zustand

### `WeatherBackground`
- Full-page gradient backdrop
- Condition + time-of-day mapping:
  - Clear day → sky blue → white
  - Clear night → dark navy → purple
  - Cloudy → grey-blue
  - Rain → dark teal
  - Snow → light blue-white
  - Thunderstorm → dark grey-purple
- Subtle CSS animations: drifting clouds, rain streaks, snow flakes, sun glow

### `WeatherCard`
- Current conditions hero card (glassmorphism)
- Fields: temperature (°C/°F toggle), feels-like, weather description, wind speed/direction, humidity, UV index, visibility
- Large weather icon (animated SVG or Lottie)

### `ForecastStrip`
- 5-day forecast as horizontal scrollable cards
- Each card: day name, high/low, condition icon, precipitation probability
- Clicking a day expands hourly breakdown (24h) below

### `SavedLocations`
- Horizontal pill/chip list at top of page (mobile) or sidebar (desktop)
- Up to 5 cities; add via pin button on city detail page
- Remove via × on each chip
- Persisted in localStorage via Zustand middleware

### `ActivityAdvisor`
- Panel on city detail page below forecast
- Button: "Suggest Activities for Today"
- Calls `/api/claude/activities` (POST, streaming)
- Displays 4–6 activity suggestions as chips/cards with brief reasoning
- Shows loading skeleton during streaming

### `AlertExplainer`
- Only visible when forecast contains severe WMO weather codes (thunderstorm ≥95, blizzard ≥71, heavy rain ≥65, fog ≥45)
- Collapsible card: shows condition name + icon by default
- Expand: calls `/api/claude/explain-alert` (POST, non-streaming)
- Renders Claude's plain-language explanation: what it means, what to do, how long it typically lasts

---

## API Routes

### `POST /api/claude/activities`
**Input:**
```json
{
  "city": "London",
  "forecast": { "temperature": 18, "condition": "partly cloudy", "precipitation": 10, "wind": 12 }
}
```
**Behavior:** Streams a Claude response suggesting 4–6 activities appropriate for the weather.  
**Prompt pattern:** System prompt establishes Claude as a friendly local guide; user message includes forecast data.

### `POST /api/claude/explain-alert`
**Input:**
```json
{
  "city": "Miami",
  "condition": { "wmoCode": 95, "label": "Thunderstorm with slight hail", "temperature": 28, "wind": 45 }
}
```
**Behavior:** Returns Claude's plain-language explanation of the severe condition: what it means, safety advice, and expected duration.

Both routes use `@anthropic-ai/sdk` server-side. API key stored in `.env.local` as `ANTHROPIC_API_KEY`. Never exposed to client.

---

## Data Flow

```
User types city name
  → /api/geocode (or direct Open-Meteo geocoding)
  → Returns [{name, lat, lon, country}]
  → User selects → navigate to /city/[slug]

City detail page loads
  → Fetch Open-Meteo forecast (lat, lon)
  → Render WeatherCard + ForecastStrip
  → If severe WMO code in response (≥45) → show AlertExplainer (collapsed)
  → User clicks "Suggest Activities" → POST /api/claude/activities (streaming)
  → User expands alert → POST /api/claude/explain-alert
```

---

## State Shape (Zustand)

```ts
interface WeatherStore {
  currentCity: { name: string; lat: number; lon: number } | null;
  savedLocations: Array<{ name: string; lat: number; lon: number }>;
  temperatureUnit: 'C' | 'F';
  setCurrentCity: (city: ...) => void;
  addSavedLocation: (city: ...) => void;
  removeSavedLocation: (name: string) => void;
  toggleTemperatureUnit: () => void;
}
```

localStorage persisted via `zustand/middleware` `persist`.

---

## Design System

- **Color palette:** Dark slate base (#0f172a), glass cards (white/10 opacity), accent blue (#38bdf8), alert amber (#f59e0b)
- **Typography:** Inter (body), Clash Display or Cal Sans (headings)
- **Cards:** `backdrop-blur-md`, `bg-white/10`, `border border-white/20`, `rounded-2xl`
- **Animations:** Framer Motion for card enter/exit, CSS keyframes for weather particles
- **Responsive:** Mobile-first; single column on mobile, 2-col sidebar on desktop (md+)

---

## Error Handling

- Geocoding returns no results → "City not found" inline message
- Open-Meteo fetch fails → error card with retry button
- Claude API error → graceful fallback message ("Suggestions unavailable right now")
- No API key → development warning in console, ActivityAdvisor disabled

---

## Environment Variables

```
ANTHROPIC_API_KEY=your_key_here
```

Open-Meteo requires no key. Geocoding uses Open-Meteo's free geocoding endpoint.

---

## Out of Scope

- User authentication
- Backend database
- Push notifications
- Weather maps/radar
- More than 5 saved locations
- Historical weather data
