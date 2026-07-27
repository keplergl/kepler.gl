// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const {resolve} = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {RESOLVE_ALIASES} = require('../webpack/shared-webpack-configuration');
const SRC_DIR = resolve(__dirname, '../src');
const TEST_DIR = resolve(__dirname, './');

const COMMON_CONFIG = {
  mode: 'development',

  stats: {
    warnings: false
  },

  // @turf/jsts ships a minified build that references a .map file it doesn't
  // include — suppress the resulting source-map-loader noise so real warnings
  // are not lost in the output.
  ignoreWarnings: [
    {module: /@turf\/jsts/}
  ],

  devServer: {
    client: {
      logging: 'verbose',
      overlay: false
    }
  },
  output: {
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: [SRC_DIR, 'node_modules'],
    // resolve @kepler.gl/* to source (aliases shared with the website build)
    // enzyme is not compatible with React 19; alias to the no-op stub so the
    // bundle compiles. Tests that still use Enzyme's API will need to be
    // migrated to @testing-library/react (see test/helpers/rtl-utils.js).
    alias: {
      ...RESOLVE_ALIASES,
      enzyme: resolve(TEST_DIR, 'helpers/enzyme-mock.js'),
      // @probe.gl/test-utils only exports "." in its exports map; webpack 5 blocks
      // the /polyfill subpath. Alias directly to the file to bypass the restriction.
      '@probe.gl/test-utils/polyfill': resolve(__dirname, '../node_modules/@probe.gl/test-utils/polyfill.js')
    },
    // webpack 5 no longer ships node core polyfills; the browser test bundle
    // (tape, pngjs, etc.) still relies on a handful of them.
    fallback: {
      fs: false,
      path: require.resolve('path-browserify'),
      zlib: require.resolve('browserify-zlib'),
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
      os: require.resolve('os-browserify/browser'),
      buffer: require.resolve('buffer/'),
      assert: require.resolve('assert/'),
      util: require.resolve('util/')
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        use: ['source-map-loader'],
        enforce: 'pre'
      },
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
        include: [SRC_DIR, TEST_DIR],
        exclude: [/node_modules/],
        options: {
          rootMode: 'upward',
          presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          plugins: [
            ['@babel/plugin-transform-typescript', {isTSX: true, allowDeclareFields: true}],
            '@babel/plugin-transform-class-properties',
            '@babel/plugin-transform-optional-chaining',
            '@babel/plugin-transform-logical-assignment-operators',
            '@babel/plugin-transform-nullish-coalescing-operator',
            '@babel/plugin-transform-export-namespace-from',
            [
              'module-resolver',
              {
                root: [SRC_DIR],
                alias: {
                  test: TEST_DIR
                }
              }
            ]
          ]
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin(),
    // webpack 5 no longer auto-provides these globals used by node-style deps
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ]
};

module.exports = () => {
  return COMMON_CONFIG;
};
