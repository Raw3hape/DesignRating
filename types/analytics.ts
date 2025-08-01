export interface DetailedMetrics {
  visualHierarchy: number
  typography: number
  colorPalette: number
  composition: number
  innovation: number
  usability: number
}

export interface ScoreBreakdownData {
  technical: number
  aesthetic: number
  innovation: number
  usability: number
}

export interface InsightItem {
  type: 'strength' | 'weakness' | 'opportunity' | 'achievement'
  title: string
  description: string
}

export interface TrendItem {
  name: string
  alignment: number // -100 to 100
  description: string
}

export interface ExpertAdviceItem {
  expert: string
  role: string
  message: string
  avatar?: string
}

export interface RecommendationItem {
  type: 'course' | 'video' | 'tool' | 'article'
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime?: string
}

export interface ExtendedAnalysisData {
  // Original fields
  score: number
  category: string
  insights: string[]
  improvements: string[]
  strengths: string[]
  positives: string[]
  negatives: string[]
  images: string[]
  comparison: {
    percentile: number
    description: string
  }
  
  // New analytics fields
  metrics?: DetailedMetrics
  breakdown?: ScoreBreakdownData
  detailedInsights?: InsightItem[]
  trends?: TrendItem[]
  expertAdvice?: ExpertAdviceItem[]
  recommendations?: RecommendationItem[]
  totalEvaluations?: number
}