// Copyright (c) 2019 Uber Technologies, Inc.
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
  presets: [
    '@babel/preset-env',
    '@babel/preset-react'
  ],
  plugins: [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    "@babel/plugin-proposal-class-properties",
    ["@babel/transform-runtime", {
      "regenerator": true
    }],
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-import-meta",
    "@babel/plugin-proposal-json-strings",
    "@babel/plugin-proposal-function-sent",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-proposal-throw-expressions",
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-proposal-logical-assignment-operators",
    "@babel/plugin-proposal-optional-chaining",
    [
      "@babel/plugin-proposal-pipeline-operator",
      {
        "proposal": "minimal"
      }
    ],
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-do-expressions",
    "@babel/plugin-proposal-function-bind",
    "@babel/plugin-transform-modules-commonjs",
    ["inline-json-import", {}],
    [
      "module-resolver",
      {
        "root": [
          "../src"
        ],
        "alias": {
          "test": "../test"
        }
      }
    ]
  ]
};

const COMMON_CONFIG = {
  entry: [
    './src/main'
  ],
  output: {
    path: resolve(__dirname, "build"),
    filename: "bundle.js",
    publicPath: "/"
  },

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
        exclude: [/node_modules/]
      },
      {
        test: /\.(eot|svg|ico|ttf|woff|woff2|gif|jpe?g|png)$/,
        loader: 'url-loader'
      },
      {
        test: /\.(svg|ico|gif|jpe?g|png)$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      // Add the above block to below
      // {
      //   test: /\.scss$/, // Change .css to .scss
      //   use: [
      //     require.resolve('style-loader'),
      //     {
      //       loader: require.resolve('css-loader'),
      //       options: {
      //         importLoaders: 1,
      //         modules: true, // Add this option 
      //         localIdentName: '[name]__[local]__[hash:base64:5]' // Add this option
      //       },
      //     },
      //     {
      //       loader: require.resolve('postcss-loader'),
      //       options: {
      //         // Necessary for external CSS imports to work
      //         // https://github.com/facebookincubator/create-react-app/issues/2677
      //         ident: 'postcss',
      //         plugins: () => [
      //           require('postcss-flexbugs-fixes'),
      //           autoprefixer({
      //             browsers: [
      //               '>1%',
      //               'last 4 versions',
      //               'Firefox ESR',
      //               'not ie < 9', // React doesn't support IE8 anyway
      //             ],
      //             flexbox: 'no-2009',
      //           }),
      //         ],
      //       },
      //     },
      //     // Add 'sass-loader' with includePaths
      //     { 
      //       loader: require.resolve('sass-loader'),
      //       options: {
      //         includePaths: [path.styles]
      //       }
      //     }
      //   ],
      // },
      {
        test: /\.css$/,
        use: [
          { loader: ['style-loader'](/loaders/style-loader) },
          {
            loader: ['css-loader'](/loaders/css-loader),
            options: {
              modules: true
            }
          },
          { loader: ['sass-loader'](/loaders/sass-loader) }
        ]
      },
      {
        // Preprocess your css files
        // you can add additional loaders here (e.g. sass/less etc.)
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },

  node: {
    fs: 'empty'
  },

  // to support browser history api and remove the '#' sign
  devServer: {
    historyApiFallback: true
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
    exclude: [/node_modules\/react-palm/, /node_modules\/react-data-grid/,]
    // exclude: [/node_modules\/react-palm/, /node_modules\/react-data-grid/,/\.sass$/,/\.scss$/,]
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
      logInstruction('You can get the token at https://www.mapbox.com/help/how-access-tokens-work/');
      throw new Error('Missing Mapbox Access token');
    }
    config = addProdConfig(config);
  }

  return config;
};
