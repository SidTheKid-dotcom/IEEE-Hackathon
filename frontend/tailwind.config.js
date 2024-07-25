/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
          '100%': { transform: 'rotate(-3deg)' },
        },
        flash: {
          '0%, 100%': { opacity: 0 },
          '50%': { opacity: 1 },
        },
        evolve: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        wiggle: 'wiggle 0.5s ease-in-out infinite',
        flash: 'flash 1s infinite',
        evolve: 'evolve 3.5s ease-in-out',
      },
    },
  },
  plugins: [],
}

