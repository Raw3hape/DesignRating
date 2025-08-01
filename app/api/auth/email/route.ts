import { NextRequest, NextResponse } from 'next/server'
import { KVService } from '@/lib/kv'

// Rate limiting storage
const rateLimitStorage = new Map<string, { count: number; resetTime: number }>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check for temporary email domains
    const tempDomains = ['tempmail', 'throwaway', 'guerrilla', '10minute', 'mailinator', '10minutemail', 'guerrillamail']
    const domain = email.split('@')[1].toLowerCase()
    if (tempDomains.some(temp => domain.includes(temp))) {
      return NextResponse.json(
        { error: 'Please use a permanent email address' },
        { status: 400 }
      )
    }

    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const now = Date.now()
    const windowMs = 60 * 1000 // 1 minute
    const maxRequests = 5

    const rateLimitKey = `rate:${ip}`
    const currentRateLimit = rateLimitStorage.get(rateLimitKey)

    if (currentRateLimit) {
      if (now < currentRateLimit.resetTime) {
        if (currentRateLimit.count >= maxRequests) {
          return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
          )
        }
        currentRateLimit.count++
      } else {
        // Reset window
        rateLimitStorage.set(rateLimitKey, { count: 1, resetTime: now + windowMs })
      }
    } else {
      rateLimitStorage.set(rateLimitKey, { count: 1, resetTime: now + windowMs })
    }

    try {
      // Check if user already exists
      const existingUser = await KVService.getUser(email)
      
      if (existingUser) {
        return NextResponse.json({
          success: true,
          user: existingUser,
          message: 'Welcome back!'
        })
      }

      // Create new user
      const userData = await KVService.createUser(email)

      // Update global stats
      try {
        await KVService.incrementGlobalStats(1, 0) // increment user count
      } catch (statsError) {
        console.error('Error updating global stats:', statsError)
        // Continue without failing
      }

      return NextResponse.json({
        success: true,
        user: userData,
        message: 'Email registered successfully!'
      })
      
    } catch (error) {
      console.error('User creation error:', error)
      
      // Fallback
      const userData = await KVService.createUser(email)
      return NextResponse.json({
        success: true,
        user: userData,
        message: 'Email registered successfully!'
      })
    }

  } catch (error) {
    console.error('Email registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}