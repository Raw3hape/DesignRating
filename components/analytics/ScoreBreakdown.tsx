'use client'

interface ScoreBreakdownProps {
  breakdown: {
    technical: number
    aesthetic: number
    innovation: number
    usability: number
  }
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  const categories = [
    { 
      name: 'Technical Excellence', 
      score: breakdown.technical, 
      weight: 30,
      color: 'purple'
    },
    { 
      name: 'Aesthetic Appeal', 
      score: breakdown.aesthetic, 
      weight: 25,
      color: 'blue'
    },
    { 
      name: 'Innovation & Creativity', 
      score: breakdown.innovation, 
      weight: 25,
      color: 'green'
    },
    { 
      name: 'User Experience', 
      score: breakdown.usability, 
      weight: 20,
      color: 'yellow'
    }
  ]
  
  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'bg-purple-500 text-purple-600',
      blue: 'bg-blue-500 text-blue-600',
      green: 'bg-green-500 text-green-600',
      yellow: 'bg-yellow-500 text-yellow-600'
    }
    return colors[color as keyof typeof colors]
  }
  
  const weightedScore = categories.reduce((acc, cat) => 
    acc + (cat.score * cat.weight / 100), 0
  )
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Score Breakdown</h3>
      
      <div className="space-y-4">
        {categories.map((category) => {
          const contribution = (category.score * category.weight / 100).toFixed(1)
          const colorClasses = getColorClasses(category.color)
          
          return (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <span className="text-xs text-gray-500 ml-2">({category.weight}% weight)</span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${colorClasses.split(' ')[1]}`}>
                    {category.score}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    → {contribution} pts
                  </span>
                </div>
              </div>
              
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full ${colorClasses.split(' ')[0]} transition-all duration-1000`}
                  style={{ width: `${category.score}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Weighted Total Score</span>
          <span className="text-2xl font-bold text-purple-600">{Math.round(weightedScore)}</span>
        </div>
      </div>
    </div>
  )
}