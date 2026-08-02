// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const resolve = require('path').resolve;
const join = require('path').join;
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const SRC_DIR = resolve(__dirname, '../src');
const OUTPUT_DIR = resolve(__dirname, '../build');

const LIBRARY_BUNDLE_CONFIG = () => ({
  mode: 'production',

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
    modules: ['node_modules', SRC_DIR],
    fallback: {
      fs: false
    }
  },
  // let's put everything in
  module: {
    rules: [
      {
        // webpack 5 treats some node_modules (e.g. @flowmap.gl) as strict ESM and
        // rejects their extension-less relative imports. Relax fullySpecified only
        // for node_modules so local ESM resolution is left unchanged.
        test: /\.m?js$/,
        include: [/node_modules/],
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.(js|ts|tsx)$/,
        loader: 'babel-loader',
        include: [SRC_DIR]
      }
    ]
  },

  plugins: [
    // default to null so a missing token doesn't abort a bundle-size analysis
    new webpack.EnvironmentPlugin({MapboxAccessToken: null}),
    // Exclude the @openassistant/* subtree (@kepler.gl/ai-assistant's heavy
    // third-party deps: @heroui + echarts + react-audio-voice-recorder) from the
    // size analysis. webpack 4 dropped it implicitly (no node_modules transpile /
    // older parser); webpack 5 bundles it, so ignore it explicitly to keep this
    // report comparable to previous builds.
    new webpack.IgnorePlugin({resourceRegExp: /^@openassistant(\/|$)/}),
    new BundleAnalyzerPlugin()
  ]
});

module.exports = env => LIBRARY_BUNDLE_CONFIG(env);
