// Copyright (c) 2023 Uber Technologies, Inc.
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
const DtsBundleWebpack = require('dts-bundle-webpack');

const SRC_DIR = resolve(__dirname, '../src');
const OUTPUT_DIR = resolve(__dirname, '../dist');

const LIBRARY_BUNDLE_CONFIG = env => ({
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
