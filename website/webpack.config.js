// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const {resolve} = require('path');
const webpack = require('webpack');

const KeplerPackage = require('../package');
const {
  WEBPACK_ENV_VARIABLES,
  ENV_VARIABLES_WITH_INSTRUCTIONS,
  RESOLVE_ALIASES
} = require('../webpack/shared-webpack-configuration');

const LIB_DIR = resolve(__dirname, '..');
const SRC_DIR = resolve(LIB_DIR, './src');

const console = require('global/console');

const BABEL_CONFIG = {
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
  plugins: [
    ['@babel/plugin-transform-typescript', {isTSX: true, allowDeclareFields: true}],
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-optional-chaining',
    '@babel/plugin-transform-logical-assignment-operators',
    '@babel/plugin-transform-nullish-coalescing-operator',
    [
      'search-and-replace',
      {
        rules: [
          {
            search: '__PACKAGE_VERSION__',
            replace: KeplerPackage.version
          }
        ]
      }
    ]
  ]
};

const COMMON_CONFIG = {
  entry: ['./src/main'],
  output: {
    path: resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    modules: ['node_modules', SRC_DIR],
    alias: RESOLVE_ALIASES
  },

  module: {
    rules: [
      {
        // Compile ES2015 using bable
        test: /\.(js|jsx|ts|tsx)$/,
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
      // for compiling apache-arrow ESM module
      {
        test: /\.mjs$/,
        include: /node_modules\/apache-arrow/,
        type: 'javascript/auto'
      },
      {
        test: /\.js$/,
        loader: require.resolve('@open-wc/webpack-import-meta-loader'),
        include: [/node_modules\/parquet-wasm/]
      },
      // for compiling @probe.gl, website build started to fail (March, 2024)
      // netlify builder complains loader not found for these modules (April, 2024)
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        options: BABEL_CONFIG,
        include: [
          /node_modules\/@probe.gl/,
          /node_modules\/@loaders.gl/,
          /node_modules\/@math.gl/,
          /node_modules\/@geoarrow/
        ]
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
    // Provide default values to suppress warnings
    new webpack.EnvironmentPlugin(WEBPACK_ENV_VARIABLES)
  ],

  // Required to avoid deck.gl undefined module when code is minified
  optimization: {
    concatenateModules: false,
    providedExports: false,
    usedExports: false
  }
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

function validateEnvVariable(variable, instruction) {
  if (!process.env[variable]) {
    logError(`Error! ${variable} is not defined`);
    logInstruction(`Make sure to run "export ${variable}=<token>" before deploy the website`);
    logInstruction(instruction);
    throw new Error(`Missing ${variable}`);
  }
}

module.exports = env => {
  env = env || {};

  let config = COMMON_CONFIG;

  if (env.local) {
    config = addDevConfig(config);
  }

  if (env.prod) {
    Object.entries(ENV_VARIABLES_WITH_INSTRUCTIONS).forEach(entry => {
      // we validate each entry [name, instruction]
      validateEnvVariable(...entry);
    });
    config = addProdConfig(config);
  }

  return config;
};
