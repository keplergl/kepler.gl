// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// test in puppeteer browser
// require('@probe.gl/test-utils/polyfill');
import Console from 'global/console';

const test = require('tape-catch');
const enableDOMLogging = require('@probe.gl/test-utils')._enableDOMLogging;
enableDOMLogging();

test.onFinish(window.browserTestDriver_finish);
test.onFailure(args => {
  Console.log(args);
  window.browserTestDriver_fail();
});

test('Browser tests', t => {
  // running all tests in browser for debugging
  require('./node/index.js');
  // require('./browser/index.js');
  // require('./browser-headless/index.js');

  t.end();
});
