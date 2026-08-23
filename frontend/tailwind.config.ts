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
        palette: {
          blush: "#cbd5e1",
          rose: "#ec4899",
          canvas: "#fce7f3",
          ivory: "#fce7f3",
          peach: "#be185d",
        },
        brand: {
          navy: "#be185d",
          "navy-dark": "#be185d",
          "navy-light": "#ec4899",
          teal: "#ec4899",
          "teal-light": "#cbd5e1",
          "teal-dark": "#be185d",
          rose: "#ec4899",
          blush: "#cbd5e1",
          peach: "#be185d",
          ivory: "#fce7f3",
          bg: "#fce7f3",
          surface: "#ffffff",
          muted: "#ec4899",
          border: "#cbd5e1",
        },
        medmatch: {
          primary: "#be185d",
          "primary-hover": "#be185d",
          secondary: "#ec4899",
          accent: "#cbd5e1",
          border: "#cbd5e1",
          "border-soft": "#fce7f3",
          bg: "#fce7f3",
          "bg-soft": "#fce7f3",
          "bg-peach": "#cbd5e1",
          "bg-blush": "#fce7f3",
          "bg-rose": "#cbd5e1",
          card: "#ffffff",
          text: "#be185d",
          muted: "#ec4899",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        heading: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(190, 24, 93, 0.05), 0 1px 2px -1px rgba(190, 24, 93, 0.05)",
        modal: "0 20px 25px -5px rgba(190, 24, 93, 0.1), 0 8px 10px -6px rgba(190, 24, 93, 0.1)",
        soft: "0 1px 2px 0 rgba(190, 24, 93, 0.05)",
        warm: "0 4px 20px -2px rgba(236, 72, 153, 0.25)",
      },
      borderRadius: {
        card: "12px",
        panel: "12px",
        btn: "8px",
        input: "8px",
        badge: "6px",
      },
    },
  },
  plugins: [],
};

export default config;

