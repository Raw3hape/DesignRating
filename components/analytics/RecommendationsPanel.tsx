'use client'

import { BookOpen, Video, Wrench, FileText } from 'lucide-react'

interface RecommendationItem {
  type: 'course' | 'video' | 'tool' | 'article'
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime?: string
}

interface RecommendationsPanelProps {
  recommendations: RecommendationItem[]
}

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  const getTypeConfig = (type: string) => {
    const configs = {
      course: { icon: BookOpen, color: 'purple' },
      video: { icon: Video, color: 'blue' },
      tool: { icon: Wrench, color: 'green' },
      article: { icon: FileText, color: 'yellow' }
    }
    return configs[type as keyof typeof configs]
  }
  
  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-yellow-100 text-yellow-700',
      advanced: 'bg-red-100 text-red-700'
    }
    return colors[difficulty as keyof typeof colors]
  }
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recommended Learning Resources</h3>
      
      <div className="space-y-4">
        {recommendations.map((item, index) => {
          const config = getTypeConfig(item.type)
          const Icon = config.icon
          
          return (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg bg-${config.color}-50 text-${config.color}-600`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(item.difficulty)}`}>
                      {item.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  
                  {item.estimatedTime && (
                    <p className="text-xs text-gray-500">
                      Estimated time: {item.estimatedTime}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
          View All Resources →
        </button>
      </div>
    </div>
  )
}