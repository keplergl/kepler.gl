// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// This file contains webpack configuration settings that allow
// examples to be built against the deck.gl source code in this repo instead
// of building against their installed version of deck.gl.
//
// This enables using the examples to debug the main deck.gl library source
// without publishing or npm linking, with conveniences such hot reloading etc.

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const join = require('path').join;
const webpack = require('webpack');
const fs = require('fs');
const KeplerPackage = require('../package');
const {logStep, logError} = require('../scripts/log');
const {
  WEBPACK_ENV_VARIABLES,
  ENV_VARIABLES_WITH_INSTRUCTIONS,
  RESOLVE_ALIASES
} = require('../webpack/shared-webpack-configuration');

const LIB_DIR = resolve(__dirname, '..');
const SRC_DIR = resolve(LIB_DIR, './src');

// For deck.gl upgrade, load deck.gl from node_modules of the root directory
const NODE_MODULES_DIR = resolve(__dirname, '../node_modules');

// For debugging deck.gl, load deck.gl from external deck.gl directory
const EXTERNAL_DECK_SRC = resolve(__dirname, '../../deck.gl');

// For debugging loaders.gl, load loaders.gl from external loaders.gl directory
const EXTERNAL_LOADERS_SRC = resolve(__dirname, '../../loaders.gl');

// For debugging hubble.gl, load hubble.gl from external hubble.gl directory
const EXTERNAL_HUBBLE_SRC = resolve(__dirname, '../../hubble.gl');

// Support for hot reloading changes to the deck.gl library:
function makeLocalDevConfig(env, EXAMPLE_DIR = LIB_DIR, externals = {}) {
  const resolveAlias = RESOLVE_ALIASES;

  // Combine flags
  const useLocalDeck = env.deck || env.hubble_src;
  const useRepoDeck = env.deck_src;

  // resolve deck.gl from local dir
  if (useLocalDeck || useRepoDeck) {
    // Load deck.gl from root node_modules
    // if env.deck_src Load deck.gl from deck.gl/modules/main/src folder parallel to kepler.gl
    resolveAlias['deck.gl'] = useLocalDeck
      ? `${NODE_MODULES_DIR}/deck.gl/src`
      : `${EXTERNAL_DECK_SRC}/modules/main/src`;

    // if env.deck Load @deck.gl modules from root node_modules/@deck.gl
    // if env.deck_src Load @deck.gl modules from  deck.gl/modules folder parallel to kepler.gl
    externals['deck.gl'].forEach(mdl => {
      resolveAlias[`@deck.gl/${mdl}`] = useLocalDeck
        ? `${NODE_MODULES_DIR}/@deck.gl/${mdl}/src`
        : `${EXTERNAL_DECK_SRC}/modules/${mdl}/src`;
    });

    ['luma.gl', 'probe.gl', 'loaders.gl'].forEach(name => {
      // if env.deck Load ${name} from root node_modules
      // if env.deck_src Load ${name} from deck.gl/node_modules folder parallel to kepler.gl
      resolveAlias[name] = useLocalDeck
        ? `${NODE_MODULES_DIR}/${name}/src`
        : name === 'probe.gl'
        ? `${EXTERNAL_DECK_SRC}/node_modules/${name}/src`
        : `${EXTERNAL_DECK_SRC}/node_modules/@${name}/core/src`;

      // if env.deck Load @${name} modules from root node_modules/@${name}
      // if env.deck_src Load @${name} modules from deck.gl/node_modules/@${name} folder parallel to kepler.gl`
      externals[name].forEach(mdl => {
        resolveAlias[`@${name}/${mdl}`] = useLocalDeck
          ? `${NODE_MODULES_DIR}/@${name}/${mdl}/src`
          : `${EXTERNAL_DECK_SRC}/node_modules/@${name}/${mdl}/src`;
      });
    });
  }

  if (env.loaders_src) {
    externals['loaders.gl'].forEach(mdl => {
      resolveAlias[`@loaders.gl/${mdl}`] = `${EXTERNAL_LOADERS_SRC}/modules/${mdl}/src`;
    });
  }

  if (env.hubble_src) {
    externals['hubble.gl'].forEach(mdl => {
      resolveAlias[`@hubble.gl/${mdl}`] = `${EXTERNAL_HUBBLE_SRC}/modules/${mdl}/src`;
    });
  }

  logStep(`resolve.alias:\n ${JSON.stringify(resolveAlias, null, 2)}`);

  // load deck.gl from
  return {
    // suppress warnings about bundle size
    devServer: {
      historyApiFallback: true
    },

    devtool: 'source-map',

    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      modules: ['node_modules', SRC_DIR],
      alias: resolveAlias
    },

    module: {
      rules: [
        {
          // Unfortunately, webpack doesn't import library source maps on its own...
          test: /\.(js|ts|tsx)$/,
          use: ['source-map-loader'],
          enforce: 'pre',
          exclude: [/node_modules\/react-palm/, /node_modules\/react-data-grid/]
        },
        // for compiling apache-arrow ESM module
        {
          test: /\.mjs$/,
          include: /node_modules\/apache-arrow/,
          type: 'javascript/auto'
        }
      ]
    },
    // Optional: Enables reading mapbox token from environment variable
    plugins: [new webpack.EnvironmentPlugin(WEBPACK_ENV_VARIABLES)]
  };
}

function makeBabelRule(env, exampleDir) {
  return {
    // Compile source using babel
    test: /\.(js|ts|tsx)$/,
    loader: 'babel-loader',
    include: [
      ...(env.deck || env.deck_src
        ? [
            join(NODE_MODULES_DIR, '@deck.gl'),
            join(NODE_MODULES_DIR, '@luma.gl'),
            join(NODE_MODULES_DIR, '@probe.gl'),
            join(NODE_MODULES_DIR, '@loaders.gl'),
            join(EXTERNAL_DECK_SRC, 'modules'),
            join(EXTERNAL_DECK_SRC, 'node_modules/@luma.gl'),
            join(EXTERNAL_DECK_SRC, 'node_modules/@probe.gl'),
            join(EXTERNAL_DECK_SRC, 'node_modules/probe.gl'),
            join(EXTERNAL_DECK_SRC, 'node_modules/@loaders.gl')
          ]
        : []),
      ...(env.loaders_src ? [join(EXTERNAL_LOADERS_SRC, 'modules')] : []),
      ...(env.hubble_src ? [join(EXTERNAL_HUBBLE_SRC, 'modules')] : []),
      join(exampleDir, 'src'),
      SRC_DIR
    ],
    // do not exclude deck.gl and luma.gl when loading from root/node_modules
    exclude:
      env.deck || env.deck_src
        ? [/node_modules\/(?!(@deck\.gl|@luma\.gl|@probe\.gl|probe.gl|@loaders\.gl)\/).*/]
        : [/node_modules/],
    options: {
      presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
      plugins: [
        ['@babel/plugin-transform-typescript', {isTSX: true, allowDeclareFields: true}],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-export-namespace-from',
        '@babel/plugin-transform-runtime',
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
    }
  };
}

/**
 * Add local settings to load kepler/deck/luma from root node_modules
 * Add source map loader
 * Add Environment plugins
 * @param {Object} env
 * @param {Object} exampleConfig
 * @param {string} exampleDir
 * @param {Object} externals
 */
function addLocalDevSettings(env, exampleConfig, exampleDir, externals) {
  const localDevConfig = makeLocalDevConfig(env, exampleDir, externals);
  const config = {...exampleConfig, ...localDevConfig};

  config.resolve = config.resolve || {};
  config.resolve = {
    ...config.resolve,
    alias: {
      ...(config.resolve ? config.resolve.alias : {}),
      ...localDevConfig.resolve.alias
    }
  };

  config.module = {
    ...config.module,
    rules: [...(config.module ? config.module.rules : []), ...localDevConfig.module.rules]
  };

  return config;
}

function addBabelSettings(env, config, exampleDir) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules.filter(r => r.loader !== 'babel-loader'),
        makeBabelRule(env, exampleDir)
      ]
    }
  };
}

module.exports = (exampleConfig, exampleDir) => env => {
  // find all @deck.gl @luma.gl @loaders.gl @hubble.gl modules
  const modules = ['@deck.gl', '@loaders.gl', '@luma.gl', '@probe.gl', '@hubble.gl'];
  const loadAllDirs = modules.map(
    dir =>
      new Promise(function readDir(success, reject) {
        fs.readdir(join(NODE_MODULES_DIR, dir), function readDirItems(err, items) {
          if (err) {
            logError(`Cannot find ${dir} in node_modules, make sure it is installed.`, err);
            success(null);
          }
          success(items);
        });
      })
  );

  return Promise.all(loadAllDirs)
    .then(results => ({
      'deck.gl': results[0],
      'loaders.gl': results[1],
      'luma.gl': results[2],
      'probe.gl': results[3],
      'hubble.gl': results[4]
    }))
    .then(externals => {
      const config = addLocalDevSettings(env, exampleConfig, exampleDir, externals);
      return addBabelSettings(env, config, exampleDir, externals);
    });
};
