import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Anek Bangla", ...defaultTheme.fontFamily.sans],
        display: ["Space Grotesk", "Anek Bangla", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        canvas: "#f4f6f8",
        surface: "#ffffff",
        ink: {
          DEFAULT: "#0a1628",
          muted: "#4a5a6e",
          subtle: "#6b7c90",
        },
        accent: {
          DEFAULT: "#0d9488",
          hover: "#0f766e",
          soft: "#f0fdfa",
        },
        border: {
          DEFAULT: "#e4e9ef",
          strong: "#c8d1dc",
        },
      },
      borderRadius: {
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(10, 22, 40, 0.04), 0 8px 24px rgba(10, 22, 40, 0.06)",
        lift: "0 4px 6px rgba(10, 22, 40, 0.03), 0 12px 32px rgba(10, 22, 40, 0.08)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "hero-ken": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.06)" },
        },
      },
      animation: {
        "hero-ken": "hero-ken 24s ease-out forwards",
      },
    },
  },
  plugins: [],
};
