import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default [
  {
    ignores: [".next/**", "node_modules/**", "eslint.config.mjs", "next-env.d.ts"],
  },
  ...nextVitals,
  ...nextTypescript,
];
