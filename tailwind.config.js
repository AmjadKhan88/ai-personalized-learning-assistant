// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // "class" strategy means dark mode is toggled by adding/removing
  // the "dark" class on the <html> element — we control it manually.
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./context/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
      },
      animation: {
        "fade-in":    "fadeIn 0.4s ease both",
        "slide-up":   "slideUp 0.4s ease both",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: { "0%": { opacity: 0, transform: "translateY(16px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};