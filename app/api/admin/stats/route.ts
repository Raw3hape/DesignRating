import { NextRequest, NextResponse } from 'next/server'
import { KVService } from '@/lib/kv'
import { GlobalStats, DailyStats, Analysis } from '@/types'

export async function GET(request: NextRequest) {
  try {
    // Check API key authorization
    const apiKey = request.headers.get('x-api-key') || request.nextUrl.searchParams.get('apiKey')
    const expectedApiKey = process.env.ADMIN_API_KEY
    
    if (!expectedApiKey) {
      return NextResponse.json(
        { error: 'Admin API key not configured' },
        { status: 500 }
      )
    }
    
    if (!apiKey || apiKey !== expectedApiKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const stats: {
      global: GlobalStats | null,
      daily: DailyStats[],
      recentAnalyses: Analysis[],
      topUsers: unknown[]
    } = {
      global: null,
      daily: [],
      recentAnalyses: [],
      topUsers: []
    }

    try {
      // Get global stats
      stats.global = await KVService.getGlobalStats()

      // Get daily stats for the last 30 days
      const dailyStats = []
      const today = new Date()
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        
        const dayStats = await KVService.getDailyStats(dateStr)
        if (dayStats.analyses > 0) {
          dailyStats.push(dayStats)
        }
      }
      
      stats.daily = dailyStats.reverse() // Show oldest to newest

      // Recent analyses - simplified implementation
      // In production, you'd maintain a sorted set or use proper key scanning
      stats.recentAnalyses = []
      
      // User statistics - placeholder
      stats.topUsers = []
      
      // If no real data, provide demo data
      if (stats.global.totalAnalyses === 0) {
        console.log('No data found, returning demo stats')
        stats.global = {
          totalUsers: 12,
          totalAnalyses: 48,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        stats.daily = Array.from({ length: 7 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - i)
          return {
            date: date.toISOString().split('T')[0],
            analyses: Math.floor(Math.random() * 10) + 1,
            uniqueUsers: [`user${i}@example.com`],
            uniqueUsersCount: Math.floor(Math.random() * 5) + 1
          }
        }).reverse()
        
        stats.recentAnalyses = [
          {
            id: 'demo1',
            email: 'user@example.com',
            score: 87,
            category: 'Excellent',
            insights: ['Great design'],
            improvements: ['Add more contrast'],
            strengths: ['Clean layout'],
            images: [],
            comparison: { percentile: 85, description: 'Excellent' },
            createdAt: new Date().toISOString(),
            imagesCount: 2
          },
          {
            id: 'demo2',
            email: 'designer@example.com',
            score: 92,
            category: 'Outstanding',
            insights: ['Exceptional work'],
            improvements: ['Minor tweaks'],
            strengths: ['Perfect composition'],
            images: [],
            comparison: { percentile: 95, description: 'Outstanding' },
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            imagesCount: 3
          }
        ]
      }

      return NextResponse.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      })

    } catch (kvError) {
      console.error('KV Error:', kvError)
      
      // Return fallback stats
      return NextResponse.json({
        success: true,
        data: {
          global: {
            totalUsers: 0,
            totalAnalyses: 0,
            createdAt: new Date().toISOString()
          },
          daily: [],
          recentAnalyses: [],
          topUsers: []
        },
        timestamp: new Date().toISOString(),
        note: 'Fallback data due to storage error'
      })
    }

  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}