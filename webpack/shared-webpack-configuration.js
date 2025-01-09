// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const KeplerPackage = require('../package.json');
const {join, resolve} = require('path');

const LIB_DIR = resolve(__dirname, '..');
const SRC_DIR = resolve(LIB_DIR, './src');
const NODE_MODULES_DIR = resolve(__dirname, '../node_modules');

const resolveAlias = {
  react: `${NODE_MODULES_DIR}/react`,
  'react-dom': `${NODE_MODULES_DIR}/react-dom`,
  'react-redux': `${NODE_MODULES_DIR}/react-redux/lib`,
  'styled-components': `${NODE_MODULES_DIR}/styled-components`,
  'react-intl': `${NODE_MODULES_DIR}/react-intl`,
  // Suppress useless warnings from react-date-picker's dep
  'tiny-warning': `${SRC_DIR}/utils/src/noop.ts`,
  // kepler.gl and loaders.gl need to use same apache-arrow
  'apache-arrow': `${NODE_MODULES_DIR}/apache-arrow`
};

// add kepler.gl submodule aliases
const workspaces = KeplerPackage.workspaces;
workspaces.forEach(workspace => {
  // workspace =  "./src/types",  "./src/constants", etc
  const moduleName = workspace.split('/').pop();
  resolveAlias[`@kepler.gl/${moduleName}`] = join(SRC_DIR, `${moduleName}/src`);
});

const ENV_VARIABLES_WITH_INSTRUCTIONS = {
  MapboxAccessToken: 'You can get the token at https://www.mapbox.com/help/how-access-tokens-work/',
  DropboxClientId: 'You can get the token at https://www.dropbox.com/developers',
  CartoClientId: 'You can get the token at https://www.mapbox.com/help/how-access-tokens-work/',
  MapboxExportToken: 'You can get the token at https://location.foursquare.com/developer',
  FoursquareClientId: 'You can get the token at https://location.foursquare.com/developer',
  FoursquareDomain: 'You can get the token at https://location.foursquare.com/developer',
  FoursquareAPIURL: 'You can get the token at https://location.foursquare.com/developer',
  FoursquareUserMapsURL: 'You can get the token at https://location.foursquare.com/developer'
};

const WEBPACK_ENV_VARIABLES = Object.keys(ENV_VARIABLES_WITH_INSTRUCTIONS).reduce(
  (acc, key) => ({
    ...acc,
    [key]: null
  }),
  {}
);

module.exports = {
  ENV_VARIABLES_WITH_INSTRUCTIONS,
  WEBPACK_ENV_VARIABLES,
  RESOLVE_ALIASES: resolveAlias
};
