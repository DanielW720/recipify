/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: "#16DDD1",
        lightBlue: "#00FFFF",
        aqua: "#05C2EB",
        pink: "#DE11EF",
        gray: "#374154",
      },
      keyframes: {
        strokeColor: {
          "0%": { stroke: 'theme("colors.blue")' },
          "33%": { stroke: 'theme("colors.aqua")' },
          "66%": { stroke: 'theme("colors.pink")' },
          "100%": { stroke: 'theme("colors.blue")' },
        },
      },
      animation: {
        "stroke-animation-10s": "strokeColor 10s linear infinite",
        "stroke-animation-15s": "strokeColor 15s linear infinite",
      },
      boxShadow: {
        "black-lg": "0px 10px 25px 5px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};
