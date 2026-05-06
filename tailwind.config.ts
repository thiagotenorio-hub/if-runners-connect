import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        forest: "#0b4f16",
        leaf: "#6fd112",
        sun: "#d8ff34",
        graphite: "#101811",
        track: "#f0f7eb",
        pace: "#df2027",
        sprint: "#163b0f"
      }
    }
  },
  plugins: []
};

export default config;
