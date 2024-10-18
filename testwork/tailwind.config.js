/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // 새로운 색상 추가
      colors: {
        tripDuoGreen: '#006622',  
        tripDuoMint: '#66CC99', 
      },
      screens: {
        xs: '480px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}