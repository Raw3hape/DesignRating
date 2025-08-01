import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ScoreColors } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getScoreColors(score: number): ScoreColors {
  if (score >= 85) {
    // 100-85: фиолетовый
    return {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-300'
    }
  } else if (score >= 70) {
    // 84-70: голубой
    return {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300'
    }
  } else if (score >= 60) {
    // 69-60: зеленый
    return {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300'
    }
  } else if (score >= 50) {
    // 59-50: желтый
    return {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-300'
    }
  } else if (score >= 40) {
    // 49-40: оранжевый
    return {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      border: 'border-orange-300'
    }
  } else {
    // 39-0: красный
    return {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300'
    }
  }
}

export function getScoreCategory(score: number): string {
  if (score >= 85) return 'Exceptional'
  if (score >= 70) return 'Outstanding'
  if (score >= 60) return 'Very Good'
  if (score >= 50) return 'Average'
  if (score >= 40) return 'Below Average'
  return 'Poor'
}

export function formatImageForAPI(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}