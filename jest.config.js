/** @type {import('jest').Config} */
const config = {
  coverageDirectory: './jest-coverage',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  verbose: true,
  testMatch: ['**/?(*.)+(spec).[jt]s?(x)']
};

module.exports = config;
