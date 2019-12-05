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

const {getGatsbyConfig} = require('ocular-gatsby/api');

const config = require('./ocular-config');

const gatsbyConfig = getGatsbyConfig(config);

gatsbyConfig.plugins.push({resolve: 'gatsby-plugin-no-sourcemaps'});

// Ensure gatsby-source-filesystem doesn't pick up too many files in modules directory
// https://www.gatsbyjs.org/packages/gatsby-source-filesystem/#options
gatsbyConfig.plugins.forEach(plugin => {
  if (plugin && typeof plugin === 'object' && plugin.resolve === 'gatsby-source-filesystem') {
    plugin.options = plugin.options || {};
    plugin.options.ignore = plugin.options.ignore || [];
    plugin.options.ignore.push('**/modules/**/test');
    plugin.options.ignore.push('**/modules/**/src');
    plugin.options.ignore.push('**/modules/**/dist');
    plugin.options.ignore.push('**/modules/**/wip');
    plugin.options.ignore.push('**/modules/**/*.json');
    plugin.options.ignore.push('**/arrowjs/**/*.json');
  }
});

// NOTE: uncomment to debug config
// console.log(JSON.stringify(gatsbyConfig, null, 2));

module.exports = gatsbyConfig;
