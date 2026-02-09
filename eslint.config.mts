// @ts-nocheck

import tsPlugin from "@typescript-eslint/eslint-plugin";
import * as tsParser from "@typescript-eslint/parser";
import globals from "globals";
import { defineConfig } from "eslint/config";
import reactPlugin from "eslint-plugin-react";
import js from "@eslint/js";
import jestPlugin from "eslint-plugin-jest";
import prettier from "eslint-config-prettier";

export default defineConfig([
  {
    ignores: [
      "client/public/**",
      "client/build/**",
      "client/dist/**",
      "client/coverage/**",
      "server/dist/**",
      "**/*.js.map",
      "**/*.d.ts.map",
      "**/*.d.ts",
    ],
  },

  // Server
  {
    files: ["server/**/*.{js,mjs,ts,mts}"],
    ignores: [
      "**/*.test.ts",
      "**/__tests__/**",
      "server/jest.config.js",
      "server/babel.config.js",
      "server/jest.integration.config.js",
    ],
    extends: [js.configs.recommended],

    languageOptions: {
      parser: tsParser,
      globals: { ...globals.node, ...globals.es2021 },
      parserOptions: {
        project: "server/tsconfig.json",
      },
    },

    plugins: {
      react: reactPlugin,
      "@typescript-eslint": tsPlugin as any,
    },

    rules: {
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "no-undef": "off",
      "no-console": ["warn", { allow: ["warn", "error", "debug"] }],
      "no-unused-vars": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // Server tests
  {
    files: ["server/**/*.test.ts", "server/**/__tests__/**/*.ts"],
    extends: [js.configs.recommended],

    languageOptions: {
      parser: tsParser,
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
      "no-console": ["warn", { allow: ["warn", "error", "debug"] }],
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
      "@typescript-eslint": tsPlugin as any,
    },

    extends: [js.configs.recommended],

    languageOptions: {
      parser: tsParser,
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
      "no-console": ["warn", { allow: ["warn", "error", "debug"] }],

      "no-unused-vars": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },

  // Client tests
  {
    files: [
      "client/**/*.test.ts",
      "client/**/*.test.tsx",
      "client/**/__tests__/**/*.ts",
      "client/**/__tests__/**/*.tsx",
    ],
    extends: [js.configs.recommended],

    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        ...globals.vitest,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: "client/tsconfig.json",
      },
    },

    plugins: {
      "@typescript-eslint": tsPlugin as any,
      react: reactPlugin as any,
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
      "no-console": ["warn", { allow: ["warn", "error", "debug"] }],
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
