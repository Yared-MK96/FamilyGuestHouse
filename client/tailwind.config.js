/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:       "#1e1b4b",
        primaryHover:  "#16144a",
        secondary:     "#f3f2f5",
      }
    },
  },
  plugins: [],
}

