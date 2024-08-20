// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SRC_DIR = resolve(__dirname, '../src');
const TEST_DIR = resolve(__dirname, './');

const COMMON_CONFIG = {
  mode: 'development',

  devServer: {
    stats: {
      warnings: false
    },
    clientLogLevel: 'debug'
  },
  output: {
    filename: 'bundle.js'
  },
  devtool: 'inline-source-maps',

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: [SRC_DIR, 'node_modules']
  },

  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        use: ['source-map-loader'],
        enforce: 'pre'
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
            '@babel/plugin-transform-export-namespace-from'[
              ('module-resolver',
              {
                root: [SRC_DIR],
                alias: {
                  test: TEST_DIR
                }
              })
            ]
          ]
        }
      }
    ]
  },

  node: {
    fs: 'empty'
  },

  plugins: [new HtmlWebpackPlugin()]
};

module.exports = () => {
  return COMMON_CONFIG;
};
