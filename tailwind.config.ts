import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background Base
        "disk-dark": "#0a0e1a",
        "disk-navy": "#0f172a",
        "disk-deep": "#020617",

        // Primary Spectrum (Teal-Blue for disk operations)
        "disk-primary": {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf", // Main accent
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },

        // Secondary Purple (for highlights)
        "disk-purple": {
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
        },

        // Algorithm-specific colors
        algo: {
          fcfs: "#06b6d4", // Cyan
          sstf: "#8b5cf6", // Violet
          scan: "#10b981", // Emerald
          cscan: "#f59e0b", // Amber
          look: "#ec4899", // Pink
          clook: "#f97316", // Orange
        },

        // Status colors
        status: {
          active: "#22c55e",
          waiting: "#eab308",
          completed: "#06b6d4",
        },

        // Glass effect
        glass: {
          white: "rgba(255, 255, 255, 0.05)",
          border: "rgba(45, 212, 191, 0.2)",
          strong: "rgba(255, 255, 255, 0.1)",
        },
      },
      backgroundImage: {
        "disk-gradient":
          "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #1e3a8a 100%)",
        "track-gradient": "linear-gradient(90deg, #06b6d4 0%, #2dd4bf 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
