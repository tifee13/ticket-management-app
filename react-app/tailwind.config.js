/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "color-hover": '#6717a5ff',
        "color-primary": '#e498d1ff',
        "color-secondary": '#b64fcfff',
        "color-accent": '#7f49a7ff',
        "color-bg": '#eebff0ff',
        "color-text": '#4B0082',
        "color-card": '#FFFFFF',
        
        "color-open": '#90EE90',
        "color-progress": '#FFD580',
        "color-closed": '#6b7280',
      },
      maxWidth: {
        '1440': '1440px', 
      }
    },
  },
  plugins: [],
}