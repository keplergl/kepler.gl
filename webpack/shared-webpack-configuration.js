// Copyright (c) 2023 Uber Technologies, Inc.
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
  'tiny-warning': `${SRC_DIR}/utils/src/noop.ts`
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
  FoursquareUserMapsURL: 'You can get the token at https://location.foursquare.com/developer',
};

const WEBPACK_ENV_VARIABLES = Object.keys(ENV_VARIABLES_WITH_INSTRUCTIONS).reduce((acc, key) => ({
  ...acc,
  [key]: null
}), {});

module.exports = {
  ENV_VARIABLES_WITH_INSTRUCTIONS,
  WEBPACK_ENV_VARIABLES,
  RESOLVE_ALIASES: resolveAlias
}
