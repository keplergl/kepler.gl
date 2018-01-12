// This file contains webpack configuration settings that allow
// examples to be built against the deck.gl source code in this repo instead
// of building against their installed version of deck.gl.
//
// This enables using the examples to debug the main deck.gl library source
// without publishing or npm linking, with conveniences such hot reloading etc.

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const webpack = require('webpack');

const LIB_DIR = resolve(__dirname, '..');
const SRC_DIR = resolve(LIB_DIR, './src');

// Support for hot reloading changes to the deck.gl library:
function makeLocalDevConfig(EXAMPLE_DIR = LIB_DIR) {
  return {
    // suppress warnings about bundle size
    devServer: {
      stats: {
        warnings: false
      }
    },

    devtool: 'source-map',

    resolve: {
      alias: {
        // For importing modules that are not exported at root
        'kepler.gl/dist': SRC_DIR,
        // Imports the kepler.gl library from the src directory in this repo
        'kepler.gl': SRC_DIR,
        react: resolve(LIB_DIR, './node_modules/react')
      }
    },
    module: {
      rules: [
        {
          // Unfortunately, webpack doesn't import library sourcemaps on its own...
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre',
          exclude: [
            /node_modules\/react-palm/
          ]
        },
        {
          test: /\.scss$/,
          // TODO: need to add postcss to replace the autoprefix-loader that is deprecated
          use: ['style-loader', 'css-loader', 'sass-loader'],
          include: [SRC_DIR]
        }
      ]
    },
    // Optional: Enables reading mapbox token from environment variable
    plugins: [
      new webpack.EnvironmentPlugin(['MapboxAccessToken'])
    ]
  };
}

const BABEL_CONFIG = {
  presets: [
    ['es2015', {modules: false, loose: true}],
    'react',
    'stage-0',
  ].map(name => Array.isArray(name) ?
    [require.resolve(`babel-preset-${name[0]}`), name[1]] :
    require.resolve(`babel-preset-${name}`)),
  plugins: [
    'transform-decorators-legacy',
    'transform-runtime',
    ['module-resolver', {root: [SRC_DIR]}]
  ].map(name => Array.isArray(name) ?
    [require.resolve(`babel-plugin-${name[0]}`), name[1]] :
    require.resolve(`babel-plugin-${name}`))
};

const BABEL_RULE = {
  module: {
    rules: [
      {
        // Compile source using bable
        test: /\.js$/,
        loader: 'babel-loader',
        options: BABEL_CONFIG,
        include: [SRC_DIR],
        exclude: [/node_modules/]
      }
    ]
  }
};

function addLocalDevSettings(config, exampleDir) {
  const LOCAL_DEV_CONFIG = makeLocalDevConfig(exampleDir);
  config = Object.assign({}, LOCAL_DEV_CONFIG, config);
  config.resolve = config.resolve || {};
  config.resolve.alias = config.resolve.alias || {};
  Object.assign(config.resolve.alias, LOCAL_DEV_CONFIG.resolve.alias);

  config.module = config.module || {};
  Object.assign(config.module, {
    rules: (config.module.rules || []).concat(LOCAL_DEV_CONFIG.module.rules)
  });
  return config;
}

function addBableSettings(config) {
  config.module = config.module || {};
  Object.assign(config.module, {
    rules: (config.module.rules || []).concat(BABEL_RULE.module.rules)
  });
  return config;
}

module.exports = (config, exampleDir) => env => {
  // npm run start-local now transpiles the lib
  //if (env && env.local) {
  config = addLocalDevSettings(config, exampleDir);
  config = addBableSettings(config);
  console.warn(JSON.stringify(config, null, 2));
  //}

  // npm run start-es6 does not transpile the lib
  // if (env && env.es6) {
  //   config = addLocalDevSettings(config, exampleDir);
  //   config = addBableSettings(config);
  //   console.warn(JSON.stringify(config, null, 2));
  // }

  return config;
};
