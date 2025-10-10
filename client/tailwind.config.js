/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hp-gold': '#d4af37',
        'hp-burgundy': '#740001',
        'hp-bronze': '#cd7f32',
        'hp-navy': '#0e1a40',
      },
      fontFamily: {
        'hp': ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
