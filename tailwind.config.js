import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Anek Bangla", ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.625rem",
        "2xl": "0.75rem",
        "3xl": "0.875rem",
      },
    },
  },
  plugins: [],
};
