import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f3f6f4",
          100: "#e2e9e4",
          200: "#c2d2c7",
          300: "#9bb5a4",
          400: "#6c8e79",
          500: "#4a6f59",
          600: "#365544",
          700: "#2a4336",
          800: "#1f3329",
          900: "#16261f",
          950: "#0d1813",
        },
        bone: {
          50: "#fdfcf9",
          100: "#f8f5ee",
          200: "#f1ecdf",
          300: "#e7decb",
        },
        brass: {
          300: "#e3c98a",
          400: "#d3ad5e",
          500: "#c2964a",
          600: "#a37a38",
          700: "#7e5e2c",
        },
        clay: {
          400: "#c47b5d",
          500: "#b06246",
        },
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 24px -4px rgba(13, 24, 19, 0.12)",
        lift: "0 24px 48px -12px rgba(13, 24, 19, 0.22)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      maxWidth: {
        content: "78rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out forwards",
        float: "float 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
