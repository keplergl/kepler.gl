// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const join = require('path').join;
const webpack = require('webpack');

const WEBPACK_ENV_VARIABLES =
  require('../../webpack/shared-webpack-configuration').WEBPACK_ENV_VARIABLES;

const CONFIG = {
  // bundle app.js and everything it imports, recursively.
  entry: {
    app: resolve('./src/main.js')
  },
  output: {
    path: resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              '@babel/plugin-transform-class-properties',
              '@babel/plugin-transform-optional-chaining',
              '@babel/plugin-transform-logical-assignment-operators',
              '@babel/plugin-transform-nullish-coalescing-operator',
              '@babel/plugin-transform-export-namespace-from'
            ],
            include: [
              join(__dirname, 'src'),
              /node_modules\/@loaders\.gl/,
              /node_modules\/@probe\.gl/,
              /node_modules\/@math\.gl/,
              /node_modules\/@kepler\.gl/
            ],
            exclude: [/node_modules\/(?!(@loaders\.gl|@probe\.gl|@kepler\.gl|@math\.gl)).*/]
          }
        }
      },
      // fix for arrow-related errors
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      }
    ]
  },

  node: {
    fs: 'empty'
  },

  // to support browser history api and remove the '#' sign
  devServer: {
    historyApiFallback: true
  },

  // Optional: Enables reading mapbox and dropbox client token from environment variable
  plugins: [new webpack.EnvironmentPlugin(WEBPACK_ENV_VARIABLES)]
};

// This line enables bundling against src in this repo rather than installed kepler.gl module
module.exports = env => {
  return env ? require('../webpack.config.local')(CONFIG, __dirname)(env) : CONFIG;
};
