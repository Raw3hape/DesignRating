'use client'

import { X, BarChart3, Eye, Palette, Sparkles, Target, Award } from 'lucide-react'

interface ScoringMethodModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ScoringMethodModal({ isOpen, onClose }: ScoringMethodModalProps) {
  if (!isOpen) return null

  const criteria = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Visual Hierarchy',
      description: 'How well information is organized and prioritized',
      weight: '15%'
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'Color & Typography',
      description: 'Effective use of colors and text readability',
      weight: '20%'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Composition Balance',
      description: 'Layout structure and element distribution',
      weight: '15%'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Innovation',
      description: 'Creative solutions and unique approaches',
      weight: '20%'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Technical Execution',
      description: 'Attention to detail and implementation quality',
      weight: '15%'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Industry Standards',
      description: 'Alignment with modern design trends',
      weight: '15%'
    }
  ]

  const scoreRanges = [
    { range: '90-100', label: 'Outstanding', color: 'text-purple-600 bg-purple-100' },
    { range: '80-89', label: 'Excellent', color: 'text-violet-600 bg-violet-100' },
    { range: '70-79', label: 'Good', color: 'text-green-600 bg-green-100' },
    { range: '60-69', label: 'Average', color: 'text-amber-600 bg-amber-100' },
    { range: '50-59', label: 'Below Average', color: 'text-orange-600 bg-orange-100' },
    { range: '0-49', label: 'Needs Improvement', color: 'text-red-600 bg-red-100' }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-purple-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">How We Score Your Design</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Our AI analyzes your design using industry-standard criteria
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Evaluation Criteria */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Evaluation Criteria</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {criteria.map((criterion, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center text-purple-600">
                    {criterion.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{criterion.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{criterion.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                      Weight: {criterion.weight}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scoring Process */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Scoring Process</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-medium">
                  1
                </div>
                <p className="text-gray-700">AI analyzes each uploaded image individually</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-medium">
                  2
                </div>
                <p className="text-gray-700">Evaluates against each criterion using computer vision</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-medium">
                  3
                </div>
                <p className="text-gray-700">Calculates weighted average based on all factors</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-medium">
                  4
                </div>
                <p className="text-gray-700">Compares with industry standards and best practices</p>
              </div>
            </div>
          </div>

          {/* Score Ranges */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Score Ranges</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {scoreRanges.map((range, index) => (
                <div key={index} className={`p-3 rounded-lg border ${range.color.includes('purple') ? 'border-purple-300' : 'border-gray-200'}`}>
                  <div className={`inline-block px-2 py-1 rounded text-sm font-medium ${range.color}`}>
                    {range.range}
                  </div>
                  <p className="mt-2 font-medium text-slate-900">{range.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Example */}
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Example Scoring</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Visual Hierarchy</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-slate-900">85</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Color & Typography</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-slate-900">92</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Innovation</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-slate-900">78</span>
                </div>
              </div>
              <div className="pt-3 border-t border-purple-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Final Score</span>
                  <span className="text-2xl font-bold text-purple-600">87</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-purple-100 bg-purple-50">
          <p className="text-sm text-center text-gray-600">
            Our AI is trained on thousands of award-winning designs and continuously improves its evaluation accuracy
          </p>
        </div>
      </div>
    </div>
  )
}