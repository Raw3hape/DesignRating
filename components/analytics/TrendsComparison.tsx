'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface TrendItem {
  name: string
  alignment: number // -100 to 100
  description: string
}

interface TrendsComparisonProps {
  trends: TrendItem[]
}

export function TrendsComparison({ trends }: TrendsComparisonProps) {
  const getTrendIcon = (alignment: number) => {
    if (alignment > 20) return TrendingUp
    if (alignment < -20) return TrendingDown
    return Minus
  }
  
  const getTrendColor = (alignment: number) => {
    if (alignment > 20) return 'text-green-600'
    if (alignment < -20) return 'text-red-600'
    return 'text-gray-600'
  }
  
  const getAlignmentLabel = (alignment: number) => {
    if (alignment > 50) return 'Strongly Aligned'
    if (alignment > 20) return 'Well Aligned'
    if (alignment > -20) return 'Neutral'
    if (alignment > -50) return 'Misaligned'
    return 'Strongly Misaligned'
  }
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">2024 Design Trends Analysis</h3>
      
      <div className="space-y-4">
        {trends.map((trend) => {
          const Icon = getTrendIcon(trend.alignment)
          const colorClass = getTrendColor(trend.alignment)
          const label = getAlignmentLabel(trend.alignment)
          
          return (
            <div key={trend.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${colorClass}`} />
                  <span className="text-sm font-medium text-gray-700">{trend.name}</span>
                </div>
                <span className={`text-sm font-medium ${colorClass}`}>
                  {label}
                </span>
              </div>
              
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`absolute h-full transition-all duration-1000 ${
                    trend.alignment > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.abs(trend.alignment)}%`,
                    left: trend.alignment < 0 ? `${50 - Math.abs(trend.alignment / 2)}%` : '50%'
                  }}
                />
                <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gray-400" />
              </div>
              
              <p className="text-xs text-gray-500">{trend.description}</p>
            </div>
          )
        })}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Overall Trend Alignment:</span> Your work shows 
          {' '}<span className="text-purple-600 font-bold">76%</span> alignment with current industry trends
        </p>
      </div>
    </div>
  )
}