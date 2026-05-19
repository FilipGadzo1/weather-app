import type { CurrentWeather, GeoLocation, TemperatureUnit } from '@/types/weather'
import { getWmoInfo } from '@/lib/weather/wmo-codes'

export function buildActivityPrompt(location: GeoLocation, weather: CurrentWeather): string {
  const condition = getWmoInfo(weather.wmoCode)
  const tempStr = `${Math.round(weather.temperature)}°C (feels like ${Math.round(weather.feelsLike)}°C)`

  return `You are a friendly local guide for ${location.name}, ${location.country}.

Current weather: ${condition.label}. Temperature: ${tempStr}. Wind: ${weather.windSpeed} km/h.
Humidity: ${weather.humidity}%. UV Index: ${weather.uvIndex}.
Precipitation chance: ${weather.precipitationProbability}%.

Suggest 5 activities that are perfect for this weather right now. For each activity:
- Give it a catchy name (2-4 words)
- Write one sentence explaining why it's ideal for this specific weather
- Add a relevant emoji

Format as a numbered list. Be specific to the weather conditions — don't suggest outdoor activities in heavy rain, don't suggest indoor activities on a perfect sunny day. Be enthusiastic and practical.`
}

export function buildAlertPrompt(location: GeoLocation, weather: CurrentWeather): string {
  const condition = getWmoInfo(weather.wmoCode)

  return `You are a friendly but clear safety advisor.

Location: ${location.name}, ${location.country}
Severe weather condition: ${condition.label}
Temperature: ${Math.round(weather.temperature)}°C, Wind: ${weather.windSpeed} km/h, Visibility: ${weather.visibility} km

Explain this weather condition in plain language. Cover:
1. What exactly is happening with the weather (1-2 sentences, no jargon)
2. What people should avoid doing right now
3. What people should do to stay safe
4. How long this type of condition typically lasts

Keep it under 150 words. Be direct and helpful, not alarmist.`
}

export function buildWearPrompt(
  location: GeoLocation,
  weather: CurrentWeather,
  unit: TemperatureUnit
): string {
  const t = unit === 'F'
    ? `${Math.round(weather.temperature * 9 / 5 + 32)}°F (feels like ${Math.round(weather.feelsLike * 9 / 5 + 32)}°F)`
    : `${Math.round(weather.temperature)}°C (feels like ${Math.round(weather.feelsLike)}°C)`
  return `Weather in ${location.name}: ${t}, ${getWmoInfo(weather.wmoCode).label}, wind ${weather.windSpeed} km/h, precipitation chance ${weather.precipitationProbability}%.

Reply with ONE short sentence (max 20 words) recommending what to wear today. No preamble. No list. Just the sentence.`
}
