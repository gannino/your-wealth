/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          teal: '#00BFA5',
          purple: '#7C3AED',
          pink: '#EC4899',
        },
        dark: {
          bg: '#1A1A1A',
          surface: '#2D2D2D',
          border: '#404040',
        }
      },
    },
  },
  plugins: [],
}
