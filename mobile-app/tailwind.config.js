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
        background: "#F8FAFC",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#2563EB",
          light: "#60A5FA",
          dark: "#1D4ED8",
        },
        border: "#E2E8F0",
        textDark: "#0F172A",
        textMuted: "#64748B",
        success: {
          DEFAULT: "#22C55E",
          bg: "#DCFCE7",
          text: "#15803D"
        },
        warning: {
          DEFAULT: "#F59E0B",
          bg: "#FEF3C7",
          text: "#B45309"
        },
        danger: {
          DEFAULT: "#EF4444",
          bg: "#FEE2E2",
          text: "#B91C1C"
        },
      },
    },
  },
  plugins: [],
};
