// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const express = require('express');
const path = require('path');

const ADDRESS = '0.0.0.0';
const PORT = process.env.PORT || 3000;

const app = express();

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Always return index.html for any route (SPA)
app.get('*', function response(req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

/* eslint-disable no-console */
app.listen(PORT, ADDRESS, function onStart(err) {
  if (err) {
    console.error(err);
    return;
  }
  console.info(`==> 🌎 Listening on port ${PORT}. Open up http://${ADDRESS}:${PORT}/`);
});
/* eslint-enable no-console */
