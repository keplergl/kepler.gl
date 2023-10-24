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

const forceTranspile = [
  // ESM libraries that require transpilation
  /@deck.gl\/layers/,
  /@loaders.gl\/polyfills/,
  // For some reason babel crashes even before trying to transpile this library
  // Instead we force transpile @deck.gl/layers which includes it, and alias to a transpiled version in babel.config.js
  /@mapbox\/tiny-sdf/
];

require('@babel/register')({
  // This tells babel where to look for `babel.config.js` file
  root: __dirname,
  ignore: [
    filepath => {
      return forceTranspile.some(patt => patt.test(filepath))
        ? false
        : Boolean(filepath.match(/node_modules/));
    }
  ],
  only: [__dirname],
  extensions: ['.ts', '.js', '.tsx', '.json']
});

require('@babel/polyfill');
var path = require('path');
var glob = require('glob');

// Requiring mapbox-gl here prevents polyfilling errors during tests.
require('mapbox-gl');

// eslint-disable-next-line func-names
process.argv.slice(2).forEach(function(arg) {
  // eslint-disable-next-line func-names
  glob(arg, function(er, files) {
    if (er) throw er;

    // eslint-disable-next-line func-names
    files.forEach(function(file) {
      require(path.resolve(process.cwd(), file));
    });
  });
});
