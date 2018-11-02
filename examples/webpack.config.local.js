// Copyright (c) 2018 Uber Technologies, Inc.
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
const webpack = require('webpack');

const LIB_DIR = resolve(__dirname, '..');
const SRC_DIR = resolve(LIB_DIR, './src');
const DIST_DIR = resolve(LIB_DIR, './dist');
const TEST_DIR = resolve(LIB_DIR, './test');

// Support for hot reloading changes to the deck.gl library:
function makeLocalDevConfig(EXAMPLE_DIR = LIB_DIR) {
  return {
    // suppress warnings about bundle size
    devServer: {
      stats: {
        warnings: false
      }
    },

    devtool: 'source-map',

    resolve: {
      modules: [resolve(LIB_DIR, './node_modules')],
      alias: {
        //   // For importing modules that are not exported at root
        'kepler.gl/dist': DIST_DIR,

        //   // Imports the kepler.gl library from the src directory in this repo
        'kepler.gl': SRC_DIR,
        'kepler.gl/test': TEST_DIR
      }
    },
    module: {
      rules: [
        {
          // Unfortunately, webpack doesn't import library source maps on its own...
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre',
          exclude: [
            /node_modules\/react-palm/,
            /node_modules\/react-data-grid/,
          ]
        }
      ]
    },
    // Optional: Enables reading mapbox token from environment variable
    plugins: [
      new webpack.EnvironmentPlugin(['MapboxAccessToken'])
    ]
  };
}

const BABEL_CONFIG = {
  // use babelrc: false to prevent babel-loader using root .babelrc
  // https://github.com/babel/babel-preset-env/issues/399
  // so that we can set modules: false, to avoid tree shaking
  // https://github.com/webpack/webpack/issues/3974
  babelrc: false,
  presets: [
    ['es2015', {modules: false, loose: true}],
    'react',
    'stage-0',
  ].map(name => Array.isArray(name) ?
    [require.resolve(`babel-preset-${name[0]}`), name[1]] :
    require.resolve(`babel-preset-${name}`)),
  plugins: [
    'transform-decorators-legacy',
    'transform-runtime',
    ['module-resolver', {root: [SRC_DIR]}]
  ].map(name => Array.isArray(name) ?
    [require.resolve(`babel-plugin-${name[0]}`), name[1]] :
    require.resolve(`babel-plugin-${name}`))
};

const BABEL_RULE = {
  module: {
    rules: [
      {
        // Compile source using bable
        test: /\.js$/,
        loader: 'babel-loader',
        options: BABEL_CONFIG,
        include: [SRC_DIR],
        exclude: [/node_modules/]
      }
    ]
  }
};

function addLocalDevSettings(config, exampleDir) {
  const LOCAL_DEV_CONFIG = makeLocalDevConfig(exampleDir);
  config = Object.assign({}, LOCAL_DEV_CONFIG, config);
  config.resolve = config.resolve || {};
  config.resolve.alias = config.resolve.alias || {};
  config.resolve.modules = [].concat(LOCAL_DEV_CONFIG.resolve.modules, config.resolve.modules);
  Object.assign(config.resolve.alias, LOCAL_DEV_CONFIG.resolve.alias);

  config.module = config.module || {};
  Object.assign(config.module, {
    rules: (config.module.rules || []).concat(LOCAL_DEV_CONFIG.module.rules)
  });
  return config;
}

function addBableSettings(config) {
  config.module = config.module || {};
  Object.assign(config.module, {
    rules: (config.module.rules || []).concat(BABEL_RULE.module.rules)
  });
  return config;
}

module.exports = (config, exampleDir) => env => {
  // npm run start-local now transpiles the lib
  //if (env && env.local) {
  config = addLocalDevSettings(config, exampleDir);
  config = addBableSettings(config);
  //}

  // npm run start-es6 does not transpile the lib
  // if (env && env.es6) {
  //   config = addLocalDevSettings(config, exampleDir);
  //   console.warn(JSON.stringify(config, null, 2));
  // }

  return config;
};
