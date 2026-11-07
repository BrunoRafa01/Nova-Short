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
          bg: "#07080B",
          surface: "#0B0E14",
          card: "#0E121B",
          cardHover: "#131926",
          cardBorder: "rgba(255, 255, 255, 0.08)",
          primary: "#3B82F6",
          primaryHover: "#2563EB",
          accent: "#60A5FA",
          text: "#F8FAFC",
          muted: "#94A3B8",
          darkMuted: "#64748B",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        "nova-glow": "0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 15px -3px rgba(59, 130, 246, 0.12)",
        "nova-card": "0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.06)",
        "nova-subtle": "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
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
