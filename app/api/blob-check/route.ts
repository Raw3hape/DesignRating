import { NextResponse } from 'next/server'
import { head, list } from '@vercel/blob'

export async function GET() {
  try {
    // List all blobs
    const { blobs } = await list()
    
    // Try to read global stats
    let globalStats = null
    try {
      const statsBlob = await head('data/stats:global.json')
      if (statsBlob) {
        const response = await fetch(statsBlob.url)
        globalStats = await response.json()
      }
    } catch (e) {
      console.error('Error reading global stats:', e)
    }
    
    return NextResponse.json({
      blobs: blobs.map(b => ({
        pathname: b.pathname,
        size: b.size,
        uploadedAt: b.uploadedAt
      })),
      globalStats,
      totalBlobs: blobs.length
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to read blobs',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}