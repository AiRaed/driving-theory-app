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
        background: "var(--background)",
        foreground: "var(--text-primary)",
        lingo: {
          red: "var(--lingo-red)",
          "red-dark": "var(--lingo-red-dark)",
          "red-soft": "var(--lingo-red-soft)",
        },
      },
  fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lt: "var(--radius-md)",
      },
      boxShadow: {
        lt: "var(--shadow-sm)",
      },
    },
  },
  plugins: [],
};
export default config;
