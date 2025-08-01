'use client'

import { useState } from 'react'
import { ImageUpload } from '@/components/ImageUpload'
import { AnalysisResults } from '@/components/AnalysisResults'
import { Header } from '@/components/Header'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ScoringMethodModal } from '@/components/ScoringMethodModal'
import { EmailModal } from '@/components/EmailModal'
import { AnalysisData } from '@/types'
import { compressImages } from '@/lib/imageCompression'
import { Info } from 'lucide-react'

export default function Home() {
  const [images, setImages] = useState<File[]>([])
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userAnalysesCount, setUserAnalysesCount] = useState(0)
  const [showScoringModal, setShowScoringModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isEmailLoading, setIsEmailLoading] = useState(false)

  const handleAnalyzeClick = () => {
    if (images.length === 0) return
    
    // Show email modal if user hasn't provided email
    if (!userEmail) {
      setShowEmailModal(true)
      return
    }
    
    // Proceed with analysis
    handleAnalyze()
  }

  const handleEmailSubmit = async (email: string) => {
    setIsEmailLoading(true)
    
    try {
      const response = await fetch('/api/auth/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to register email')
      }

      setUserEmail(email)
      setShowEmailModal(false)
      
      // Proceed with analysis
      setTimeout(() => {
        handleAnalyze()
      }, 500)
      
    } catch (error) {
      console.error('Email registration error:', error)
      alert(error instanceof Error ? error.message : 'Failed to register email. Please try again.')
    } finally {
      setIsEmailLoading(false)
    }
  }

  const handleAnalyze = async () => {
    if (images.length === 0) return

    setIsLoading(true)
    
    try {
      // Compress images before sending
      const compressedImages = await compressImages(images)
      
      // Check total size
      const totalSize = compressedImages.reduce((sum, img) => sum + img.size, 0)
      if (totalSize > 10 * 1024 * 1024) { // 10MB total limit
        throw new Error('Total image size is too large. Please use smaller images.')
      }
      
      const formData = new FormData()
      compressedImages.forEach((image, index) => {
        formData.append(`image${index}`, image)
      })
      
      // Add email to form data
      if (userEmail) {
        formData.append('email', userEmail)
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Analysis error')
      }

      const data = await response.json()
      console.log('Received analysis data:', data)
      
      // Ensure data has the correct structure
      if (data && data.score) {
        setAnalysisData(data)
        setUserAnalysesCount(prev => prev + 1)
      } else {
        console.error('Invalid data structure:', data)
        throw new Error('Invalid analysis data received')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred during analysis. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setImages([])
    setAnalysisData(null)
    // Keep email for subsequent analyses
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-50">
        <AnalysisResults 
          data={analysisData} 
          onReset={handleReset}
          userAnalysesCount={userAnalysesCount}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-50">
      <Header analysesCount={userAnalysesCount} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Professional Design 
            <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              {' '}Assessment
            </span>
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Get detailed analysis of your design work with evaluation standards of Apple, Google and other top companies
          </p>
          
          <button
            onClick={() => setShowScoringModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors mb-8"
          >
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium">How scoring works</span>
          </button>

          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-purple-100/50 border border-purple-100 mb-8">
            <ImageUpload 
              images={images} 
              setImages={setImages}
              maxImages={6}
            />
            
            {images.length > 0 && (
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={handleAnalyzeClick}
                  disabled={isLoading || images.length === 0}
                  className="btn-primary text-lg px-8 py-4"
                >
                  {isLoading ? 'Analyzing...' : `Analyze ${images.length} work${images.length > 1 ? 's' : ''}`}
                </button>
                
                <button
                  onClick={handleReset}
                  className="btn-secondary text-lg px-8 py-4"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-100/50 border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Precise Assessment</h3>
              <p className="text-gray-600">Score from 1 to 100 points with detailed analysis of strengths and weaknesses</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-100/50 border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Fast Analysis</h3>
              <p className="text-gray-600">Instant evaluation using advanced machine learning algorithms</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-100/50 border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Expert Advice</h3>
              <p className="text-gray-600">Specific recommendations for improving design and enhancing professional level</p>
            </div>
          </div>
        </div>
      </main>
      
      <ScoringMethodModal 
        isOpen={showScoringModal} 
        onClose={() => setShowScoringModal(false)} 
      />
      
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        isLoading={isEmailLoading}
      />
    </div>
  )
}