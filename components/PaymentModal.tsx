'use client'

import { useState } from 'react'
import { X, CreditCard, Check } from 'lucide-react'

interface PaymentModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function PaymentModal({ onClose, onSuccess }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Payment simulation (in real project this would be Stripe integration)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 1500)
    } catch {
      alert('Payment processing error')
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white border border-purple-200 rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl shadow-purple-100/50">
          <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment successful!</h2>
          <p className="text-gray-600">Redirecting to new analysis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white border border-purple-200 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-purple-100/50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Additional Analysis</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-purple-600 mb-2">$0.99</div>
          <p className="text-gray-600">for one detailed analysis</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 mb-6">
          <h3 className="font-semibold text-slate-900 mb-2">What&apos;s included:</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>• Complete analysis of up to 6 images</li>
            <li>• 100-point scale evaluation</li>
            <li>• Detailed recommendations</li>
            <li>• Comparison with other works</li>
            <li>• Ability to share results</li>
          </ul>
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="btn-primary w-full py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <CreditCard className="w-5 h-5" />
          <span>{isProcessing ? 'Processing...' : 'Pay $0.99'}</span>
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Secure payments via Stripe. No subscriptions or hidden fees.
        </p>
      </div>
    </div>
  )
}