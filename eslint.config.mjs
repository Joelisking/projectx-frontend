import tseslint from "typescript-eslint";

const eslintConfig = tseslint.config(
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "node_modules/**",
      "next-env.d.ts",
      "**/*.config.js",
      "**/*.config.mjs",
    ],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-unused-vars": "off", // Turn off base rule as it conflicts with @typescript-eslint version
      "@typescript-eslint/no-explicit-any": "warn", // Warn instead of error for 'any' types
      "@typescript-eslint/no-empty-object-type": "warn", // Warn for empty object types (often from generated code)
    },
  },
);

export default eslintConfig;
