const resolve = require('path').resolve;
const webpack = require('webpack');

const LIBRARY_BUNDLE_CONFIG = {
  // Bundle the source code
  entry: {
    lib: resolve('./src/index.js')
  },

  // Silence warnings about big bundles
  stats: {
    warnings: false
  },

  output: {
    // Generate the bundle in dist folder
    path: resolve('./dist'),
    filename: '[name]-bundle.js',
    library: 'kepler.gl',
    libraryTarget: 'umd'
  },

  // Exclude any non-relative imports from resulting bundle
  externals: [
    /^[a-z\.\-0-9]+$/
  ],

  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: src
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /.*\.(gif|png|jpe?g|svg)$/i,
      loader: 'url-loader'
    }]
  },

  node: {
    fs: 'empty'
  },

  plugins: [
    // leave minification to app
    // new webpack.optimize.UglifyJsPlugin({comments: false})
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env),
        BROWSER: JSON.stringify(true)
      }
    })
  ]
};

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
  return LIBRARY_BUNDLE_CONFIG;
};
