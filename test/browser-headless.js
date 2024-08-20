// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// test in puppeteer browser
require('@probe.gl/test-utils/polyfill');
// ensure probe gets access to pure console first
require('@probe.gl/log');

const test = require('tape-catch');
const enableDOMLogging = require('@probe.gl/test-utils')._enableDOMLogging;
let failed = false;
test.onFailure(() => {
  failed = true;
  window.browserTestDriver_fail();
});
test.onFinish(window.browserTestDriver_finish || (() => {}));

// tap-browser-color alternative
enableDOMLogging({
  getStyle: () => ({background: failed ? '#F28E82' : '#8ECA6C'})
});

test('Browser tests', t => {
  require('./browser-headless/index.js');
  t.end();
});
