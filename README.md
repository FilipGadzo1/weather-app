# Skye

A clean, fast weather app built with Next.js. Searches any city worldwide and shows current conditions, hourly/weekly forecasts, air quality, UV index, and more — no API key required.

## Features

- **City search** — find any location worldwide via Open-Meteo geocoding
- **Tabbed layout** — Now, Week, and Insights tabs with desktop tab bar and mobile floating nav
- **Dynamic backgrounds** — full-screen images that match current conditions (sunny, rain, snow, night, aurora)
- **Now tab** — current conditions, hourly charts (temperature, precipitation, humidity, UV, wind), sunrise/sunset
- **Week tab** — 7-day forecast strip, weekly sparkline, moon phase, best time to go outside
- **Insights tab** — air quality card and UV index
- **Save locations** — bookmark cities, persisted in local storage
- **Temperature toggle** — switch between °C and °F

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Zustand](https://zustand-demo.pmnd.rs) — client state
- [Framer Motion](https://www.framer.com/motion) — animations
- [Open-Meteo](https://open-meteo.com) — free weather & geocoding API (no key needed)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm test` | Run test suite (Jest) |
| `npm run lint` | Lint with ESLint |
