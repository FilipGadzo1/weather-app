import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildAlertPrompt } from '@/lib/claude/prompts'
import type { GeoLocation, CurrentWeather } from '@/types/weather'

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI features not configured' }, { status: 503 })
  }

  let body: { location: GeoLocation; weather: CurrentWeather }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body?.location?.name || typeof body?.weather?.temperature !== 'number') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: buildAlertPrompt(body.location, body.weather),
      }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return NextResponse.json({ explanation: text })
  } catch {
    return NextResponse.json({ error: 'Claude API unavailable' }, { status: 502 })
  }
}
