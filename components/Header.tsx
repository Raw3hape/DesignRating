'use client'

interface HeaderProps {
  analysesCount: number
}

export function Header({ analysesCount }: HeaderProps) {
  const freeAnalysesLeft = Math.max(0, 3 - analysesCount)

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DR</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">DesignRating</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {freeAnalysesLeft > 0 ? (
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {freeAnalysesLeft} free analysis left
              </div>
            ) : (
              <div className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                $0.99 per analysis
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}