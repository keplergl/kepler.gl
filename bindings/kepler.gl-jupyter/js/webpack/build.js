// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const config = require('./config');

const mode = 'production';
module.exports = [
  {
    ...config.extension,
    devtool: 'source-map',
    mode
  },
  {
    ...config.widget,
    devtool: 'source-map',
    mode
  },
  config.umd,
  config.html
 ];
