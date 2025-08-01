import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ScoreColors } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getScoreColors(score: number): ScoreColors {
  if (score >= 90) {
    return {
      bg: 'bg-amber/20',
      text: 'text-amber',
      border: 'border-amber/50'
    }
  } else if (score >= 80) {
    return {
      bg: 'bg-green-400/20',
      text: 'text-green-400',
      border: 'border-green-400/50'
    }
  } else if (score >= 70) {
    return {
      bg: 'bg-blue-400/20',
      text: 'text-blue-400',
      border: 'border-blue-400/50'
    }
  } else if (score >= 60) {
    return {
      bg: 'bg-yellow-400/20',
      text: 'text-yellow-400',
      border: 'border-yellow-400/50'
    }
  } else if (score >= 50) {
    return {
      bg: 'bg-orange-400/20',
      text: 'text-orange-400',
      border: 'border-orange-400/50'
    }
  } else {
    return {
      bg: 'bg-red-400/20',
      text: 'text-red-400',
      border: 'border-red-400/50'
    }
  }
}

export function getScoreCategory(score: number): string {
  if (score >= 90) return 'Outstanding'
  if (score >= 80) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 60) return 'Average'
  if (score >= 50) return 'Below Average'
  return 'Needs Improvement'
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