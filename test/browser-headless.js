// Copyright (c) 2023 Uber Technologies, Inc.
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
  getStyle: message => ({background: failed ? '#F28E82' : '#8ECA6C'})
});

test('Browser tests', t => {
  require('./browser-headless/index.js');
  t.end();
});
