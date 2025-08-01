'use client'

import { TrendingUp, Award, Target, Zap } from 'lucide-react'

interface AnalyticsSummaryProps {
  score: number
  percentile: number
  totalEvaluations: number
  improvements: number
}

export function AnalyticsSummary({ score, percentile, totalEvaluations, improvements }: AnalyticsSummaryProps) {
  const stats = [
    {
      icon: Award,
      label: 'Overall Score',
      value: score,
      suffix: '/100',
      color: 'purple'
    },
    {
      icon: TrendingUp,
      label: 'Percentile Rank',
      value: percentile,
      suffix: '%',
      color: 'blue'
    },
    {
      icon: Target,
      label: 'Works Evaluated',
      value: totalEvaluations,
      suffix: '',
      color: 'green'
    },
    {
      icon: Zap,
      label: 'Key Improvements',
      value: improvements,
      suffix: '',
      color: 'yellow'
    }
  ]
  
  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'bg-purple-50 text-purple-600',
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      yellow: 'bg-yellow-50 text-yellow-600'
    }
    return colors[color as keyof typeof colors]
  }
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        const colorClasses = getColorClasses(stat.color)
        
        return (
          <div key={stat.label} className="bg-white rounded-xl p-6 border border-gray-100">
            <div className={`inline-flex p-3 rounded-lg ${colorClasses} mb-4`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.value}{stat.suffix}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}