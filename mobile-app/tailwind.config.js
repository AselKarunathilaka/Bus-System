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
      fontFamily: {
        sans: ["PlusJakartaSans-Regular", "sans-serif"],
        medium: ["PlusJakartaSans-Medium", "sans-serif"],
        semibold: ["PlusJakartaSans-SemiBold", "sans-serif"],
        bold: ["PlusJakartaSans-Bold", "sans-serif"],
        extrabold: ["PlusJakartaSans-ExtraBold", "sans-serif"],
      },
      colors: {
        background: "#EAF6FF",
        primary: "#2563EB",
        secondary: "#06B6D4",
        accent: "#14B8A6",
        textDark: "#0F172A",
        textMuted: "#64748B",
        glassBorder: "rgba(255, 255, 255, 0.55)",
        glassSurface: "rgba(255, 255, 255, 0.55)",
        glassDeep: "rgba(173, 216, 255, 0.22)",
        success: "rgba(16, 185, 129, 0.4)",
        warning: "rgba(245, 158, 11, 0.4)",
        danger: "rgba(239, 68, 68, 0.4)",
      },
    },
  },
  plugins: [],
};
