import * as globals from "globals";
import {defineConfig} from "eslint/config";
import * as reactPlugin from 'eslint-plugin-react';
import * as reactHooksPlugin from 'eslint-plugin-react-hooks';
import * as prettierPlugin from "eslint-plugin-prettier";

export default defineConfig([
  {
    files: ["server/**/*.{js,mjs,ts,mts}"],
    languageOptions: {
      globals: { ...globals.node, ...globals.es2021 },
      parserOptions: {
        project: "server/tsconfig.json",
      },
    },
    rules: {
      "no-undef": "off",
      "no-console": "warn",
    },
  },
  {
    files: ["client/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    } as any,
    extends: ["js/recommended", "plugin:prettier/recommended"],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: {jsx: true},
        project: "client/tsconfig.json",
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      prettier: prettierPlugin,
    } as any,
    extends: ["plugin:prettier/recommended"],
    rules: {
      "prettier/prettier": "error",
    },
  },
]);
