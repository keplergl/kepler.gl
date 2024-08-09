// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/** @type {import('jest').Config} */
const config = {
  collectCoverageFrom: ['<rootDir>/src/**/*.{js|ts|tsx}', '!<rootDir>/src/**/*.spec.js'],
  coverageDirectory: './jest-coverage',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  verbose: true,
  testPathIgnorePatterns: [
    // ignore all dist computed directories
    '<rootDir>/.*(/|\\\\)dist(/|\\\\).*'
  ],
  testMatch: [
    '<rootDir>/src/**/*.spec.(ts|tsx)',
    '<rootDir>/src/**/*.spec.js',
    '<rootDir>/test/**/*.spec.js'
  ],
  // Per https://jestjs.io/docs/configuration#transformignorepatterns-arraystring, transformIgnorePatterns ignores
  // node_modules and pnp folders by default so that they are not transpiled
  // Some libraries (even if transitive) are transitioning to ESM and need additional transpilation. Relevant issues:
  // - tiny-sdf: https://github.com/visgl/deck.gl/issues/7735
  transformIgnorePatterns: [
    '/node_modules\\/(?!(.*@mapbox\\/tiny-sdf\\.*|@loaders\\.gl))',
    '\\.pnp\\.[^\\/]+$'
  ]
};

module.exports = config;
