import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        gold: {
          DEFAULT: '#c9953b',
          600: '#b3812f',
        },
        bg: '#0f0f10',
        'bg-soft': '#121212',
        text: {
          DEFAULT: '#f7f7f5',
          dim: '#cfcfcb',
        },
        muted: '#8b8b86',
        surface: '#1c1c1c',
        border: '#2a2a2a',
      },
    },
  },
  plugins: [],
} satisfies Config
