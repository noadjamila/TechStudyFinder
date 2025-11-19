import * as typescriptPlugin from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import { defineConfig } from "eslint/config";
import reactPlugin from "eslint-plugin-react";
import * as reactHooksPlugin from "eslint-plugin-react-hooks";
import * as prettierPlugin from "eslint-plugin-prettier";
import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import * as typescriptEslintParser from "@typescript-eslint/parser";
import * as jestPlugin from "eslint-plugin-jest";

export default defineConfig([
  {
    ignores: ["**/jest.config.js", "**/webpack.config.js"],
  },
  prettierConfig,

  {
    files: ["server/**/*.{js,mjs,ts,mts}"],
    ignores: ["**/*.test.ts", "**/__tests__/**"],
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
    files: ["server/**/*.test.ts", "server/**/__tests__/**/*.ts"],
    extends: [js.configs.recommended],

    languageOptions: {
      parser: typescriptEslintParser,
      globals: { ...globals.node, ...globals.es2021, ...globals.jest },
      parserOptions: {
        project: "server/tsconfig.test.json",
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
        runtime: "automatic",
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
  {
    files: [
      "client/**/*.{test,spec}.{ts,tsx}",
      "client/**/__tests__/**/*.{ts,tsx}",
    ],
    extends: [js.configs.recommended],
    languageOptions: {
      parser: typescriptEslintParser,
      globals: { ...globals.browser, ...globals.node, ...globals.jest },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: "client/tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      prettier: prettierPlugin,
      jest: jestPlugin, // das ist das Plugin, das du installierst
    } as any,
    settings: {
      react: {
        version: "detect",
        runtime: "automatic",
      },
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
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
]);
