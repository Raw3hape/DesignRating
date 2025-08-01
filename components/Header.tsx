'use client'

interface HeaderProps {
  analysesCount: number
}

export function Header({ analysesCount }: HeaderProps) {
  const freeAnalysesLeft = Math.max(0, 3 - analysesCount)

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DR</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">DesignRating</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {freeAnalysesLeft > 0 ? (
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {freeAnalysesLeft} бесплатных анализа
              </div>
            ) : (
              <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                $0.99 за анализ
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}