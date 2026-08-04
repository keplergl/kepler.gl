// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const KeplerPackage = require('./package');

// Plugins shared by both CJS and ESM builds.
const SHARED_PLUGINS = [
  ['@babel/plugin-transform-typescript', {isTSX: true, allowDeclareFields: true}],
  '@babel/plugin-transform-class-properties',
  '@babel/plugin-transform-optional-chaining',
  '@babel/plugin-transform-logical-assignment-operators',
  '@babel/plugin-transform-nullish-coalescing-operator',
  '@babel/plugin-transform-export-namespace-from',
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

module.exports = function babel(api) {
  // Cache per BABEL_ENV so that CJS and ESM builds get separate cached results.
  api.cache.using(() => process.env.BABEL_ENV || process.env.NODE_ENV || 'development');

  const isEsm = api.env('esm');
  const isTest = api.env('test');
  const isDebug = api.env('debug');

  // ESM build: modules:false preserves import/export so Vite/esbuild can tree-shake.
  // CJS build (default / test): transforms import/export to require/module.exports.
  const presets = [
    ['@babel/preset-env', isEsm ? {modules: false} : {}],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ];

  const plugins = [
    ...SHARED_PLUGINS,
    // CJS and test builds need the CommonJS transform; ESM must omit it.
    ...(isEsm ? [] : ['@babel/plugin-transform-modules-commonjs']),
    // Runtime helpers: ESM variant uses ESM imports, no require() calls.
    ['@babel/transform-runtime', {regenerator: true, ...(isEsm ? {useESModules: true} : {})}],
    ...(isTest ? ['istanbul'] : [])
  ];

  return {
    presets,
    plugins,
    ...(isDebug ? {sourceMaps: 'inline', retainLines: true} : {})
  };
};
