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
        background: "#EAF6FF",
        primary: "#2F80ED",
        secondary: "#56CCF2",
        accent: "#1E88E5",
        textDark: "#102A43",
        textMuted: "#5C7185",
        glassBorder: "rgba(255, 255, 255, 0.45)",
        glassSurface: "rgba(255, 255, 255, 0.25)",
        glassDeep: "rgba(173, 216, 255, 0.22)",
        success: "rgba(134, 239, 172, 0.4)", // Soft green glass for badges
        warning: "rgba(253, 224, 71, 0.4)", // Soft amber glass
        danger: "rgba(252, 165, 165, 0.4)", // Soft red glass
      },
    },
  },
  plugins: [],
};
