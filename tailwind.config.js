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
          light: "#8A66C2",
          deep: "#402A66",
          deeper: "#2A1B47",
          soft: "#E9E0F8",
        },
        gold: "#D89B4A",
        sage: "#6E9B7C",
        success: "#4C9A6A",
        danger: "#C1594A",
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
        soft: "0 2px 10px -4px rgba(64, 42, 102, 0.12)",
        elevated: "0 16px 40px -12px rgba(64, 42, 102, 0.28)",
        glow: "0 0 0 4px rgba(110, 74, 166, 0.14)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.94)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.7)" },
          "60%": { opacity: "1", transform: "scale(1.06)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        scaleOut: {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.94)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out both",
        "fade-in-up": "fadeInUp 0.45s cubic-bezier(0.4,0,0.2,1) both",
        "scale-in": "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both",
        shimmer: "shimmer 1.6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 1.8s ease-in-out infinite",
        "pop-in": "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        "slide-in-left": "slideInLeft 0.3s cubic-bezier(0.4,0,0.2,1) both",
        "fade-out": "fadeOut 0.18s ease-in both",
        "scale-out": "scaleOut 0.18s ease-in both",
      },
    },
  },
  plugins: [],
};