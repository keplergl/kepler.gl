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

const path = require('path');
const version = require('../package.json').version;
const webpack = require('webpack');
const buildHtml = require('./build-html');

const rules = [
  {
    test: /\.js$/,
    loader: 'babel-loader',
    include: path.join(__dirname, '../lib', 'keplergl'),
    exclude: [/node_modules/]
  }
];

const plugins = [
  new webpack.EnvironmentPlugin(['MapboxAccessTokenJupyter'])
];

module.exports = {
  extension: {
    // Notebook extension
    //
    // This bundle only contains the part of the JavaScript that is run on
    // load of the notebook. This section generally only performs
    // some configuration for requirejs, and provides the legacy
    // "load_ipython_extension" function which is required for any notebook
    // extension.
    //
    entry: path.resolve(__dirname, '../lib/extension.js'),
    output: {
      filename: 'extension.js',
      path: path.resolve(__dirname, '../..', 'keplergl', 'static'),
      libraryTarget: 'amd'
    },
    node: {
      fs: 'empty'
    },
    plugins
  },

  widget: {
    // Bundle for the notebook containing the custom widget views and models
    //
    // This bundle contains the implementation for the custom widget views and
    // custom widget.
    // It must be an amd module
    //
    entry: path.resolve(__dirname, '../lib/index.js'),
    // watch: true,
    watchOptions: {
      ignored: ['dist', 'node_modules']
    },
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, '../..', 'keplergl', 'static'),
      libraryTarget: 'amd'
    },
    // adding source map significantly slows down the
    // devtool: 'source-map',
    module: {
      rules
    },
    externals: ['@jupyter-widgets/base'],
    node: {
      fs: 'empty'
    },
    plugins
  },

  html: buildHtml(rules, plugins),

  umd: {
    // Embeddable {{ cookiecutter.npm_package_name }} bundle
     
    //  This bundle is generally almost identical to the notebook bundle
    //  containing the custom widget views and models.
     
    //  The only difference is in the configuration of the webpack public path
    //  for the static assets.
     
    //  It will be automatically distributed by unpkg to work with the static
    //  widget embedder.
     
    //  The target bundle is always `dist/index.js`, which is the path required
    //  by the custom widget embedder.
     
    entry: path.resolve(__dirname, '../lib/embed.js'),
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, '../dist'),
      libraryTarget: 'amd',
      publicPath: `https://unpkg.com/keplergl-jupyter@${version}/dist/`
    },
    mode: 'production',
    module: {
      rules
    },
    externals: ['@jupyter-widgets/base'],
    node: {
      fs: 'empty'
    },
    plugins
  }
};

module.exports.rules = rules;
module.exports.plugins = plugins;
