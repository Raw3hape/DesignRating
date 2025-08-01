'use client'

interface PerformanceChartProps {
  score: number
  percentile: number
}

export function PerformanceChart({ score, percentile }: PerformanceChartProps) {
  const benchmarks = [
    { label: 'Top 1%', value: 95, description: 'Award-winning level' },
    { label: 'Top 5%', value: 90, description: 'Industry leaders' },
    { label: 'Top 10%', value: 85, description: 'Professional excellence' },
    { label: 'Top 25%', value: 75, description: 'Strong performance' },
    { label: 'Average', value: 50, description: 'Industry standard' }
  ]
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Comparison</h3>
      
      <div className="space-y-4">
        {benchmarks.map((benchmark) => {
          const isAchieved = score >= benchmark.value
          
          return (
            <div key={benchmark.label} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${isAchieved ? 'text-purple-600' : 'text-gray-400'}`}>
                    {benchmark.label}
                  </span>
                  {isAchieved && (
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                      Achieved
                    </span>
                  )}
                </div>
                <span className={`text-sm ${isAchieved ? 'text-purple-600' : 'text-gray-400'}`}>
                  {benchmark.value}+
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    isAchieved ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                  style={{ width: `${Math.min((score / benchmark.value) * 100, 100)}%` }}
                />
              </div>
              
              <p className="text-xs text-gray-500 mt-1">{benchmark.description}</p>
            </div>
          )
        })}
      </div>
      
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-700">
          Your design ranks in the <span className="font-bold">top {100 - percentile}%</span> of all evaluated works
        </p>
      </div>
    </div>
  )
}