'use client'

import { useState, useMemo } from 'react'
import { Share2, RotateCcw, CreditCard, Info, Download, TrendingUp, ChartBar, Lightbulb } from 'lucide-react'
import { AnalysisData } from '@/types'
import { generateAnalyticsData } from '@/lib/generateAnalyticsData'
import { getScoreColors } from '@/lib/utils'
import { PaymentModal } from './PaymentModal'
import { ScoringMethodModal } from './ScoringMethodModal'

// Analytics components
import { EnhancedScoreDisplay } from './analytics/EnhancedScoreDisplay'
import { AnalyticsSummary } from './analytics/AnalyticsSummary'
import { MetricsGrid } from './analytics/MetricsGrid'
import { PerformanceChart } from './analytics/PerformanceChart'
import { ScoreBreakdown } from './analytics/ScoreBreakdown'
import { InsightsPanel } from './analytics/InsightsPanel'
import { TrendsComparison } from './analytics/TrendsComparison'
import { ExpertAdvice } from './analytics/ExpertAdvice'
import { RecommendationsPanel } from './analytics/RecommendationsPanel'

interface AnalysisResultsProps {
  data: AnalysisData
  onReset: () => void
  userAnalysesCount: number
}

export function AnalysisResults({ data, onReset, userAnalysesCount }: AnalysisResultsProps) {
  const [showPayment, setShowPayment] = useState(false)
  const [showScoringModal, setShowScoringModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'insights'>('overview')
  const needsPayment = userAnalysesCount > 3
  
  // Generate extended analytics data
  const extendedData = useMemo(() => generateAnalyticsData(data), [data])
  const colors = getScoreColors(data.score)

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
  
  const handleExport = () => {
    const reportData = {
      score: data.score,
      category: data.category,
      date: new Date().toISOString(),
      metrics: extendedData.metrics,
      insights: extendedData.detailedInsights,
      recommendations: extendedData.recommendations
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `design-analysis-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-4xl font-bold text-slate-900">Design Analysis Report</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowScoringModal(true)}
                  className="inline-flex items-center space-x-1 px-3 py-1 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <Info className="w-4 h-4" />
                  <span className="text-sm font-medium">Methodology</span>
                </button>
                <button 
                  onClick={handleExport}
                  className="inline-flex items-center space-x-1 px-3 py-1 text-slate-600 bg-white hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Export</span>
                </button>
              </div>
            </div>
            <p className="text-xl text-gray-600">Professional assessment with actionable insights</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-2xl p-2 shadow-lg shadow-purple-100/50 border border-purple-100">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <ChartBar className="w-4 h-4 inline mr-2" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('metrics')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'metrics'
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Metrics
                </button>
                <button
                  onClick={() => setActiveTab('insights')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'insights'
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Lightbulb className="w-4 h-4 inline mr-2" />
                  Insights
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'overview' && (
              <>
                {/* Score and Summary */}
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 flex justify-center">
                    <EnhancedScoreDisplay score={data.score} category={data.category} />
                  </div>
                  
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl p-8 shadow-lg shadow-purple-100/50 border border-purple-100">
                      <h2 className="text-2xl font-bold text-slate-900 mb-4">{data.category}</h2>
                      <div className={`inline-flex items-center px-4 py-2 rounded-full ${colors.bg} ${colors.text} ${colors.border} border mb-4`}>
                        <span className="font-medium">
                          Your result is better than {data.comparison.percentile}% of other works
                        </span>
                      </div>
                      <p className="text-gray-600 text-lg">{data.comparison.description}</p>
                    </div>
                    
                    <AnalyticsSummary 
                      score={data.score}
                      percentile={data.comparison.percentile}
                      totalEvaluations={extendedData.totalEvaluations || data.images.length}
                      improvements={data.improvements.length}
                    />
                  </div>
                </div>
                
                {/* Images Preview */}
                <div className="bg-white rounded-2xl p-8 shadow-lg shadow-purple-100/50 border border-purple-100">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Analyzed Works</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {data.images.map((image, index) => (
                      <div key={index} className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-purple-200 hover:border-purple-400 transition-all duration-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt={`Work ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Design #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Chart */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <PerformanceChart score={data.score} percentile={data.comparison.percentile} />
                  
                  {/* Quick Insights */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg shadow-purple-100/50 border border-purple-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Analysis</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">Top Strengths</h4>
                        <ul className="space-y-1">
                          {data.strengths.slice(0, 3).map((strength, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-orange-600 mb-2">Key Improvements</h4>
                        <ul className="space-y-1">
                          {data.improvements.slice(0, 3).map((improvement, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start">
                              <span className="text-orange-500 mr-2">•</span>
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'metrics' && (
              <>
                {/* Metrics Grid */}
                {extendedData.metrics && <MetricsGrid metrics={extendedData.metrics} />}
                
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Score Breakdown */}
                  {extendedData.breakdown && <ScoreBreakdown breakdown={extendedData.breakdown} />}
                  
                  {/* Detailed Analysis */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Feedback</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">What&apos;s Working Well</h4>
                        <div className="space-y-2">
                          {data.positives.slice(0, 4).map((positive, i) => (
                            <div key={i} className="p-3 bg-green-50 rounded-lg text-sm text-green-800">
                              {positive}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Areas for Growth</h4>
                        <div className="space-y-2">
                          {data.negatives.slice(0, 4).map((negative, i) => (
                            <div key={i} className="p-3 bg-orange-50 rounded-lg text-sm text-orange-800">
                              {negative}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'insights' && (
              <>
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Insights Panel */}
                  {extendedData.detailedInsights && <InsightsPanel insights={extendedData.detailedInsights} />}
                  
                  {/* Trends Comparison */}
                  {extendedData.trends && <TrendsComparison trends={extendedData.trends} />}
                </div>
                
                {/* Expert Advice */}
                {extendedData.expertAdvice && <ExpertAdvice advice={extendedData.expertAdvice} />}
                
                {/* Recommendations */}
                {extendedData.recommendations && <RecommendationsPanel recommendations={extendedData.recommendations} />}
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg shadow-purple-100/50 border border-purple-100">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">What&apos;s Next?</h3>
              <p className="text-gray-600">Continue improving your design skills</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Results</span>
              </button>

              <button
                onClick={handleNewAnalysis}
                className="btn-primary flex items-center space-x-2 px-8 py-4 text-lg"
              >
                {needsPayment ? (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>New Analysis ($0.99)</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-5 h-5" />
                    <span>Analyze More Designs</span>
                  </>
                )}
              </button>

              <button
                onClick={onReset}
                className="btn-secondary flex items-center space-x-2 px-8 py-4 text-lg"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Start Fresh</span>
              </button>
            </div>

            {/* Achievement Badge for High Scores */}
            {data.score >= 85 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl text-white text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h4 className="text-xl font-bold mb-2">Congratulations!</h4>
                <p className="text-purple-100">You&apos;ve achieved professional-level design quality. Share your success!</p>
              </div>
            )}
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