/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./navigation/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#e0e5ec", // Classic Neumorphic base
        shadowLight: "#ffffff",
        shadowDark: "#a3b1c6",
        brand: "#3567e0",
      },
    },
  },
  plugins: [],
};
