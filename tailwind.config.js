/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // App-specific theme colors
        primary: {
          DEFAULT: '#3B82F6',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        background: {
          DEFAULT: '#0F172A', // Dark background
          light: '#FFFFFF',   // Light background
        },
        surface: {
          DEFAULT: '#1E293B', // Dark surface
          light: '#F8FAFC',   // Light surface
        },
        'text-primary': {
          DEFAULT: '#F8FAFC', // Dark mode text
          light: '#0F172A',   // Light mode text
        },
        'text-secondary': {
          DEFAULT: '#94A3B8', // Dark mode secondary text
          light: '#64748B',   // Light mode secondary text
        },
},
      fontFamily: {
        'bebas': ['Bebas Neue', 'cursive'],
      },
    },
  },
  plugins: [],
}