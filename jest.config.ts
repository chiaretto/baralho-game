/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src',
  testPathIgnorePatterns: ['/__utils__/'],
  setupFiles: ['<rootDir>/../.jest/envVars.js']
};
