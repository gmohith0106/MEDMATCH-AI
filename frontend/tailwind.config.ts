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
        brand: {
          navy: "#0f2744",
          "navy-dark": "#0a1b30",
          "navy-light": "#1e3a5f",
          teal: "#0d9488",
          "teal-light": "#14b8a6",
          "teal-dark": "#0f766e",
          bg: "#F2F4F3",
          surface: "#ffffff",
          muted: "#64748b",
          border: "#e2e8f0",
        },
        medmatch: {
          primary: "#0f2744",
          "primary-hover": "#0a1b30",
          secondary: "#0d9488",
          accent: "#0284c7",
          border: "#e2e8f0",
          "border-soft": "#DDE9E2",
          bg: "#F2F4F3",
          "bg-soft": "#E8F1EC",
          "bg-sage": "#DDE9E2",
          "bg-silver": "#ECEFED",
          card: "#ffffff",
          text: "#0f172a",
          muted: "#64748b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        heading: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)",
        modal: "0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)",
        soft: "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
      },
      borderRadius: {
        card: "8px",
        panel: "8px",
        btn: "6px",
        input: "6px",
        badge: "4px",
      },
    },
  },
  plugins: [],
};

export default config;
