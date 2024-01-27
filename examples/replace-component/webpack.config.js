// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const join = require('path').join;
const webpack = require('webpack');

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

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        loader: 'babel-loader',
        include: join(__dirname, 'src'),
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

  // Optional: Enables reading mapbox token from environment variable
  plugins: [new webpack.EnvironmentPlugin(['MapboxAccessToken'])]
};

// This line enables bundling against src in this repo rather than installed deck.gl module
module.exports = env => {
  return env ? require('../webpack.config.local')(CONFIG, __dirname)(env) : CONFIG;
};
