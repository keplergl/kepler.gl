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