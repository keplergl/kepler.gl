// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const resolve = require('path').resolve;
const join = require('path').join;

// Import package.json to read version
const KeplerPackage = require('../package');

const SRC_DIR = resolve(__dirname, '../src');
const OUTPUT_DIR = resolve(__dirname, '../umd');

const LIBRARY_BUNDLE_CONFIG = () => ({
  entry: {
    KeplerGl: join(SRC_DIR, 'index.ts')
  },

  // Silence warnings about big bundles
  stats: {
    warnings: false
  },

  output: {
    // Generate the bundle in dist folder
    path: OUTPUT_DIR,
    filename: 'keplergl.min.js',
    globalObject: 'this',
    library: '[name]',
    libraryTarget: 'umd'
  },

  // let's put everything in
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      umd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
      umd: 'react-dom'
    },
    redux: {
      root: 'Redux',
      commonjs2: 'redux',
      commonjs: 'redux',
      amd: 'redux',
      umd: 'redux'
    },
    'react-redux': {
      root: 'ReactRedux',
      commonjs2: 'react-redux',
      commonjs: 'react-redux',
      amd: 'react-redux',
      umd: 'react-redux'
    },
    'styled-components': {
      commonjs: 'styled-components',
      commonjs2: 'styled-components',
      amd: 'styled-components',
      root: 'styled'
    }
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: ['node_modules', SRC_DIR]
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        loader: 'babel-loader',
        include: [SRC_DIR],
        options: {
          plugins: [
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
          ]
        }
      }
    ]
  },

  node: {
    fs: 'empty'
  }
});

module.exports = env => LIBRARY_BUNDLE_CONFIG(env);
