// Copyright (c) 2019 Uber Technologies, Inc.
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

// This file contains webpack configuration settings that allow
// examples to be built against the deck.gl source code in this repo instead
// of building against their installed version of deck.gl.
//
// This enables using the examples to debug the main deck.gl library source
// without publishing or npm linking, with conveniences such hot reloading etc.

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const webpack = require('webpack');
const LIB_DIR = resolve(__dirname, '..');
const SRC_DIR = resolve(LIB_DIR, './src');

const KeplerPackage = require('../package');

// Support for hot reloading changes to the deck.gl library:
function makeLocalDevConfig(EXAMPLE_DIR = LIB_DIR) {
  return {
    // suppress warnings about bundle size
    devServer: {
      stats: {
        warnings: false
      }
    },

    devtool: 'source-map',

    resolve: {
      alias: {
        // Imports kepler.gl library from the src directory in this repo
        'kepler.gl': SRC_DIR,
        react: resolve(EXAMPLE_DIR, './node_modules/react'),
        'styled-components': resolve(EXAMPLE_DIR, './node_modules/styled-components')
      }
    },
    module: {
      rules: [
        {
          // Unfortunately, webpack doesn't import library source maps on its own...
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre',
          exclude: [
            /node_modules\/react-palm/,
            /node_modules\/react-data-grid/
          ]
        }
      ]
    },
    // Optional: Enables reading mapbox token from environment variable
    plugins: [
      new webpack.EnvironmentPlugin([
        'MapboxAccessToken',
        'DropboxClientId',
        'MapboxExportToken'
      ])
    ]
  };
}

const BABEL_RULE = {
  module: {
    rules: [
      {
        // Compile source using bable
        test: /\.js$/,
        loader: 'babel-loader',
        include: [SRC_DIR],
        exclude: [/node_modules/],
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react'
          ],
          plugins: [
            ['@babel/plugin-proposal-decorators', {legacy: true}],
            '@babel/plugin-proposal-class-properties',
            ['@babel/transform-runtime', {
              regenerator: true
            }],
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-syntax-import-meta',
            '@babel/plugin-proposal-json-strings',
            '@babel/plugin-proposal-function-sent',
            '@babel/plugin-proposal-export-namespace-from',
            '@babel/plugin-proposal-numeric-separator',
            '@babel/plugin-proposal-throw-expressions',
            '@babel/plugin-proposal-export-default-from',
            '@babel/plugin-proposal-logical-assignment-operators',
            '@babel/plugin-proposal-optional-chaining',
            [
              '@babel/plugin-proposal-pipeline-operator',
              {
                proposal: 'minimal'
              }
            ],
            '@babel/plugin-proposal-nullish-coalescing-operator',
            '@babel/plugin-proposal-do-expressions',
            '@babel/plugin-proposal-function-bind',
            '@babel/plugin-transform-modules-commonjs',
            [
              'module-resolver',
              {
                root: [
                  SRC_DIR
                ]
              }
            ],
            ['search-and-replace', {
              rules: [
                {
                  search: '__PACKAGE_VERSION__',
                  replace: KeplerPackage.version
                }
              ]
            }]
          ]
        }
      }
    ]
  }
};

function addLocalDevSettings(sourceConfig, exampleDir) {
  const LOCAL_DEV_CONFIG = makeLocalDevConfig(exampleDir);
  const config = {...LOCAL_DEV_CONFIG, ...sourceConfig};

  config.resolve = config.resolve || {};
  config.resolve = {
    ...config.resolve,
    alias: {
      ...(config.resolve ? config.resolve.alias : null),
      ...LOCAL_DEV_CONFIG.resolve.alias
    }
  };

  config.module = {
    ...config.module,
    rules: [
      ...(config.module ? config.module.rules : null),
      ...LOCAL_DEV_CONFIG.module.rules
    ]
  };

  return config;
}

function addBableSettings(config) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        ...BABEL_RULE.module.rules
      ]
    }
  };
}

module.exports = (config, exampleDir) => env => {
  config = addLocalDevSettings(config, exampleDir);
  config = addBableSettings(config);
  return config;
};
