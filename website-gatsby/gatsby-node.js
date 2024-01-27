// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const {resolve} = require('path');

// Looks like onCreateWebpackConfig does not receive theme options?
function onCreateWebpackConfig(opts, ocularOptions = global.ocularOptions) {
  const {
    stage,     // build stage: ‘develop’, ‘develop-html’, ‘build-javascript’, or ‘build-html’
    // rules,     // Object (map): set of preconfigured webpack config rules
    // loaders,   // Object (map): set of preconfigured webpack config loaders
    // plugins,    // Object (map): A set of preconfigured webpack config plugins
    actions,
    getConfig // Function that returns the current webpack config
  } = opts;

  const config = getConfig();

  config.resolve = config.resolve || {};
  config.resolve.alias = config.resolve.alias || {};
  Object.assign(config.resolve.alias, {
    'components': resolve(__dirname, '../src/components'),
    'constants': resolve(__dirname, '../src/constants'),
    'actions': resolve(__dirname, '../src/actions'),
    'utils': resolve(__dirname, '../src/utils')
    // 'kepler.gl/dist': libSources,
    // // Imports the kepler.gl library from the src directory in this repo
    // 'kepler.gl': libSources,
    // react: resolve(rootDir, './node_modules/react'),
    // 'styled-components': resolve(rootDir, './node_modules/styled-components'),
    // 'react-redux': resolve(rootDir, './node_modules/react-redux'),
    // 'react-palm': resolve(rootDir, './node_modules/react-palm')
  });


  // NOTE: actions.setWebpackConfig MERGES in the new config, actions.replaceWebpackConfig SETS it
  actions.replaceWebpackConfig(config);
}

module.exports.onCreateWebpackConfig = onCreateWebpackConfig;