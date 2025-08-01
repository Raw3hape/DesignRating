import { NextRequest, NextResponse } from 'next/server'

// Rate limiting storage (use Redis in production)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>()

export function middleware(request: NextRequest) {
  // Rate limiting only for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const now = Date.now()
    const windowMs = 15 * 60 * 1000 // 15 minutes
    const maxRequests = 10 // maximum 10 requests per 15 minutes

    const key = `${ip}:${request.nextUrl.pathname}`
    const record = rateLimitStore.get(key)

    if (record) {
      // Reset counter if more than 15 minutes passed
      if (now - record.timestamp > windowMs) {
        rateLimitStore.set(key, { count: 1, timestamp: now })
      } else if (record.count >= maxRequests) {
        // Limit exceeded
        return NextResponse.json(
          { 
            error: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((record.timestamp + windowMs - now) / 1000)
          },
          { status: 429 }
        )
      } else {
        // Increment counter
        record.count++
      }
    } else {
      // First request
      rateLimitStore.set(key, { count: 1, timestamp: now })
    }

    // Clean up old records
    if (Math.random() < 0.01) { // 1% chance for cleanup
      for (const [key, record] of rateLimitStore.entries()) {
        if (now - record.timestamp > windowMs) {
          rateLimitStore.delete(key)
        }
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
}