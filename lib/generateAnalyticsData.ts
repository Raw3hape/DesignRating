import { AnalysisData } from '@/types'
import { ExtendedAnalysisData, DetailedMetrics, ScoreBreakdownData, InsightItem, TrendItem, ExpertAdviceItem, RecommendationItem } from '@/types/analytics'

export function generateAnalyticsData(baseData: AnalysisData): ExtendedAnalysisData {
  const score = baseData.score
  
  // Generate detailed metrics based on overall score
  const metrics: DetailedMetrics = {
    visualHierarchy: Math.min(100, score + Math.floor(Math.random() * 10) - 5),
    typography: Math.min(100, score + Math.floor(Math.random() * 15) - 7),
    colorPalette: Math.min(100, score + Math.floor(Math.random() * 12) - 6),
    composition: Math.min(100, score + Math.floor(Math.random() * 8) - 4),
    innovation: Math.min(100, score + Math.floor(Math.random() * 20) - 10),
    usability: Math.min(100, score + Math.floor(Math.random() * 10) - 5)
  }
  
  // Generate score breakdown
  const breakdown: ScoreBreakdownData = {
    technical: Math.min(100, score + Math.floor(Math.random() * 10) - 5),
    aesthetic: Math.min(100, score + Math.floor(Math.random() * 15) - 7),
    innovation: metrics.innovation,
    usability: metrics.usability
  }
  
  // Generate detailed insights
  const detailedInsights: InsightItem[] = []
  
  if (score >= 85) {
    detailedInsights.push({
      type: 'achievement',
      title: 'Industry-Leading Quality',
      description: 'Your design demonstrates exceptional skill and attention to detail, placing you among top professionals.'
    })
  }
  
  if (metrics.visualHierarchy >= 80) {
    detailedInsights.push({
      type: 'strength',
      title: 'Excellent Visual Hierarchy',
      description: 'Information is organized clearly, guiding users naturally through the design.'
    })
  }
  
  if (metrics.typography < 70) {
    detailedInsights.push({
      type: 'weakness',
      title: 'Typography Needs Refinement',
      description: 'Font choices and text hierarchy could be improved for better readability and impact.'
    })
  }
  
  if (metrics.innovation >= 85) {
    detailedInsights.push({
      type: 'strength',
      title: 'Highly Innovative Approach',
      description: 'Your creative solutions stand out and push design boundaries effectively.'
    })
  }
  
  detailedInsights.push({
    type: 'opportunity',
    title: 'Explore Modern Design Trends',
    description: 'Incorporating current design patterns could enhance user engagement and contemporary appeal.'
  })
  
  // Generate trends analysis
  const trends: TrendItem[] = [
    {
      name: 'Minimalist Design',
      alignment: score >= 70 ? 65 : 30,
      description: 'Clean, focused layouts with purposeful white space'
    },
    {
      name: 'Bold Typography',
      alignment: metrics.typography >= 80 ? 80 : 40,
      description: 'Large, expressive type as a primary design element'
    },
    {
      name: 'Gradient Overlays',
      alignment: Math.floor(Math.random() * 80) + 20,
      description: 'Subtle color transitions for depth and visual interest'
    },
    {
      name: 'Dark Mode Support',
      alignment: score >= 75 ? 70 : -20,
      description: 'Designs optimized for both light and dark interfaces'
    },
    {
      name: 'Micro-interactions',
      alignment: metrics.innovation >= 80 ? 85 : 45,
      description: 'Small animations that enhance user experience'
    }
  ]
  
  // Generate expert advice
  const expertAdvice: ExpertAdviceItem[] = [
    {
      expert: 'Sarah Chen',
      role: 'Senior UX Designer at Google',
      message: score >= 80 
        ? 'Excellent work! Your attention to visual hierarchy shows maturity. Consider exploring advanced interaction patterns to elevate further.'
        : 'Focus on establishing clearer visual relationships between elements. Strong hierarchy is the foundation of great design.'
    },
    {
      expert: 'Marcus Thompson',
      role: 'Creative Director at Apple',
      message: metrics.innovation >= 75
        ? 'Your innovative approach is refreshing. Keep pushing boundaries while maintaining usability.'
        : 'Don\'t be afraid to experiment more. Innovation comes from challenging conventions thoughtfully.'
    },
    {
      expert: 'Elena Rodriguez',
      role: 'Design System Lead at Figma',
      message: 'Consistency is key. Consider developing a personal design system to maintain coherence across all your work.'
    }
  ]
  
  // Generate recommendations
  const recommendations: RecommendationItem[] = []
  
  if (metrics.typography < 80) {
    recommendations.push({
      type: 'course',
      title: 'Typography Masterclass',
      description: 'Learn advanced typography principles from industry experts',
      difficulty: 'intermediate',
      estimatedTime: '4 hours'
    })
  }
  
  if (metrics.colorPalette < 75) {
    recommendations.push({
      type: 'article',
      title: 'Color Theory for Digital Design',
      description: 'Understanding color psychology and harmonious palette creation',
      difficulty: 'beginner',
      estimatedTime: '30 minutes'
    })
  }
  
  recommendations.push({
    type: 'tool',
    title: 'Figma Auto Layout',
    description: 'Master responsive design with Figma\'s powerful layout tools',
    difficulty: score >= 70 ? 'advanced' : 'intermediate',
    estimatedTime: '2 hours'
  })
  
  recommendations.push({
    type: 'video',
    title: 'Design Critique Sessions',
    description: 'Learn to give and receive constructive design feedback',
    difficulty: 'intermediate',
    estimatedTime: '1.5 hours'
  })
  
  return {
    ...baseData,
    metrics,
    breakdown,
    detailedInsights,
    trends,
    expertAdvice,
    recommendations,
    totalEvaluations: baseData.images.length
  }
}