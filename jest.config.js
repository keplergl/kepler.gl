// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/** @type {import('jest').Config} */
const config = {
  collectCoverageFrom: ['<rootDir>/src/**/*.{js|ts|tsx}', '!<rootDir>/src/**/*.spec.js'],
  coverageDirectory: './jest-coverage',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  verbose: true,
  testMatch: ['<rootDir>/src/**/*.spec.js', '<rootDir>/test/**/*.spec.js'],
  // Per https://jestjs.io/docs/configuration#transformignorepatterns-arraystring, transformIgnorePatterns ignores
  // node_modules and pnp folders by default so that they are not transpiled
  // Some libraries (even if transitive) are transitioning to ESM and need additional transpilation. Relevant issues:
  // - tiny-sdf: https://github.com/visgl/deck.gl/issues/7735
  transformIgnorePatterns: ["/node_modules/(?!(@mapbox/tiny-sdf)/)", "\\.pnp\\.[^\\\/]+$"]
};

module.exports = config;
