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