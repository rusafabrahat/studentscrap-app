/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      // customisations
      colors: {
        primary: '#6b46c1', // example custom colour
        paper: '#F7F5F2'    // matches collage background
      }
    },
  },
  plugins: [],
}