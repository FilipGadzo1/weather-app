import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildAlertPrompt } from '@/lib/claude/prompts'
import type { GeoLocation, CurrentWeather } from '@/types/weather'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  const body = await request.json() as { location: GeoLocation; weather: CurrentWeather }

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
