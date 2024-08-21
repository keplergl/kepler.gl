// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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

// Requiring mapbox-gl here prevents polyfill errors during tests.
require('mapbox-gl');

// eslint-disable-next-line func-names
process.argv.slice(2).forEach(function (arg) {
  // eslint-disable-next-line func-names
  glob(arg, function (er, files) {
    if (er) throw er;

    // eslint-disable-next-line func-names
    files.forEach(function (file) {
      require(path.resolve(process.cwd(), file));
    });
  });
});
