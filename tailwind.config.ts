import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nova: {
          bg: "#080B12",
          card: "#101622",
          cardHover: "#161F30",
          cardBorder: "#1E293B",
          primary: "#3B82F6",
          hover: "#60A5FA",
          text: "#F8FAFC",
          muted: "#94A3B8",
          darkMuted: "#64748B",
          glow: "rgba(59, 130, 246, 0.15)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "nova-glow": "0 0 25px -5px rgba(59, 130, 246, 0.3)",
        "nova-card": "0 8px 30px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
