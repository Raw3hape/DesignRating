import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        score: {
          excellent: '#8B5CF6', // фиолетовый 90-100
          great: '#3B82F6',     // голубой 80-89
          good: '#10B981',      // зеленый 70-79
          fair: '#F59E0B',      // желтый 60-69
          poor: '#EF4444',      // красный 50-59
          bad: '#DC2626',       // темно-красный 0-49
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
}
export default config