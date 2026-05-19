import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildActivityPrompt } from '@/lib/claude/prompts'
import type { GeoLocation, CurrentWeather } from '@/types/weather'

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'AI features not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body: { location: GeoLocation; weather: CurrentWeather }
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!body?.location?.name || typeof body?.weather?.temperature !== 'number') {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await anthropic.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 600,
          messages: [{
            role: 'user',
            content: buildActivityPrompt(body.location, body.weather),
          }],
        })

        for await (const chunk of response) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
      } catch {
        controller.enqueue(encoder.encode('\n[Error generating suggestions]'))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
