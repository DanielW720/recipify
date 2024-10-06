/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lightBlue: "#00FFFF",
        blue: "#16DDD1",
        darkBlue: "#152659",
        darkestBlue: "#0d152e",
        aqua: "#05C2EB",
        pink: "#DE11EF",
        gray: "#374154",
      },
      fontFamily: {
        playwrite: "Playwrite DE Grund",
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
      screens: {
        xs: "475px",
      },
    },
  },
  plugins: [],
};
