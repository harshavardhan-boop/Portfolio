import 'server-only'

/**
 * Fixed-window rate limiter.
 * - Uses Upstash Redis (REST) when UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set,
 *   which is shared across all serverless instances.
 * - Otherwise falls back to an in-memory Map (per instance — best effort on serverless).
 */

type Result = { ok: boolean; remaining: number; resetInSeconds: number }

const memory = new Map<string, { count: number; resetAt: number }>()

function memoryLimit(key: string, limit: number, windowSec: number): Result {
  const now = Date.now()
  // Opportunistic cleanup so the map can't grow unbounded
  if (memory.size > 5_000) for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k)

  const entry = memory.get(key)
  if (!entry || entry.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + windowSec * 1000 })
    return { ok: true, remaining: limit - 1, resetInSeconds: windowSec }
  }
  entry.count += 1
  return {
    ok: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    resetInSeconds: Math.ceil((entry.resetAt - now) / 1000),
  }
}

async function upstashLimit(key: string, limit: number, windowSec: number): Promise<Result> {
  const url = process.env.UPSTASH_REDIS_REST_URL!
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([
      ['INCR', key],
      ['EXPIRE', key, String(windowSec), 'NX'],
      ['TTL', key],
    ]),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Upstash ${res.status}`)
  const results = (await res.json()) as { result: number }[]
  const count = results[0].result
  const ttl = results[2].result
  return { ok: count <= limit, remaining: Math.max(0, limit - count), resetInSeconds: ttl > 0 ? ttl : windowSec }
}

export async function rateLimit(identifier: string, { limit, windowSec }: { limit: number; windowSec: number }) {
  const key = `rl:contact:${identifier}`
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      return await upstashLimit(key, limit, windowSec)
    } catch (err) {
      console.error('[rate-limit] Upstash failed, using memory:', err)
    }
  }
  return memoryLimit(key, limit, windowSec)
}
