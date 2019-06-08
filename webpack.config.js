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

const resolve = require('path').resolve;
const webpack = require('webpack');

const SRC_DIR = resolve('./src');
const LIBRARY_BUNDLE_CONFIG = env => ({
  // Bundle the source code
  entry: {
    lib: SRC_DIR + '/index.js'
  },

  // Silence warnings about big bundles
  stats: {
    warnings: false
  },

  output: {
    // Generate the bundle in dist folder
    path: resolve('./dist'),
    filename: 'index.js',
    library: 'kepler.gl'
    // libraryTarget: 'umd'
  },

  // Exclude any non-relative imports from resulting bundle
  externals: [
    /^[a-z\.\-0-9]+$/
  ],

  module: {
    rules: [
      {
      test: /\.scss$/,
      use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "sass-loader" // compiles Sass to CSS, using Node Sass by default
      ]
    },
    {
      // Preprocess your css files
      // you can add additional loaders here (e.g. sass/less etc.)
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },{
      test: /\.js$/,
      loader: 'babel-loader',
      include: [SRC_DIR]
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, 
    // {
    //   test: /\.scss$/,
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
    // }
  ],
  },

  node: {
    fs: 'empty'
  },

  plugins: [
    // leave minification to app
    // new webpack.optimize.UglifyJsPlugin({comments: false}),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env),
        BROWSER: JSON.stringify(true),
      }
    })
  ]
});

const TEST_BROWSER_CONFIG = {
  devServer: {
    stats: {
      warnings: false
    },
    quiet: true
  },

  // Bundle the tests for running in the browser
  entry: {
    'test-browser': resolve('./test/browser.js')
  },

  // Generate a bundle in dist folder
  output: {
    path: resolve('./dist'),
    filename: '[name]-bundle.js'
  },

  devtool: '#inline-source-maps',

  resolve: {
    alias: {
      'kepler.gl/test': resolve('./test'),
      'kepler.gl': resolve('./src')
    }
  },

  module: {
    rules: []
  },

  node: {
    fs: 'empty'
  },

  plugins: []
};


module.exports = env => {
  
  env = env || {};
  if (env.test) {
    return TEST_BROWSER_CONFIG;
  }

  console.log(
    JSON.stringify(LIBRARY_BUNDLE_CONFIG(env), null, 2));
  return LIBRARY_BUNDLE_CONFIG(env);
};
