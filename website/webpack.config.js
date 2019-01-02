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

const {resolve, join} = require('path');
const webpack = require('webpack');

const rootDir = join(__dirname, '..');
const libSources = join(rootDir, 'src');

const BABEL_CONFIG = {
  // use babelrc: false to prevent babel-loader using root .babelrc
  // https://github.com/babel/babel-preset-env/issues/399
  // so that we can set modules: false, to avoid tree shaking
  // https://github.com/webpack/webpack/issues/3974
  babelrc: false,
  presets: [['es2015', {modules: false, loose: true}], 'react', 'stage-0'].map(
    name =>
      Array.isArray(name)
        ? [require.resolve(`babel-preset-${name[0]}`), name[1]]
        : require.resolve(`babel-preset-${name}`)
  ),
  plugins: [
    'transform-decorators-legacy',
    'transform-runtime',
    ['module-resolver', {root: [libSources]}]
  ].map(
    name =>
      Array.isArray(name)
        ? [require.resolve(`babel-plugin-${name[0]}`), name[1]]
        : require.resolve(`babel-plugin-${name}`)
  )
};

const COMMON_CONFIG = {
  entry: ['./src/main'],

  resolve: {
    alias: {
      'kepler.gl/dist': libSources,
      // Imports the kepler.gl library from the src directory in this repo
      'kepler.gl': libSources,
      react: resolve(rootDir, './node_modules/react'),
      'styled-components': resolve(rootDir, './node_modules/styled-components'),
      'react-palm': resolve(rootDir, './node_modules/react-palm')
    }
  },

  module: {
    rules: [
      {
        // Compile ES2015 using bable
        test: /\.js$/,
        loader: 'babel-loader',
        options: BABEL_CONFIG,
        include: [resolve('..'), libSources],
        exclude: [/node_modules/]
      },
      {
        test: /\.(eot|svg|ico|ttf|woff|woff2|gif|jpe?g|png)$/,
        loader: 'url-loader'
      },
      {
        test: /\.(svg|ico|gif|jpe?g|png)$/,
        loader: 'file-loader?name=[name].[ext]'
      }
    ]
  },

  node: {
    fs: 'empty'
  },

  // Optional: Enables reading mapbox token from environment variable
  plugins: [
    new webpack.EnvironmentPlugin(['MapboxAccessToken', 'DropboxClientId'])
  ]
};

const addDevConfig = config => {
  config.module.rules.push({
    // Unfortunately, webpack doesn't import library sourcemaps on its own...
    test: /\.js$/,
    use: ['source-map-loader'],
    enforce: 'pre',
    exclude: [/node_modules\/react-palm/, /node_modules\/react-data-grid/]
  });

  return Object.assign(config, {
    devtool: 'source-maps',

    plugins: config.plugins.concat([
      // new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ])
  });
};

const addProdConfig = config => {
  return Object.assign(config, {
    output: {
      path: resolve(__dirname, './dist'),
      filename: 'bundle.js'
    }
  });
};

function logError(msg) {
  console.log('\x1b[31m%s\x1b[0m', msg);
}

function logInstruction(msg) {
  console.log('\x1b[36m%s\x1b[0m', msg);
}

module.exports = env => {
  env = env || {};

  let config = COMMON_CONFIG;

  if (env.local) {
    config = addDevConfig(config);
  }

  if (env.prod) {
    if (!process.env.MapboxAccessToken) {
      logError('Error! MapboxAccessToken is not defined');
      logInstruction(`Make sure to run "export MapboxAccessToken=<token>" before deploy the website`);
      logInstruction('You can get the token at http://t.uber.com/kepler.gl-token');
      throw new Error('Missing Mapbox Access token');
    }
    config = addProdConfig(config);
  }

  return config;
};
