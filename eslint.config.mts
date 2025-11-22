import tsPlugin from "@typescript-eslint/eslint-plugin";
import * as typescriptEslintParser from "@typescript-eslint/parser";
import globals from "globals";
import {defineConfig} from "eslint/config";
import reactPlugin from "eslint-plugin-react";
import * as reactHooksPlugin from "eslint-plugin-react-hooks";
import js from "@eslint/js";
import * as jestPlugin from "eslint-plugin-jest";
import prettier from "eslint-config-prettier";

export default defineConfig([
  {
    ignores: ["client/public/**"],
  },

  // Server
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
      "@typescript-eslint": tsPlugin as any,
    },

    rules: {
      "no-undef": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "no-unused-vars": "off",
    },
  },

  // Server tests
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
      "@typescript-eslint": tsPlugin as any,
    },

    rules: {
      "no-undef": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "no-unused-vars": "off",
    },
  },

  // Client
  {
    files: ["client/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
    plugins: {
      react: reactPlugin,
    },

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
      "react/react-in-jsx-scope": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  // Client tests
  {
    files: ["client/**/*.test.tsx", "client/**/__tests__/**/*.tsx"],
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
      "@typescript-eslint": tsPlugin as any,
      react: reactPlugin as any,
      "react-hooks": reactHooksPlugin as any,
      jest: jestPlugin as any,
    },

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
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "no-unused-vars": "off",
    },
  },

  // d.ts files
  {
    files: ["**/*.d.ts"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  // Prettier always has to be last
  prettier,
]);
