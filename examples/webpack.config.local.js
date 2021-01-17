// Copyright (c) 2021 Uber Technologies, Inc.
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

const LIB_DIR = resolve(__dirname, '..');
const SRC_DIR = resolve(LIB_DIR, './src');

// For deck.gl upgrade, load deck.gl from node_modules of the root directory
const NODE_MODULES_DIR = resolve(__dirname, '../node_modules');

// For debugging deck.gl, load deck.gl from external deck.gl directory
const EXTERNAL_DECK_SRC = resolve(__dirname, '../../deck.gl');

// For debugging loaders.gl, load loaders.gl from external loaders.gl directory
const EXTERNAL_LOADERS_SRC = resolve(__dirname, '../../loaders.gl');

// Support for hot reloading changes to the deck.gl library:
function makeLocalDevConfig(env, EXAMPLE_DIR = LIB_DIR, externals = {}) {
  const resolveAlias = {
    // Imports kepler.gl library from the src directory in this repo
    'kepler.gl': SRC_DIR,
    react: `${NODE_MODULES_DIR}/react`,
    'react-dom': `${NODE_MODULES_DIR}/react-dom`,
    'react-redux': `${NODE_MODULES_DIR}/react-redux/lib`,
    'styled-components': `${NODE_MODULES_DIR}/styled-components`,
    'react-intl': `${NODE_MODULES_DIR}/react-intl`
  };

  // resolve deck.gl from local dir
  if (env.deck || env.deck_src) {
    // Load deck.gl from root node_modules
    // if env.deck_src Load deck.gl from deck.gl/modules/main/src folder parallel to kepler.gl
    resolveAlias['deck.gl'] = env.deck
      ? `${NODE_MODULES_DIR}/deck.gl/src`
      : `${EXTERNAL_DECK_SRC}/modules/main/src`;

    // if env.deck Load @deck.gl modules from root node_modules/@deck.gl
    // if env.deck_src Load @deck.gl modules from  deck.gl/modules folder parallel to kepler.gl
    externals['deck.gl'].forEach(mdl => {
      resolveAlias[`@deck.gl/${mdl}`] = env.deck
        ? `${NODE_MODULES_DIR}/@deck.gl/${mdl}/src`
        : `${EXTERNAL_DECK_SRC}/modules/${mdl}/src`;
    });

    ['luma.gl', 'probe.gl', 'loaders.gl'].forEach(name => {
      // if env.deck Load ${name} from root node_modules
      // if env.deck_src Load ${name} from deck.gl/node_modules folder parallel to kepler.gl
      resolveAlias[name] = env.deck
        ? `${NODE_MODULES_DIR}/${name}/src`
        : name === 'probe.gl'
        ? `${EXTERNAL_DECK_SRC}/node_modules/${name}/src`
        : `${EXTERNAL_DECK_SRC}/node_modules/@${name}/core/src`;

      // if env.deck Load @${name} modules from root node_modules/@${name}
      // if env.deck_src Load @${name} modules from deck.gl/node_modules/@${name} folder parallel to kepler.gl`
      externals[name].forEach(mdl => {
        resolveAlias[`@${name}/${mdl}`] = env.deck
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

  logStep(`resolve.alias:\n ${JSON.stringify(resolveAlias, null, 2)}`);

  // load deck.gl from
  return {
    // suppress warnings about bundle size
    devServer: {
      historyApiFallback: true,
      stats: {
        warnings: false
      }
    },

    devtool: 'source-map',

    resolve: {
      alias: resolveAlias
    },

    module: {
      rules: [
        {
          // Unfortunately, webpack doesn't import library source maps on its own...
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre',
          exclude: [/node_modules\/react-palm/, /node_modules\/react-data-grid/]
        }
      ]
    },
    // Optional: Enables reading mapbox token from environment variable
    plugins: [
      new webpack.EnvironmentPlugin([
        'MapboxAccessToken',
        'DropboxClientId',
        'MapboxExportToken',
        'CartoClientId'
      ])
    ]
  };
}

function makeBabelRule(env, exampleDir) {
  return {
    // Compile source using babel
    test: /\.js$/,
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
      join(exampleDir, 'src'),
      SRC_DIR
    ],
    // do not exclude deck.gl and luma.gl when loading from root/node_modules
    exclude:
      env.deck || env.deck_src
        ? [/node_modules\/(?!(@deck\.gl|@luma\.gl|@probe\.gl|probe.gl|@loaders\.gl)\/).*/]
        : [/node_modules/],
    options: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-export-namespace-from',
        [
          'module-resolver',
          {
            root: [SRC_DIR]
          }
        ],
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
  // find all @deck.gl @luma.gl @loaders.gl modules
  const modules = ['@deck.gl', '@loaders.gl', '@luma.gl', '@probe.gl'];
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
      'probe.gl': results[3]
    }))
    .then(externals => {
      const config = addLocalDevSettings(env, exampleConfig, exampleDir, externals);
      return addBabelSettings(env, config, exampleDir, externals);
    });
};
