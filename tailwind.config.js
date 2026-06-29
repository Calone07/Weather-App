/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'drift-slow': 'drift 120s ease-in-out infinite',
        'drift-medium': 'drift 80s ease-in-out infinite',
        'drift-fast': 'drift 50s ease-in-out infinite',
        'drift-faster': 'drift 35s ease-in-out infinite',
      },
      keyframes: {
        drift: {
          '0%': { transform: 'translateX(-20%)' },
          '50%': { transform: 'translateX(120%)' },
          '100%': { transform: 'translateX(-20%)' },
        },
      },
    },
  },
  plugins: [],
}
