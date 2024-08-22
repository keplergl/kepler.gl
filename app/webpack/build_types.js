// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const resolve = require('path').resolve;
const DtsBundleWebpack = require('dts-bundle-webpack');

const SRC_DIR = resolve(__dirname, '../src');
const OUTPUT_DIR = resolve(__dirname, '../dist');

const LIBRARY_BUNDLE_CONFIG = () => ({
  // Silence warnings about big bundles
  stats: {
    warnings: false
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: ['node_modules', SRC_DIR]
  },

  // let's put everything in
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        loader: 'babel-loader',
        include: [SRC_DIR]
      }
    ]
  },

  node: {
    fs: 'empty'
  },

  plugins: [
    new DtsBundleWebpack({
      name: 'kepler.gl',
      main: `${SRC_DIR}/index.d.ts`,
      out: `${OUTPUT_DIR}/types.d.ts`,
      outputAsModuleFolder: true
    })
  ]
});

module.exports = env => LIBRARY_BUNDLE_CONFIG(env);
