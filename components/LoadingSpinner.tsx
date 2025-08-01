'use client'

import { useEffect, useState } from 'react'

const loadingMessages = [
  "Analyzing golden ratio...",
  "Examining composition balance...",
  "Studying typography choices...",
  "Evaluating color harmony...",
  "Checking visual hierarchy...",
  "Measuring white space...",
  "Assessing grid alignment...",
  "Reviewing contrast ratios...",
  "Analyzing user flow...",
  "Detecting design patterns...",
  "Evaluating brand consistency...",
  "Checking accessibility standards...",
  "Examining micro-interactions...",
  "Studying visual weight distribution...",
  "Analyzing emotional impact...",
  "Reviewing industry standards...",
  "Comparing with design trends...",
  "Calculating aesthetic score..."
]


export function LoadingSpinner() {
  const [messageIndex, setMessageIndex] = useState(0)
  const [fadeClass, setFadeClass] = useState('opacity-100')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + Math.random() * 3 + 1 // Random increment between 1-4
      })
    }, 150)

    // Message rotation
    const messageInterval = setInterval(() => {
      setFadeClass('opacity-0')
      
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
        setFadeClass('opacity-100')
      }, 300)
    }, 2000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white border border-purple-200 rounded-3xl shadow-2xl shadow-purple-100/50 p-10 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          {/* Animated circles */}
          <div className="relative w-32 h-32 mb-8">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
            
            {/* Rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
            
            {/* Second rotating ring */}
            <div className="absolute inset-2 rounded-full border-4 border-purple-400 border-b-transparent animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
            
            {/* Inner pulsing circle */}
            <div className="absolute inset-6 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 animate-pulse shadow-lg"></div>
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Analyzing your design
          </h3>
          
          {/* Progress bar */}
          <div className="w-full bg-purple-200 rounded-full h-1 mb-6 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-violet-500 h-1 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
            </div>
          </div>
          
          {/* Rotating messages */}
          <div className="h-8 flex items-center">
            <p className={`text-sm text-gray-600 transition-all duration-300 ${fadeClass}`}>
              {loadingMessages[messageIndex]}
            </p>
          </div>
          
        </div>
      </div>
    </div>
  )
}