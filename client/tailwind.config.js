/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        '115': '1.15',
      },
      rotate: {
        'y-15': '15deg',
        'x-5': '5deg',
      },
      translate: {
        'z-50': '50px',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
    },
  },
  plugins: [],
}