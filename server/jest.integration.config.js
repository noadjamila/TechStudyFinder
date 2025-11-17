/** @type {import('jest').Config} */
const config = {
  rootDir: "./",

  testEnvironment: "node",

  testMatch: ["**/*.integration.test.ts"],

  testPathIgnorePatterns: ["/node_modules/"],

  testTimeout: 30000,

  setupFiles: ["<rootDir>/jest.setup.ts"],

  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest",
  },
};

module.exports = config;
