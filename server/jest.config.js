/** @type {import('jest').Config} */
module.exports = {
<<<<<<< HEAD
  rootDir: '.',
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
=======
  rootDir: ".",
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec|test).ts"],
>>>>>>> c8095d9 (GI-124: Set up GH actions workflow for CI (#15))
  transformIgnorePatterns: ["/node_modules/"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
