/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width:{
        '43':'10.5em',
        '45':'11.5em',
        '46':'12em'
      },
      margin:{
        
        '100':'10em',
        '200':'20em',
      }
    },
  },
  plugins: [],
}

