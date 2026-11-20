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
        brand: {
          DEFAULT: '#176B57',
          hover: '#104F40',
          soft: '#EBF3EF',
          dark: '#0E332A',
          accent: '#5C9D83',
        },
        canvas: {
          DEFAULT: '#FBFBFA',
          dark: '#101412',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F5F5F1',
          border: '#E6E8E3',
          dark: '#161B18',
          darkSecondary: '#1E2420',
          darkBorder: '#27312B',
        },
        content: {
          primary: '#131714',
          secondary: '#5A625C',
          muted: '#8B938D',
          darkPrimary: '#F1F4F2',
          darkSecondary: '#B0B9B2',
        },
        semantic: {
          success: '#1F7049',
          warning: '#A06416',
          danger: '#B03333',
          info: '#3268A6',
        },
        setA: {
          DEFAULT: '#3973B9',
          soft: '#EEF4FA',
        },
        setB: {
          DEFAULT: '#C18428',
          soft: '#FAF4E8',
        },
        setC: {
          DEFAULT: '#8066B2',
          soft: '#F4EFFB',
        },
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'sm': '4px',
        'btn': '6px',
        'input': '6px',
        'card': '8px',
        'panel': '12px',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'elevated': '0 4px 16px -2px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
      },
    },
  },
  plugins: [],
}
