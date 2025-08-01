'use client'

export function AnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="text-center">
        <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex justify-center">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
          <div className="flex space-x-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-24 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="space-y-8">
        {/* Score Display Skeleton */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="text-center">
            <div className="w-80 h-80 bg-gray-200 rounded-full mx-auto mb-8 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded-lg w-48 mx-auto mb-6 animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded-lg w-full max-w-2xl mx-auto mb-6 animate-pulse"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-6">
                  <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics Grid Skeleton */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div>
                      <div className="h-5 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-8 h-5 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2 animate-pulse"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-6 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart Skeleton */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-gray-200 rounded w-56 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
          <div className="space-y-6">
            <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center">
                  <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="text-center mb-6">
            <div className="h-7 bg-gray-200 rounded w-32 mx-auto mb-2 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-2xl w-32 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}