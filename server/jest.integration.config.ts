import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  rootDir: "./",

  testEnvironment: "node",

  preset: "ts-jest",

  testMatch: ["<rootDir>/test/integration/**/*.test.ts"],

  testPathIgnorePatterns: ["/node_modules/"],

  testTimeout: 30000,
};

export default config;
