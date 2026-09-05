/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./resources/**/*.blade.php",
    "./resources/js/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        borneo: {
          teal: '#14967F',
          blue: '#095D7E',
          oxygen: '#CCECEE',
          charcoal: '#262626',
          whisper: '#F1F9FF',
        }
      }
    },
  },
  plugins: [],
}
