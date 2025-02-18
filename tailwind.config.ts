import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: "var(--prose-text)",
            h1: { color: "var(--prose-headings)" },
            h2: { color: "var(--prose-headings)" },
            h3: { color: "var(--prose-headings)" },
            strong: { color: "var(--prose-headings)" },
            a: { color: "var(--link)" },
          },
        },
      },
      colors: {
        primary: "rgb(59 130 246)", // blue-500
        "primary-light": "rgb(96 165 250)", // blue-400
        "primary-dark": "rgb(37 99 235)", // blue-600
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
