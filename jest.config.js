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
  // zarrita and its dependencies publish an `exports` map with only `types` and
  // `import` conditions, which jest's CommonJS resolver cannot match. Point at
  // the ESM entry points directly; they are transpiled via
  // transformIgnorePatterns below.
  moduleNameMapper: {
    '^zarrita$': '<rootDir>/node_modules/zarrita/dist/src/index.js',
    '^@zarrita/storage$': '<rootDir>/node_modules/@zarrita/storage/dist/src/index.js',
    '^@zarrita/storage/(.*)$': '<rootDir>/node_modules/@zarrita/storage/dist/src/$1.js',
    '^numcodecs$': '<rootDir>/node_modules/numcodecs/dist/index.js',
    '^numcodecs/(.*)$': '<rootDir>/node_modules/numcodecs/dist/$1.js'
  },
  transform: {
    // zarrita decodes chunks with BigInt exponentiation. The repo's babel config
    // has no browserslist targets, so preset-env downlevels `2n ** n` into
    // `Math.pow`, which throws on BigInt. These packages only need the module
    // format changed, so transform them against the running node instead.
    '[\\\\/]node_modules[\\\\/](zarrita|@zarrita|numcodecs)[\\\\/].+\\.js$': [
      'babel-jest',
      {
        configFile: false,
        babelrc: false,
        presets: [['@babel/preset-env', {targets: {node: 'current'}}]]
      }
    ],
    '\\.[jt]sx?$': 'babel-jest'
  },
  // Per https://jestjs.io/docs/configuration#transformignorepatterns-arraystring, transformIgnorePatterns ignores
  // node_modules and pnp folders by default so that they are not transpiled
  // Some libraries (even if transitive) are transitioning to ESM and need additional transpilation. Relevant issues:
  // - SQLRooms and cuid2/hashes: ESM dependencies used by the adapter hydration tests.
  // - tiny-sdf: https://github.com/visgl/deck.gl/issues/7735
  // - zarrita/@zarrita/@developmentseed: ESM-only, used by the Zarr layer.
  transformIgnorePatterns: [
    '/node_modules\\/(?!(.*@mapbox\\/tiny-sdf\\.*|@loaders\\.gl|@deck\\.gl|@deck\\.gl-community|@luma\\.gl|@hubble\\.gl|@flowmap\\.gl|@math\\.gl|d3-.*|@sqlrooms|@paralleldrive/cuid2|@noble/hashes|kdbush|preact|maplibregl-mapbox-request-transformer|react-date-picker|react-time-picker|react-calendar|react-clock|react-fit|@wojtekmaj\\/date-utils|get-user-locale|make-event-props|update-input-width|detect-element-overflow|memoize|mimic-function|zarrita|@zarrita|numcodecs|@developmentseed))',
    '\\.pnp\\.[^\\/]+$'
  ]
};

module.exports = config;
