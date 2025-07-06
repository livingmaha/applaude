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
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 0, 122, 0.4), 0 0 15px rgba(0, 229, 255, 0.2)' },
          '50%': { boxShadow: '0 0 10px rgba(255, 0, 122, 0.6), 0 0 20px rgba(0, 229, 255, 0.4)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'status-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        // New animations
        'glow': {
          '0%, 100%': { textShadow: '0 0 5px rgba(255, 255, 255, 0.1)', boxShadow: '0 0 10px rgba(0, 229, 255, 0.2)' },
          '50%': { textShadow: '0 0 20px rgba(255, 255, 255, 0.3)', boxShadow: '0 0 25px rgba(0, 229, 255, 0.5)' },
        },
        'pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s infinite ease-in-out',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
        'status-pulse': 'status-pulse 1.5s infinite ease-in-out',
        // New animations
        'glow': 'glow 1.5s ease-in-out infinite',
        'pulse': 'pulse 2s infinite',
      },
    },
  },
  plugins: [],
}
