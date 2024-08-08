// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const resolve = require('path').resolve;
const join = require('path').join;
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const SRC_DIR = resolve(__dirname, '../src');
const OUTPUT_DIR = resolve(__dirname, '../build');

const LIBRARY_BUNDLE_CONFIG = () => ({
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

  plugins: [new webpack.EnvironmentPlugin(['MapboxAccessToken']), new BundleAnalyzerPlugin()]
});

module.exports = env => LIBRARY_BUNDLE_CONFIG(env);
