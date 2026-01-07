/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          light: "#F8FAFC",
          dark: "#0B1220",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#111827",
        },
        primary: {
          DEFAULT: "#22C55E", // Thrive green
          soft: "#4ADE80",
        },
        accent: {
          DEFAULT: "#38BDF8", // calm blue
        },
        text: {
          light: "#0F172A",
          dark: "#E5E7EB",
          muted: "#9CA3AF",
        },
        border: {
          subtle: "rgba(255,255,255,0.08)",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
