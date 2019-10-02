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
const join = require('path').join;
const webpack = require('webpack');

const LIB_DIR = resolve(__dirname, '..');
const SRC_DIR = resolve(LIB_DIR, './src');

const NODE_MODULES_DIR = resolve(__dirname, '../node_modules');

const KeplerPackage = require('../package');

// Support for hot reloading changes to the deck.gl library:
function makeLocalDevConfig(env, EXAMPLE_DIR = LIB_DIR) {
  return {
    // suppress warnings about bundle size
    devServer: {
      historyApiFallback: true,
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
        'styled-components': resolve(
          EXAMPLE_DIR,
          './node_modules/styled-components'
        ),
        ...(env.deck
          ? {
              'luma.gl': `${NODE_MODULES_DIR}/luma.gl/src`,
              '@luma.gl/constants': `${NODE_MODULES_DIR}/@luma.gl/constants/src`,
              '@luma.gl/core': `${NODE_MODULES_DIR}/@luma.gl/core/src`,
              '@luma.gl/debug': `${NODE_MODULES_DIR}/@luma.gl/debug/src`,
              '@luma.gl/webgl': `${NODE_MODULES_DIR}/@luma.gl/webgl/src`,
              '@luma.gl/webgl-state-tracker': `${NODE_MODULES_DIR}/@luma.gl/webgl-state-tracker/src`,
              '@luma.gl/webgl2-polyfill': `${NODE_MODULES_DIR}/@luma.gl/webgl2-polyfill/src`,
              '@luma.gl/shadertools': `${NODE_MODULES_DIR}/@luma.gl/shadertools/src`,
              '@luma.gl/addons': `${NODE_MODULES_DIR}/@luma.gl/addons/src`,

              'deck.gl': `${NODE_MODULES_DIR}/deck.gl/src`,
              '@deck.gl/core': `${NODE_MODULES_DIR}/@deck.gl/core/src`,
              '@deck.gl/layers': `${NODE_MODULES_DIR}/@deck.gl/layers/src`,
              '@deck.gl/react': `${NODE_MODULES_DIR}/@deck.gl/react/src`,
              '@deck.gl/mesh-layers': `${NODE_MODULES_DIR}/@deck.gl/mesh-layers/src`,

              'probe.gl': `${NODE_MODULES_DIR}/probe.gl/src`,

              '@loaders.gl/core': `${NODE_MODULES_DIR}/@loaders.gl/core/src`,
              '@loaders.gl/gltf': `${NODE_MODULES_DIR}/@loaders.gl/gltf/src`
            }
          : {})
      }
    },
    module: {
      rules: [
        {
          // Unfortunately, webpack doesn't import library source maps on its own...
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre',
          exclude: [/node_modules\/react-palm/, /node_modules\/react-data-grid/]
        }
      ]
    },
    // Optional: Enables reading mapbox token from environment variable
    plugins: [
      new webpack.EnvironmentPlugin([
        'MapboxAccessToken',
        'CartoClientId',
        'DropboxClientId',
        'MapboxExportToken'
      ])
    ]
  };
}

function makeBabelRule(env, exampleDir) {
  return {
    // Compile source using bable
    test: /\.js$/,
    loader: 'babel-loader',
    include: [
      ...(env.deck
        ? [
            `${NODE_MODULES_DIR}/@deck.gl`,
            `${NODE_MODULES_DIR}/@luma.gl`,
            `${NODE_MODULES_DIR}/@probe.gl`,
            `${NODE_MODULES_DIR}/@loaders.gl`
          ]
        : []),
      join(exampleDir, 'src'),
      SRC_DIR
    ],
    // do not exclude deck.gl and luma.gl when loading from root/node_modules
    exclude: env.deck
      ? [/node_modules\/(?!(@deck\.gl|@luma\.gl|@probe\.gl|@loaders\.gl)\/).*/]
      : [/node_modules/],
    options: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: [
        ['@babel/plugin-proposal-decorators', {legacy: true}],
        '@babel/plugin-proposal-class-properties',
        [
          '@babel/transform-runtime',
          {
            regenerator: true
          }
        ],
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
            root: [SRC_DIR]
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
      ]
    }
  };
}

/**
 * Add local settings to load kepler/deck/luma from root node_modules
 * Add source map loader
 * Add Environment plugins
 * @param {*} exampleConfig
 * @param {*} exampleDir
 */
function addLocalDevSettings(env, exampleConfig, exampleDir) {
  const localDevConfig = makeLocalDevConfig(env, exampleDir);
  const config = {...exampleConfig, ...localDevConfig};

  config.resolve = config.resolve || {};
  config.resolve = {
    ...config.resolve,
    alias: {
      ...(config.resolve ? config.resolve.alias : {}),
      ...localDevConfig.resolve.alias
    }
  };

  config.module = {
    ...config.module,
    rules: [
      ...(config.module ? config.module.rules : []),
      ...localDevConfig.module.rules
    ]
  };

  return config;
}

function addBableSettings(env, config, exampleDir) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules.filter(r => r.loader !== 'babel-loader'),
        makeBabelRule(env, exampleDir)
      ]
    }
  };
}

module.exports = (exampleConfig, exampleDir) => env => {
  let config = addLocalDevSettings(env, exampleConfig, exampleDir);
  config = addBableSettings(env, config, exampleDir);

  return config;
};
