// Copyright (c) 2021 Uber Technologies, Inc.
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

const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SRC_DIR = resolve(__dirname, '../src');
const TEST_DIR = resolve(__dirname, './');

const COMMON_CONFIG = {
  mode: 'development',

  devServer: {
    stats: {
      warnings: false
    },
    clientLogLevel: 'debug'
  },
  entry: resolve(__dirname, './browser.js'),
  output: {
    filename: 'bundle.js'
  },
  devtool: 'inline-source-maps',

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [SRC_DIR, TEST_DIR],
        exclude: [/node_modules/],
        options: {
          rootMode: 'upward',
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-export-namespace-from',
            [
              'module-resolver',
              {
                root: [SRC_DIR],
                alias: {
                  test: TEST_DIR
                }
              }
            ]
          ]
        }
      }
    ]
  },

  node: {
    fs: 'empty'
  },

  plugins: [new HtmlWebpackPlugin()]
};

module.exports = (env = {}, opts = {}) => {
  return COMMON_CONFIG;
};
