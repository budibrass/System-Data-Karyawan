import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#fb7185",
          DEFAULT: "#be123c",
          dark: "#9f1239",
        },
        sidebar: {
          bg: "#0f172a",
          text: "#f1f5f9",
        },
      },
    },
  },
  plugins: [],
};

export default config;