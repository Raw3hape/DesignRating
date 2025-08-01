'use client'

import { Lightbulb, AlertCircle, TrendingUp, CheckCircle2 } from 'lucide-react'

interface InsightItem {
  type: 'strength' | 'weakness' | 'opportunity' | 'achievement'
  title: string
  description: string
}

interface InsightsPanelProps {
  insights: InsightItem[]
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  const getInsightConfig = (type: string) => {
    const configs = {
      strength: {
        icon: CheckCircle2,
        color: 'green',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        borderColor: 'border-green-200'
      },
      weakness: {
        icon: AlertCircle,
        color: 'red',
        bgColor: 'bg-red-50',
        textColor: 'text-red-600',
        borderColor: 'border-red-200'
      },
      opportunity: {
        icon: Lightbulb,
        color: 'yellow',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-600',
        borderColor: 'border-yellow-200'
      },
      achievement: {
        icon: TrendingUp,
        color: 'purple',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
        borderColor: 'border-purple-200'
      }
    }
    return configs[type as keyof typeof configs]
  }
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Insights</h3>
      
      <div className="space-y-4">
        {insights.map((insight, index) => {
          const config = getInsightConfig(insight.type)
          const Icon = config.icon
          
          return (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${config.borderColor} ${config.bgColor}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-white ${config.textColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${config.textColor} mb-1`}>
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}