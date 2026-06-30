import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules:{
      "no-unused-vars":"off",
      "@typescript-eslint/no-unused-vars":["warn"],
      "no-console":"warn",
      "quotes":["error","double"],
      "indent":["error",2],
      "no-multiple-empty-lines":["error",{max:1}],
      "padded-blocks":["error","never"],
      "semi":["error","always"],
      "react-hooks/set-state-in-effect":"off"
    }
  }
]);

export default eslintConfig;
