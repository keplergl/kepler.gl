// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const {resolve} = require('path');
const KeplerPackage = require('./package');

const nodeModules = resolve(__dirname, 'node_modules');

const PRESETS = ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'];
const PLUGINS = [
  ['@babel/plugin-transform-typescript', {isTSX: true, allowDeclareFields: true}],
  '@babel/plugin-transform-modules-commonjs',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-export-namespace-from',
  '@babel/plugin-proposal-optional-chaining',
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
        '@mapbox/tiny-sdf': `${nodeModules}/@mapbox/tiny-sdf/index.cjs`
      },
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
