/** @type {import('jest').Config} */
module.exports = {
  rootDir: '.',
  roots: [
    "<rootDir>/src",
    "<rootDir>/__tests__"
  ],
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  transformIgnorePatterns: ["/node_modules/"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
