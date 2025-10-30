/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 👈 nécessaire pour le bouton "mode sombre"
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // palette douce pour dark mode
        darkbg: '#111827',
        darkcard: '#1f2937',
        darktext: '#e5e7eb',
      },
    },
  },
  plugins: [],
}
