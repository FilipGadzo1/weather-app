import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildWearPrompt } from '@/lib/claude/prompts'
import type { GeoLocation, CurrentWeather, TemperatureUnit } from '@/types/weather'

const FALLBACK = 'Dress for the weather and check current conditions.'

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'AI features not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body: { location: GeoLocation; weather: CurrentWeather; unit: TemperatureUnit }
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (
    !body?.location?.name ||
    typeof body?.weather?.temperature !== 'number' ||
    (body.unit !== 'C' && body.unit !== 'F')
  ) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 80,
      messages: [{
        role: 'user',
        content: buildWearPrompt(body.location, body.weather, body.unit),
      }],
    })

    const raw = msg.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('')
      .trim()

    const firstSentence = raw.split('. ')[0]
    const text = firstSentence
      ? (firstSentence.endsWith('.') ? firstSentence : `${firstSentence}.`)
      : FALLBACK

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ text: FALLBACK }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
