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
        midnight: "#070d18",
        ink: "#0f1728",
        surface: "#111a2d",
        line: "#22304a",
        cyan: "#6ee7f9",
        mint: "#84f0ca",
        amber: "#f6c177",
        coral: "#ff8f70",
      },
      boxShadow: {
        ambient: "0 30px 80px rgba(3, 10, 26, 0.45)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top, rgba(110, 231, 249, 0.2), transparent 40%), radial-gradient(circle at 85% 20%, rgba(246, 193, 119, 0.18), transparent 35%), linear-gradient(180deg, rgba(9, 14, 27, 0.98), rgba(7, 13, 24, 1))",
      },
    },
  },
  plugins: [],
};

export default config;

