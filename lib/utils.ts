import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ScoreColors } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getScoreColors(score: number): ScoreColors {
  if (score >= 90) {
    return {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-300'
    }
  } else if (score >= 80) {
    return {
      bg: 'bg-violet-100',
      text: 'text-violet-700',
      border: 'border-violet-300'
    }
  } else if (score >= 70) {
    return {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300'
    }
  } else if (score >= 60) {
    return {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300'
    }
  } else if (score >= 50) {
    return {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      border: 'border-amber-300'
    }
  } else if (score >= 40) {
    return {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      border: 'border-orange-300'
    }
  } else {
    return {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300'
    }
  }
}

export function getScoreCategory(score: number): string {
  if (score >= 90) return 'Exceptional'
  if (score >= 80) return 'Outstanding'
  if (score >= 70) return 'Very Good'
  if (score >= 60) return 'Above Average'
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