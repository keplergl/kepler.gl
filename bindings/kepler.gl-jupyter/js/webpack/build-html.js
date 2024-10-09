// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');

const packageJson = require('../package.json');
const {dependencies} = packageJson;

const entry = path.resolve(__dirname, '../lib/keplergl/main.js');
const template = path.resolve(__dirname, '../template/keplergl-html.ejs');

function clearCarats(version) {
  return version && version.startsWith('^') ? version.substring(1) : version;
}

const VERSIONS = {
  react: clearCarats(dependencies.react),
  reactDom: clearCarats(dependencies['react-dom']),
  redux: clearCarats(dependencies.redux),
  reactRedux: clearCarats(dependencies['react-redux']),
  // reactIntl UMD build is not available after 5.x
  reactIntl: '4.7.6',
  reactCopyToClipboard: clearCarats(dependencies['react-copy-to-clipboard']),
  styledComponents: clearCarats(dependencies['styled-components']),
  keplergl: clearCarats(dependencies['@kepler.gl/components'])
};

const externals = [
  {react: 'React'},
  {'react-dom': 'ReactDOM'},
  {redux: 'Redux'},
  {'react-redux': 'ReactRedux'},
  {'react-intl': 'ReactIntl'},
  {'react-copy-to-clipboard': 'CopyToClipboard'},
  {'styled-components': 'styled'},
  {'kepler.gl/reducers': 'KeplerGl'},
  {'kepler.gl/components': 'KeplerGl'},
  {'kepler.gl/actions': 'KeplerGl'},
  {'kepler.gl/processors': 'KeplerGl'},
  {'kepler.gl/schemas': 'KeplerGl'},
  {'kepler.gl/middleware': 'KeplerGl'},
  {'react-helmet': 'Helmet'}
].reduce((accu, ext) => ({
  ...accu,
  [Object.keys(ext)[0]]: {
    root: Object.values(ext)[0],
    commonjs2: Object.keys(ext)[0],
    commonjs: Object.keys(ext)[0]
  }
}), {});

module.exports = (rules, plugins) => ({
  entry,

  output: {
    path: path.resolve(__dirname, '../..', 'keplergl', 'static'),
    libraryTarget: 'umd'
  },

  externals,

  module: {
    rules
  },
  plugins: [
    // ...webpackConfig.plugins,
    // new webpack.optimize.UglifyJsPlugin({sourceMap: true, compressor: {comparisons: false, warnings: false}}),
    ...plugins,
    new HtmlWebpackPlugin({
      template,
      appMountId: 'app-content',
      filename: 'keplergl.html',
      inject: true,
      links: [
        'https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/uber-fonts/4.0.0/superfine.css',
        'https://unpkg.com/maplibre-gl@^3/dist/maplibre-gl.css'
      ],
      scripts: [

        `https://unpkg.com/react@${VERSIONS.react}/umd/react.production.min.js`,
        `https://unpkg.com/react-dom@${VERSIONS.reactDom}/umd/react-dom.production.min.js`,
        `https://unpkg.com/redux@${VERSIONS.redux}/dist/redux.js`,
        `https://unpkg.com/react-redux@${VERSIONS.reactRedux}/dist/react-redux.min.js`,
        `https://unpkg.com/react-intl@${VERSIONS.reactIntl}/dist/react-intl.min.js`,
        `https://unpkg.com/react-copy-to-clipboard@${VERSIONS.reactCopyToClipboard}/build/react-copy-to-clipboard.min.js`,

        `https://unpkg.com/styled-components@${VERSIONS.styledComponents}/dist/styled-components.min.js`,

        // load kepler.gl last
        `https://unpkg.com/kepler.gl@${VERSIONS.keplergl}/umd/keplergl.min.js`
      ],
      title: 'Kepler.gl'
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/main/])
  ],

  node: {
    fs: 'empty'
  }
});
