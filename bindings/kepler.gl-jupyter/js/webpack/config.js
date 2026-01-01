// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const path = require('path');
const version = require('../package.json').version;
const webpack = require('webpack');
const buildHtml = require('./build-html');

const rules = [
  {
    test: /\.(js|jsx|ts|tsx)$/,
    loader: 'babel-loader',
    include: path.join(__dirname, '../lib', 'keplergl'),
    exclude: [/node_modules\/(?!(@monaco-editor|@radix-ui))/]
  },
  // fix for arrow-related errors
  {
    test: /\.mjs$/,
    include: /node_modules[\\/]apache-arrow/,
    type: 'javascript/auto'
  },
  {
    test: /\.js$/,
    loader: require.resolve('@open-wc/webpack-import-meta-loader'),
    include: [/node_modules\/parquet-wasm/]
  },
  // for compiling @probe.gl, website build started to fail (March, 2024)
  {
    test: /\.(js|ts)$/,
    loader: 'babel-loader',
    include: [
      /node_modules[\\/]@probe.gl/,
      /node_modules[\\/]@loaders.gl/,
      /node_modules[\\/]@math.gl/,
      /node_modules[\\/]@geoarrow/
    ]
  },
  {
    test: /\.m?js$/,
    include: [
      /node_modules\/@duckdb\/duckdb-wasm/,
      /node_modules\/@radix-ui/,
      /node_modules\/@monaco-editor\/react/
    ],
    type: 'javascript/auto'
  },
  // Handle @loaders.gl ESM modules for webpack 5
  {
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false
    },
    include: [
      /node_modules\/@loaders\.gl/,
      /node_modules\/@math\.gl/,
      /node_modules\/@probe\.gl/,
      /node_modules\/@geoarrow/
    ],
    type: 'javascript/auto'
  }
];

const plugins = [
  new webpack.EnvironmentPlugin({
    MapboxAccessTokenJupyter: null
  }),
  new webpack.ProvidePlugin({
    process: 'process/browser'
  })

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
      library: {
        name: 'amd',
        type: 'amd'
      }
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
      chunkFormat: false,
      path: path.resolve(__dirname, '../..', 'keplergl', 'static'),
      library: {
        name: 'amd',
        type: 'amd'
      }
    },
    // adding source map significantly slows down the
    // devtool: 'source-map',
    module: {
      rules
    },
    externals: ['@jupyter-widgets/base'],
    resolve: buildHtml.resolve,
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
      chunkFormat: false,
      path: path.resolve(__dirname, '../dist'),
      library: {
        type: 'amd',
        name: 'amd'
      },
      publicPath: `https://unpkg.com/keplergl-jupyter@${version}/dist/`
    },
    mode: 'production',
    module: {
      rules
    },

    externals: ['@jupyter-widgets/base'],
    resolve: buildHtml.resolve,
    plugins
  }
};

module.exports.rules = rules;
module.exports.plugins = plugins;
