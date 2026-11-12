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
          bg: "#09090B",
          surface: "#0F0F12",
          card: "#111113",
          cardHover: "#18181B",
          cardBorder: "#27272A",
          primary: "#3B82F6",
          primaryHover: "#2563EB",
          accent: "#60A5FA",
          text: "#FAFAFA",
          muted: "#A1A1AA",
          darkMuted: "#71717A",
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
        "nova-glow": "0 1px 2px 0 rgba(0, 0, 0, 0.4)",
        "nova-card": "0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 0 0 1px #27272A",
        "nova-subtle": "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
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
