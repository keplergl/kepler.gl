/** @type {import('jest').Config} */
const config = {
  collectCoverageFrom: ['<rootDir>/src/**/*.{js|ts|tsx}', '!<rootDir>/src/**/*.spec.js'],
  coverageDirectory: './jest-coverage',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  verbose: true,
  testMatch: ['<rootDir>/src/**/*.spec.js', '<rootDir>/test/**/*.spec.js']
};

module.exports = config;
