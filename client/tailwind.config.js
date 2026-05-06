/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hp-gold': 'rgb(var(--hp-gold) / <alpha-value>)',
        'hp-burgundy': 'rgb(var(--hp-burgundy) / <alpha-value>)',
        'hp-bronze': 'rgb(var(--hp-bronze) / <alpha-value>)',
        'hp-navy': 'rgb(var(--hp-navy) / <alpha-value>)',
      },
      fontFamily: {
        'hp': ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
