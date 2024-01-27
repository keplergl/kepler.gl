// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const config = require('./config');

module.exports = [

  // Notebook extension
  config.extension,

  // Notebook widget
  {
    ...config.widget,
    devtool: 'source-map',
    watch: true,
    watchOptions: {
      ignored: ['dist', 'node_modules']
    }
  },

  // Html template
  config.html
];
