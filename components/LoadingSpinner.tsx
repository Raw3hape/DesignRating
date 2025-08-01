'use client'

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyzing your design</h2>
        <p className="text-gray-600 mb-4">This may take a few seconds...</p>
        <div className="text-sm text-gray-500">
          Our AI is studying composition, colors, typography and UX of your work
        </div>
      </div>
    </div>
  )
}