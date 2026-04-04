import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a56db",
          dark: "#1e40af",
          light: "#dbeafe",
        },
        secondary: {
          DEFAULT: "#059669",
          dark: "#047857",
          light: "#d1fae5",
        },
        accent: {
          DEFAULT: "#f59e0b",
          light: "#fef3c7",
        },
        purple: {
          DEFAULT: "#7c3aed",
          light: "#ede9fe",
        },
        danger: {
          DEFAULT: "#dc2626",
          light: "#fee2e2",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        white: "#ffffff",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,.05)",
        DEFAULT: "0 1px 3px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.06)",
        md: "0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -1px rgba(0,0,0,.06)",
        lg: "0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,.05)",
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "'Helvetica Neue'",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        container: "1200px",
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
