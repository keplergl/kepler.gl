// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Entry point for the unpkg bundle containing custom model definitions.
//
// It differs from the notebook bundle in that it does not need to define a
// dynamic baseURL for the static assets and may load some css that would
// already be loaded by the notebook otherwise.

// Export widget models and views, and the npm package version number.
module.exports = require('./keplergl-plugin');
module.exports.version = require('../package.json').version;
