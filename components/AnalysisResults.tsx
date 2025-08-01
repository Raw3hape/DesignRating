'use client'

import { useState } from 'react'
import { Share2, RotateCcw, CreditCard, Info } from 'lucide-react'
import { AnalysisData } from '@/types'
import { getScoreColors } from '@/lib/utils'
import { ScoreDisplay } from './ScoreDisplay'
import { PaymentModal } from './PaymentModal'
import { ScoringMethodModal } from './ScoringMethodModal'

interface AnalysisResultsProps {
  data: AnalysisData
  onReset: () => void
  userAnalysesCount: number
}

export function AnalysisResults({ data, onReset, userAnalysesCount }: AnalysisResultsProps) {
  const [showPayment, setShowPayment] = useState(false)
  const [showScoringModal, setShowScoringModal] = useState(false)
  const colors = getScoreColors(data.score)
  const needsPayment = userAnalysesCount > 3

  const handleShare = async () => {
    const text = `My design scored ${data.score} out of 100 on DesignRating! 🎨✨`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DesignRating - Design Assessment',
          text,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback for browsers without Web Share API support
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`)
        alert('Link copied to clipboard!')
      }
    }
  }

  const handleNewAnalysis = () => {
    if (userAnalysesCount >= 3) {
      setShowPayment(true)
    } else {
      onReset()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-3xl font-bold text-slate-900">Analysis Results</h1>
              <button
                onClick={() => setShowScoringModal(true)}
                className="inline-flex items-center space-x-1 px-3 py-1 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium">Scoring</span>
              </button>
            </div>
            <p className="text-gray-600">Detailed assessment of your design work</p>
          </div>

          {/* Score Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-purple-100/50 border border-purple-100 mb-8">
            <ScoreDisplay score={data.score} category={data.category} />
            
            <div className="mt-6 text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-tag ${colors.bg} ${colors.text} ${colors.border} border`}>
                <span className="font-medium">
                  Your result is better than {data.comparison.percentile}% of other works
                </span>
              </div>
              <p className="text-gray-600 mt-2">{data.comparison.description}</p>
            </div>
          </div>

          {/* Images Preview */}
          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-purple-100/50 border border-purple-100 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Analyzed Works</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.images.map((image, index) => (
                <div key={index} className="aspect-square rounded-2xl overflow-hidden border border-purple-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`Work ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Positives & Negatives */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* What's Good */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-100/50 border border-purple-100">
              <h2 className="text-xl font-bold text-green-500 mb-4 flex items-center">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-500">✓</span>
                </div>
                What&apos;s Good
              </h2>
              <ul className="space-y-3">
                {data.positives && Array.isArray(data.positives) ? (
                  data.positives.map((positive, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{typeof positive === 'string' ? positive : JSON.stringify(positive)}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No positive aspects data available</li>
                )}
              </ul>
            </div>

            {/* What's Bad */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-100/50 border border-purple-100">
              <h2 className="text-xl font-bold text-red-500 mb-4 flex items-center">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-red-500">×</span>
                </div>
                What Needs Work
              </h2>
              <ul className="space-y-3">
                {data.negatives && Array.isArray(data.negatives) ? (
                  data.negatives.map((negative, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{typeof negative === 'string' ? negative : JSON.stringify(negative)}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No negative aspects data available</li>
                )}
              </ul>
            </div>
          </div>

          {/* Analysis Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Strengths */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-100/50 border border-purple-100">
              <h2 className="text-xl font-bold text-blue-500 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-blue-500">★</span>
                </div>
                Key Strengths
              </h2>
              <ul className="space-y-3">
                {data.strengths && Array.isArray(data.strengths) ? (
                  data.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{typeof strength === 'string' ? strength : JSON.stringify(strength)}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No strengths data available</li>
                )}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-100/50 border border-purple-100">
              <h2 className="text-xl font-bold text-purple-600 mb-4 flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-purple-600">→</span>
                </div>
                Improvement Tips
              </h2>
              <ul className="space-y-3">
                {data.improvements && Array.isArray(data.improvements) ? (
                  data.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{typeof improvement === 'string' ? improvement : JSON.stringify(improvement)}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No recommendations available</li>
                )}
              </ul>
            </div>
          </div>

          {/* Detailed Insights */}
          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-purple-100/50 border border-purple-100 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Detailed Analysis</h2>
            <div className="prose prose-gray max-w-none">
              {data.insights && Array.isArray(data.insights) && data.insights.length > 0 ? (
                <div className="space-y-4">
                  {data.insights.map((insight, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed">
                      {typeof insight === 'string' ? insight : JSON.stringify(insight)}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No detailed analysis available</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 bg-white text-slate-700 px-6 py-3 rounded-2xl border border-purple-200 hover:bg-purple-50 transition-colors shadow-sm"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>

            <button
              onClick={handleNewAnalysis}
              className="btn-primary flex items-center space-x-2"
            >
              {needsPayment ? (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>New Analysis ($0.99)</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-5 h-5" />
                  <span>New Analysis</span>
                </>
              )}
            </button>

            <button
              onClick={onReset}
              className="btn-secondary flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Start Over</span>
            </button>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          onClose={() => setShowPayment(false)}
          onSuccess={() => {
            setShowPayment(false)
            onReset()
          }}
        />
      )}
      
      <ScoringMethodModal 
        isOpen={showScoringModal} 
        onClose={() => setShowScoringModal(false)} 
      />
    </div>
  )
}