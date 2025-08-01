'use client'

import { useState } from 'react'
import { X, Mail, Shield, Sparkles } from 'lucide-react'

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (email: string) => void
  isLoading?: boolean
}

export function EmailModal({ isOpen, onClose, onSubmit, isLoading }: EmailModalProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [honeypot, setHoneypot] = useState('') // Anti-bot field

  if (!isOpen) return null

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Check honeypot
    if (honeypot) {
      return // Bot detected
    }

    if (!email) {
      setError('Please enter your email')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    // Check for temporary email domains
    const tempDomains = ['tempmail', 'throwaway', 'guerrilla', '10minute', 'mailinator']
    const domain = email.split('@')[1].toLowerCase()
    if (tempDomains.some(temp => domain.includes(temp))) {
      setError('Please use a permanent email address')
      return
    }

    onSubmit(email)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Get Your Free Design Analysis
          </h2>
          <p className="text-gray-600 mb-6">
            Enter your email to unlock AI-powered design insights
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            {/* Honeypot field - hidden from users */}
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ position: 'absolute', left: '-9999px' }}
              tabIndex={-1}
              autoComplete="off"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Analyze My Design</span>
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-start space-x-3 text-sm text-gray-600">
            <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">100% Free, No Credit Card</p>
              <p>We respect your privacy. Your email is used only for authentication.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}