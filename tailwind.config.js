/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode:"class",
  theme: {
    extend: {
      animation: {
        'reverse-spin': 'reverse-spin 5s linear infinite',
        'my-spin': 'spin 20s linear infinite'
      },
      keyframes: {
        'reverse-spin': {
          from: {
            transform: 'rotate(360deg)'
          },
        
        },
        'spin':{
          from:{
            transform:'rotate(-360deg)'
          }
        }
      },
      screens:{
        'sl':'400px',
        'ss': '500px',
        'smm':'469px',
        'smm1':'200px',
        'md1':'1020px',

  
      }
      
    },
  },
  plugins: [],
 
}