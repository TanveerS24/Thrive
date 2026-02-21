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
          light: "#FFF5F0",
          dark: "#0F0A08",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#1A1210",
        },
        primary: {
          DEFAULT: "#FF6B35", // Ember orange
          soft: "#FF8C5A",
          dark: "#E85A2A",
        },
        accent: {
          DEFAULT: "#FF9E5C", // Warm ember glow
          bright: "#FFB380",
        },
        ember: {
          glow: "#FF4500",
          flame: "#FF6B35",
          coal: "#2B1810",
          ash: "#4A3528",
        },
        text: {
          light: "#1A0F0A",
          dark: "#F5E6DC",
          muted: "#A68A7A",
          ember: "#FF9E5C",
        },
        border: {
          subtle: "rgba(255,107,53,0.15)",
          ember: "rgba(255,69,0,0.3)",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.4)",
        ember: "0 0 20px rgba(255,107,53,0.3), 0 0 40px rgba(255,107,53,0.15)",
        "ember-lg": "0 0 30px rgba(255,69,0,0.4), 0 0 60px rgba(255,69,0,0.2)",
      },
      animation: {
        'pulse-ember': 'pulse-ember 2s ease-in-out infinite',
        'flicker': 'flicker 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-ember': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      },
    },
  },
  plugins: [],
};
