'use client'

interface HeaderProps {
  analysesCount: number
}

export function Header({ analysesCount }: HeaderProps) {
  const freeAnalysesLeft = Math.max(0, 3 - analysesCount)

  return (
    <header className="bg-dark-100 border-b border-dark-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-amber rounded-lg flex items-center justify-center">
              <span className="text-dark font-bold text-sm">DR</span>
            </div>
            <h1 className="text-xl font-bold text-gray-200">DesignRating</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {freeAnalysesLeft > 0 ? (
              <div className="tag tag-amber">
                {freeAnalysesLeft} free analysis left
              </div>
            ) : (
              <div className="tag tag-dark">
                $0.99 per analysis
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}