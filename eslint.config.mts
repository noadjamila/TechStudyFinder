import * as typescriptPlugin from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import { defineConfig } from "eslint/config";
import reactPlugin from "eslint-plugin-react";
import * as reactHooksPlugin from "eslint-plugin-react-hooks";
import * as prettierPlugin from "eslint-plugin-prettier";
import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import * as typescriptEslintParser from "@typescript-eslint/parser";

export default defineConfig([
  {
    files: ["**/*.js"],
    ignores: ["**/jest.config.js", "**/webpack.config.js"],
  },
  prettierConfig,

  {
    files: ["server/**/*.{js,mjs,ts,mts}"],
    ignores: [
      "server/jest.config.js",
      "server/webpack.config.js"
    ],
    extends: [js.configs.recommended],

    languageOptions: {
      parser: typescriptEslintParser,
      globals: { ...globals.node, ...globals.es2021 },
      parserOptions: {
        project: "server/tsconfig.json",
      },
    },

    plugins: {
      "@typescript-eslint": typescriptPlugin,
      prettier: prettierPlugin,
    } as any,

    rules: {
      "no-undef": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "no-unused-vars": "off",
    },
  },
  {
    files: ["client/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      prettier: prettierPlugin,
    } as any,

    extends: [js.configs.recommended],

    languageOptions: {
      parser: typescriptEslintParser,
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: "client/tsconfig.json",
      },
    },
    settings: {
      react: {
        version: "detect",
        runtime: "automatic"
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
]);
