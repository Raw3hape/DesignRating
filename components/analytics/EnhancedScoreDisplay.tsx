'use client'

import { useEffect, useState } from 'react'
import { getScoreColors } from '@/lib/utils'

interface EnhancedScoreDisplayProps {
  score: number
  category: string
}

export function EnhancedScoreDisplay({ score }: EnhancedScoreDisplayProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const colors = getScoreColors(score)
  
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = score / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= score) {
        setAnimatedScore(score)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [score])
  
  const radius = 120
  const strokeWidth = 12
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference
  
  const getGrade = (score: number) => {
    if (score >= 95) return 'A+'
    if (score >= 90) return 'A'
    if (score >= 85) return 'A-'
    if (score >= 80) return 'B+'
    if (score >= 75) return 'B'
    if (score >= 70) return 'B-'
    if (score >= 65) return 'C+'
    if (score >= 60) return 'C'
    return 'D'
  }
  
  return (
    <div className="relative score-reveal">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className="score-ring"
          stroke={colors.primary}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{
            strokeDashoffset,
            transition: 'stroke-dashoffset 2s ease-in-out',
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-6xl font-bold text-slate-900 tabular-nums">{animatedScore}</div>
        <div className="text-sm text-gray-500 mt-1">out of 100</div>
        <div className={`text-2xl font-bold mt-2 ${colors.text} animate-pulse-glow rounded-lg px-3 py-1`}>
          {getGrade(score)}
        </div>
      </div>
    </div>
  )
}