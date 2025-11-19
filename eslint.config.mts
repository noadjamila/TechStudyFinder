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
  prettierConfig,

  {
      files: ["client/**/*.test.tsx", "client/**/__tests__/**/*.tsx"],
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
      "no-console": "warn",
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
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: "client/tsconfig.json",
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "prettier/prettier": "error",
    },
  },
]);
