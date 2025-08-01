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
    
    // Симуляция платежа (в реальном проекте здесь будет интеграция со Stripe)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 1500)
    } catch {
      alert('Ошибка при обработке платежа')
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Платеж успешен!</h2>
          <p className="text-gray-600">Переходим к новому анализу...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Дополнительный анализ</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-purple-600 mb-2">$0.99</div>
          <p className="text-gray-600">за один детальный анализ</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Что включено:</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Полный анализ до 6 изображений</li>
            <li>• Оценка по 100-балльной шкале</li>
            <li>• Детальные рекомендации</li>
            <li>• Сравнение с другими работами</li>
            <li>• Возможность поделиться результатами</li>
          </ul>
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <CreditCard className="w-5 h-5" />
          <span>{isProcessing ? 'Обработка...' : 'Оплатить $0.99'}</span>
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Безопасные платежи через Stripe. Без подписок и скрытых комиссий.
        </p>
      </div>
    </div>
  )
}