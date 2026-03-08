/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'title': ['40px', { lineHeight: '40px', letterSpacing: '-4%' }],
        'body': ['16px', { lineHeight: '16px', letterSpacing: '0%' }],
      },
      colors: {
        primary: "#DC0004",
        dark: "#2E2E2E",
        grayCustom: "#939393",
      },
      fontFamily: {
        onest: ["Onest", "sans-serif"],
      },
    },
  },
  plugins: [],
}
