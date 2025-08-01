export interface AnalysisData {
  score: number
  category: string
  insights: string[]
  improvements: string[]
  strengths: string[]
  images: string[]
  comparison: {
    percentile: number
    description: string
  }
}

export interface ScoreColors {
  bg: string
  text: string
  border: string
}

export interface UserStats {
  totalAnalyses: number
  freeAnalysesUsed: number
  averageScore: number
}

// KV Storage Types
export interface User {
  email: string
  createdAt: string
  analysisCount: number
  lastAnalysis: string | null
}

export interface Analysis {
  id: string
  email: string
  score: number
  category: string
  insights: string[]
  improvements: string[]
  strengths: string[]
  images: string[]
  comparison: {
    percentile: number
    description: string
  }
  createdAt: string
  imagesCount: number
}

export interface GlobalStats {
  totalUsers: number
  totalAnalyses: number
  createdAt: string
  updatedAt?: string
}

export interface DailyStats {
  date: string
  analyses: number
  uniqueUsers: string[]
  uniqueUsersCount: number
}

export interface AdminStatsResponse {
  success: boolean
  data: {
    global: GlobalStats
    daily: DailyStats[]
    recentAnalyses: Analysis[]
    topUsers: any[]
  }
  timestamp: string
  note?: string
}