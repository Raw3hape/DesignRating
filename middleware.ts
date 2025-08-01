import { NextRequest, NextResponse } from 'next/server'

// Rate limiting хранилище (в продакшене использовать Redis)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>()

export function middleware(request: NextRequest) {
  // Rate limiting только для API маршрутов
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const now = Date.now()
    const windowMs = 15 * 60 * 1000 // 15 минут
    const maxRequests = 10 // максимум 10 запросов за 15 минут

    const key = `${ip}:${request.nextUrl.pathname}`
    const record = rateLimitStore.get(key)

    if (record) {
      // Сброс счетчика если прошло больше 15 минут
      if (now - record.timestamp > windowMs) {
        rateLimitStore.set(key, { count: 1, timestamp: now })
      } else if (record.count >= maxRequests) {
        // Превышен лимит
        return NextResponse.json(
          { 
            error: 'Слишком много запросов. Попробуйте позже.',
            retryAfter: Math.ceil((record.timestamp + windowMs - now) / 1000)
          },
          { status: 429 }
        )
      } else {
        // Увеличиваем счетчик
        record.count++
      }
    } else {
      // Первый запрос
      rateLimitStore.set(key, { count: 1, timestamp: now })
    }

    // Очистка старых записей
    if (Math.random() < 0.01) { // 1% шанс на очистку
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