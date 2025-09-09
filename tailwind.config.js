/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontSize: {
        xs: ["0.68rem", { lineHeight: "0.85rem" }], // 0.75rem -> 0.68rem (15% smaller)
        sm: ["0.765rem", { lineHeight: "1.02rem" }], // 0.875rem -> 0.765rem
        base: ["0.85rem", { lineHeight: "1.275rem" }], // 1rem -> 0.85rem
        lg: ["0.935rem", { lineHeight: "1.36rem" }], // 1.125rem -> 0.935rem
        xl: ["1.02rem", { lineHeight: "1.445rem" }], // 1.25rem -> 1.02rem
        "2xl": ["1.19rem", { lineHeight: "1.53rem" }], // 1.5rem -> 1.19rem
        "3xl": ["1.445rem", { lineHeight: "1.7rem" }], // 1.875rem -> 1.445rem
        "4xl": ["1.7rem", { lineHeight: "1.87rem" }], // 2.25rem -> 1.7rem
        "5xl": ["2.04rem", { lineHeight: "2.125rem" }], // 3rem -> 2.04rem
        "6xl": ["2.38rem", { lineHeight: "2.38rem" }], // 3.75rem -> 2.38rem
        "7xl": ["2.89rem", { lineHeight: "2.89rem" }], // 4.5rem -> 2.89rem
        "8xl": ["3.4rem", { lineHeight: "3.4rem" }], // 6rem -> 3.4rem
        "9xl": ["4.08rem", { lineHeight: "4.08rem" }], // 8rem -> 4.08rem
      },
      colors: {
        primary: {
          50: "#f5f3ff", // Light purple
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa", // Medium purple
          500: "#8b5cf6", // Your preferred purple
          600: "#7c3aed", // Deeper purple
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        // Keep your existing color scheme but enhance purples
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
    },
  },
  plugins: [],
};
