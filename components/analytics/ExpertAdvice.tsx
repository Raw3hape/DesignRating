'use client'

import { User, Quote } from 'lucide-react'

interface ExpertAdviceProps {
  advice: {
    expert: string
    role: string
    message: string
    avatar?: string
  }[]
}

export function ExpertAdvice({ advice }: ExpertAdviceProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Expert Perspectives</h3>
      
      <div className="space-y-4">
        {advice.map((item, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {item.avatar ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.avatar} 
                      alt={item.expert}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </>
                ) : (
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.expert}</h4>
                    <p className="text-sm text-gray-500">{item.role}</p>
                  </div>
                  <Quote className="w-4 h-4 text-gray-400" />
                </div>
                
                <p className="text-sm text-gray-700 italic">
                  &ldquo;{item.message}&rdquo;
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          AI-generated insights based on design best practices
        </p>
      </div>
    </div>
  )
}