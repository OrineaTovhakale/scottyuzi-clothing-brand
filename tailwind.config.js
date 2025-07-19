/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A0F2C",
        primaryDeep:"#FFFFFF",
        secondary: "#D6B98C",
        tertiary: "#1C2331",
        gray:{
          30: "#F9F9F6",
          50: "#AFAFAF",
        }
     },
      screens :{
        xs:"400px"
      },
      backgroundImage: {
        hero: "url(/src/assets/bg.png)",
      },
      fontFamily: {
        paci: ['"Pacifico"', 'cursive']
      },
    },
  },
  plugins: [],
}
