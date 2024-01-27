// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackENV = process.env.WEBPACK_ENV;
const config = require('./webpack.config.js')(webpackENV);

const isDeveloping = process.env.NODE_ENV !== 'production';
const ADDRESS = '0.0.0.0';
const DEV_PORT = 3000;
const port = isDeveloping ? DEV_PORT : process.env.PORT;

const app = express();

const HTML_FILE = path.join(__dirname, 'index.html');
/* eslint-disable no-console */
if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', function response(req, res) {
    console.log('indexPath', HTML_FILE);
    res.sendFile(HTML_FILE);
  });
} else {
  app.use(express.static(__dirname));
  app.get('*', function response(req, res) {
    res.sendFile(HTML_FILE);
  });
}

app.listen(port, ADDRESS, function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info(
    `==> 🌎 Listening on port ${port}. Open up http://${ADDRESS}:${port}/ in your browser.`
  );
});
/* eslint-enable no-console */
