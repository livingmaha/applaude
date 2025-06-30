
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'quantum-black': '#101010',
        'fusion-pink': '#FF007A',
        'ion-blue': '#00E5FF',
        'solar-orange': '#FFC700',
        'soft-white': '#E0E0E0',
      },
    },
  },
  plugins: [],
}
