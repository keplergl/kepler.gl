// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const KeplerPackage = require('./package');

module.exports = function babel(api) {
  api.cache(true);

  const presets = ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'];
  const plugins = [
    '@babel/plugin-proposal-class-properties',
    'transform-inline-environment-variables',
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
  ];

  return {
    presets,
    plugins
  };
};
