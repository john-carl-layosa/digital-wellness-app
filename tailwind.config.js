/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F6F1FB",
        canvasAlt: "#FBF8FE",
        surface: "#FFFFFF",
        ink: "#251C35",
        inkSoft: "#6C6079",
        plum: {
          DEFAULT: "#6E4AA6",
          deep: "#402A66",
          deeper: "#2A1B47",
          soft: "#E9E0F8",
        },
        gold: "#D89B4A",
        sage: "#6E9B7C",
        line: "#E4D9F5",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.75rem",
      },
      boxShadow: {
        card: "0 6px 20px -6px rgba(64, 42, 102, 0.18)",
      },
    },
  },
  plugins: [],
};