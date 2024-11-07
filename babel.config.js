// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const {resolve} = require('path');
const KeplerPackage = require('./package');
const {RESOLVE_ALIASES} = require('./webpack/shared-webpack-configuration');

const nodeModules = resolve(__dirname, 'node_modules');

const PRESETS = ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'];
const PLUGINS = [
  ['@babel/plugin-transform-typescript', {isTSX: true, allowDeclareFields: true}],
  '@babel/plugin-transform-modules-commonjs',
  '@babel/plugin-transform-class-properties',
  '@babel/plugin-transform-optional-chaining',
  '@babel/plugin-transform-logical-assignment-operators',
  '@babel/plugin-transform-nullish-coalescing-operator',
  '@babel/plugin-transform-export-namespace-from',
  [
    '@babel/transform-runtime',
    {
      regenerator: true
    }
  ],
  [
    'module-resolver',
    {
      extensions: ['.js', '.ts', '.tsx', '.json'],
      root: ['./src'],
      alias: {
        test: './test',
        // We explicitly transpile this ESM library in scripts/fix-dependencies.js and consume the transpiled version here
        // This may not be needed once switch to Jest is complete as it is handled by transformIgnorePatterns
        '@mapbox/tiny-sdf': `${nodeModules}/@mapbox/tiny-sdf/index.cjs`,
        // compile from @kepler.gl src
        ...RESOLVE_ALIASES,
        // loaders.gl cjs bundle of polyfills is not transpiled properly, use esm instead
        '@loaders.gl/polyfills': `${nodeModules}/@loaders.gl/polyfills/src`
      }
    }
  ],
  [
    'search-and-replace',
    {
      rules: [
        {
          search: '__PACKAGE_VERSION__',
          replace: KeplerPackage.version
        }
      ]
    }
  ]
];
const ENV = {
  test: {
    plugins: ['istanbul']
  },
  debug: {
    sourceMaps: 'inline',
    retainLines: true
  }
};

module.exports = function babel(api) {
  api.cache(true);

  return {
    presets: PRESETS,
    plugins: PLUGINS,
    env: ENV
  };
};
