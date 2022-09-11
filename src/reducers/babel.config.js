// Copyright (c) 2022 Uber Technologies, Inc.
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

const KeplerPackage = require('./package');

const PRESETS = ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'];
const PLUGINS = [
  ['@babel/plugin-transform-typescript', {isTSX: true, allowDeclareFields: true}],
  '@babel/plugin-transform-modules-commonjs',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-export-namespace-from',
  '@babel/plugin-proposal-optional-chaining',
  [
    '@babel/transform-runtime',
    {
      regenerator: true
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
];
const ENV = {
  test: {
    plugins: ['istanbul']
  },
  debug: {
    sourceMaps: 'inline',
    retainLines: true
  }
};

module.exports = function babel(api) {
  api.cache(true);

  return {
    presets: PRESETS,
    plugins: PLUGINS,
    env: ENV
  };
};
