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

const resolve = require('path').resolve;
const join = require('path').join;
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const SRC_DIR = resolve(__dirname, '../src');
const OUTPUT_DIR = resolve(__dirname, '../build');

const LIBRARY_BUNDLE_CONFIG = env => ({
  entry: {
    KeplerGl: join(SRC_DIR, 'index.js')
  },

  // Silence warnings about big bundles
  stats: {
    warnings: false
  },

  output: {
    // Generate the bundle in dist folder
    path: OUTPUT_DIR,
    filename: 'bundle.js',
    publicPath: '/'
  },

  // let's put everything in
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [SRC_DIR]
      }
    ]
  },

  node: {
    fs: 'empty'
  },

  plugins: [new webpack.EnvironmentPlugin(['MapboxAccessToken']), new BundleAnalyzerPlugin()]
});

module.exports = env => LIBRARY_BUNDLE_CONFIG(env);
