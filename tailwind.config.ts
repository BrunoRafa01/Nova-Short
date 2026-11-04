import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        nova: {
          bg: "#080C15",
          surface: "#0D1322",
          card: "#101828",
          cardHover: "#152238",
          cardBorder: "#1E2C48",
          primary: "#3B82F6",
          primaryHover: "#2563EB",
          accent: "#60A5FA",
          neon: "#38BDF8",
          violet: "#818CF8",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
          text: "#F8FAFC",
          muted: "#94A3B8",
          darkMuted: "#64748B",
          glow: "rgba(59, 130, 246, 0.2)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        "nova-glow": "0 0 30px -5px rgba(59, 130, 246, 0.35)",
        "nova-card": "0 10px 35px -5px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(30, 44, 72, 0.8)",
        "nova-subtle": "0 4px 20px -2px rgba(0, 0, 0, 0.4)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.25s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
