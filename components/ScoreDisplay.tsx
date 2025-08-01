'use client'

import { getScoreColors } from '@/lib/utils'

interface ScoreDisplayProps {
  score: number
  category: string
}

export function ScoreDisplay({ score, category }: ScoreDisplayProps) {
  const colors = getScoreColors(score)
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="text-center">
      <div className="relative inline-flex items-center justify-center w-40 h-40 mx-auto mb-6">
        {/* Background circle */}
        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#E2E8F0"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={score >= 85 ? '#9333EA' : score >= 70 ? '#3B82F6' : score >= 60 ? '#10B981' : score >= 50 ? '#EAB308' : score >= 40 ? '#F97316' : '#EF4444'}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-slate-900">{score}</span>
          <span className="text-gray-600 text-sm">out of 100</span>
        </div>
      </div>

      <div className={`inline-flex items-center px-6 py-3 rounded-tag ${colors.bg} ${colors.text} ${colors.border} border-2`}>
        <span className="text-lg font-semibold">{category}</span>
      </div>

      {score >= 85 && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full border border-purple-200">
            <span className="text-2xl mr-2">🏆</span>
            <span className="font-medium">Top companies level!</span>
          </div>
        </div>
      )}
    </div>
  )
}