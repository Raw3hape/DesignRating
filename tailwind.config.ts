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
        // Dark theme colors
        dark: {
          DEFAULT: '#0A0A0A',
          100: '#1A1A1A',
          200: '#2A2A2A',
          300: '#3A3A3A',
          400: '#4A4A4A',
        },
        // Primary accent color
        amber: {
          DEFAULT: '#FFB800',
          light: '#FFC933',
          dark: '#E6A600',
        },
        // Score colors updated for dark theme
        score: {
          excellent: '#FFB800', // amber 90-100
          great: '#10B981',     // green 80-89
          good: '#3B82F6',      // blue 70-79
          fair: '#F59E0B',      // orange 60-69
          poor: '#EF4444',      // red 50-59
          bad: '#DC2626',       // dark red 0-49
        },
        // Gray scale
        gray: {
          DEFAULT: '#E5E5E5',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['4rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'display-2': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-3': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        'card': '1rem',
        'tag': '9999px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'slide-in': 'slideIn 0.4s ease-out',
      },
      keyframes: {
        slideIn: {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config