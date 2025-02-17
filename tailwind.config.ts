import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

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
    },
  },
  plugins: [typography],
};

export default config;
