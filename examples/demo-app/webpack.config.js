// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const join = require('path').join;
const webpack = require('webpack');

const WEBPACK_ENV_VARIABLES = require('../../webpack/shared-webpack-configuration')
  .WEBPACK_ENV_VARIABLES;

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
        loader: 'babel-loader',
        include: [join(__dirname, 'src')],
        exclude: [/node_modules/]
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
