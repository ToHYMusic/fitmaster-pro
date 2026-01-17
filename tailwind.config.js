/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed', // Основной фиолетовый
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        fitness: {
          cardio: '#ef4444',
          strength: '#3b82f6',
          flexibility: '#10b981',
          nutrition: '#f59e0b',
          recovery: '#8b5cf6'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'progress': 'progress 1s ease-in-out infinite'
      },
      keyframes: {
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' }
        }
      }
    },
  },
  plugins: [],
}