import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0D0D0D",
        surface: "#141414",
        border: "#1E1E1E",
        "border-light": "#2A2A2A",
        accent: "#E8D5A3",
        "accent-dim": "#C4AF7F",
        muted: "#6B6B6B",
        "muted-light": "#888888",
        ink: "#F2EDE4",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
        body: ["Crimson Pro", "Georgia", "serif"],
      },
      fontSize: {
        "display-1": ["4rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-2": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "h1": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "h2": ["1.75rem", { lineHeight: "1.2" }],
        "h3": ["1.25rem", { lineHeight: "1.3" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        "body": ["1rem", { lineHeight: "1.65" }],
        "label": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em" }],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.5s ease forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(232,213,163,0)" },
          "50%": { boxShadow: "0 0 12px 2px rgba(232,213,163,0.15)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
