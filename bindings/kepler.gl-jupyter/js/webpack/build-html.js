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

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');

const packageJson = require('../package.json');
const {dependencies} = packageJson;

const entry = path.resolve(__dirname, '../lib/keplergl/main.js');
const template = path.resolve(__dirname, '../template/keplergl-html.ejs');

function clearCarats(version) {
  return version && version.startsWith('^') ? version.substring(1) : version;
}

const VERSIONS = {
  react: clearCarats(dependencies.react),
  reactDom:clearCarats(dependencies['react-dom']),
  redux: clearCarats(dependencies.redux),
  reactRedux: clearCarats(dependencies['react-redux']),
  reactVirtualized: clearCarats(dependencies['react-virtualized']),
  styledComponents: clearCarats(dependencies['styled-components']),
  keplergl: clearCarats(dependencies['kepler.gl'])
}

const MAPBOX_TOKEN = process.env.MapboxAccessTokenJupyter; // eslint-disable-line

const externals = [
  {react: 'React'},
  {'react-dom': 'ReactDOM'},
  {redux: 'Redux'},
  {'react-redux': 'ReactRedux'},
  {'styled-components': 'styled'},
  {'kepler.gl/reducers': 'KeplerGl'},
  {'kepler.gl/components': 'KeplerGl'},
  {'kepler.gl/actions': 'KeplerGl'},
  {'kepler.gl/processors': 'KeplerGl'},
  {'kepler.gl/schemas': 'KeplerGl'},
  {'kepler.gl/dist/middleware': 'KeplerGl'},
  {'react-virtualized/dist/commonjs': 'ReactVirtualized'},
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
      inlineSource: '.(js|css)$',
      links: [
        'http://d1a3f4spazzrp4.cloudfront.net/kepler.gl/uber-fonts/4.0.0/superfine.css',
        'https://api.tiles.mapbox.com/mapbox-gl-js/v0.42.0/mapbox-gl.css'
      ],
      scripts: [

        `https://unpkg.com/react@${VERSIONS.react}/umd/react.production.min.js`,
        `https://unpkg.com/react-dom@${VERSIONS.reactDom}/umd/react-dom.production.min.js`,
        `https://unpkg.com/redux@${VERSIONS.redux}/dist/redux.js`,
        `https://unpkg.com/react-redux@${VERSIONS.reactRedux}/dist/react-redux.min.js`,
        `https://unpkg.com/react-virtualized@${VERSIONS.reactVirtualized}/dist/umd/react-virtualized.js`,
        `https://unpkg.com/styled-components@${VERSIONS.styledComponents}/dist/styled-components.min.js`,

        // load kepler.gl last
        `https://unpkg.com/kepler.gl@${VERSIONS.keplergl}/umd/keplergl.min.js`
      ],
      title: 'Kepler.gl'
    }),
    new HtmlWebpackExcludeAssetsPlugin(),
    new HtmlWebpackInlineSourcePlugin()
  ],

  node: {
    fs: 'empty'
  }
});
