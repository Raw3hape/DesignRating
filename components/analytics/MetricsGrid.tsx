'use client'

import { Palette, Layout, Type, Sparkles, Users, TrendingUp } from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

interface MetricItem {
  name: string
  score: number
  icon: LucideIcon
  description: string
}

interface MetricsGridProps {
  metrics: {
    visualHierarchy: number
    typography: number
    colorPalette: number
    composition: number
    innovation: number
    usability: number
  }
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const metricItems: MetricItem[] = [
    {
      name: 'Visual Hierarchy',
      score: metrics.visualHierarchy,
      icon: Layout,
      description: 'Structure and information flow'
    },
    {
      name: 'Typography',
      score: metrics.typography,
      icon: Type,
      description: 'Font choices and readability'
    },
    {
      name: 'Color Palette',
      score: metrics.colorPalette,
      icon: Palette,
      description: 'Color harmony and contrast'
    },
    {
      name: 'Composition',
      score: metrics.composition,
      icon: Sparkles,
      description: 'Balance and visual weight'
    },
    {
      name: 'Innovation',
      score: metrics.innovation,
      icon: TrendingUp,
      description: 'Creativity and uniqueness'
    },
    {
      name: 'Usability',
      score: metrics.usability,
      icon: Users,
      description: 'User experience principles'
    }
  ]
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-purple-600 bg-purple-50'
    if (score >= 80) return 'text-blue-600 bg-blue-50'
    if (score >= 70) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metricItems.map((metric) => {
        const Icon = metric.icon
        const colorClass = getScoreColor(metric.score)
        
        return (
          <div key={metric.name} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all hover-lift stagger-item">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${colorClass} animate-float`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className={`text-2xl font-bold ${colorClass.split(' ')[0]} tabular-nums`}>
                {metric.score}
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">{metric.name}</h4>
            <p className="text-sm text-gray-500">{metric.description}</p>
            <div className="mt-3 metric-progress">
              <div 
                className={`metric-progress-bar ${colorClass.split(' ')[1]}`}
                style={{ width: `${metric.score}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}